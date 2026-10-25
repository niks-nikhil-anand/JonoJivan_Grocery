import "dotenv/config";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Real Neon queries, isolated from application records. All money-moving calls
// are intercepted and use dummy credentials. The temporary schema is removed.
const schema = `recharge_test_${randomUUID().replaceAll("-", "")}`;
const require = createRequire(import.meta.url);
const SDKApi = require("razorpay/dist/api");
const savedEnv = { ...process.env };
const originalFetch = globalThis.fetch;
const originalWindow = (globalThis as any).window;
const originalPrisma = (globalThis as any).__jonojivanPrisma;
const originalApiMethods = Object.fromEntries(["post", "get", "put", "patch", "delete", "postFormData"].map(name => [name, SDKApi.prototype[name]]));
const admin = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, query_timeout: 30000, max: 1 });
let db: PrismaClient;
let schemaCreated = false;
let passed = 0;
let serial = 0;
const capturedOrders = new Map<string, any>();
const providerCalls: URL[] = [];
const refundCalls: any[] = [];
const capturedPayments = new Map<string, any[]>();
let rechargeResult: any = { STATUS: 1, TXNNO: "provider-success", OPTXNID: "operator-success", MESSAGE: "Success" };
let statusResult: any = rechargeResult;
let failNetwork = false;
function pass(message: string) { passed++; console.log(`PASS ${message}`); }
function sign(orderId: string, paymentId: string) { return createHmac("sha256", process.env.RAZORPAY_SECRET!).update(`${orderId}|${paymentId}`).digest("hex"); }

async function main() {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required");
  const ddl = readFileSync(new URL("../prisma/migrations/20261022082525_init/migration.sql", import.meta.url), "utf8");
  const tableDDL = ddl.match(/CREATE TABLE "RechargeTransaction" \([\s\S]*?\n\);/)?.[0];
  assert.ok(tableDDL, "Recharge table DDL must be available");
  await admin.query(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  for (const name of ["RechargeType", "RechargeStatus"]) {
    const enumDDL = ddl.match(new RegExp(`CREATE TYPE "${name}" AS ENUM \\([^;]+;`))?.[0];
    assert.ok(enumDDL);
    await admin.query(enumDDL.replace(`CREATE TYPE "${name}"`, `CREATE TYPE "${schema}"."${name}"`));
  }
  await admin.query(tableDDL.replace('CREATE TABLE "RechargeTransaction"', `CREATE TABLE "${schema}"."RechargeTransaction"`).replaceAll('"RechargeType"', `"${schema}"."RechargeType"`).replaceAll('"RechargeStatus"', `"${schema}"."RechargeStatus"`));
  const indexDDLs = [...ddl.matchAll(/CREATE (?:UNIQUE )?INDEX [^;]+ ON "RechargeTransaction"\([^;]+;/g)].map(match => match[0]);
  assert.ok(indexDDLs.length > 0);
  for (const indexDDL of indexDDLs) await admin.query(indexDDL.replace('ON "RechargeTransaction"', `ON "${schema}"."RechargeTransaction"`));
  db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 }, { schema }) });
  (globalThis as any).__jonojivanPrisma = db;
  assert.equal(await db.rechargeTransaction.count(), 0);
  pass("isolated Neon schema connected; application recharge records are not used");

  // No credentials for real LinerPay or Razorpay are available to the test flow.
  process.env.LINERPAY_MOCK = "false";
  process.env.LINERPAY_API_TOKEN = "recharge-test-token";
  process.env.LINERPAY_BASE_URL = "https://linerpay.test/api";
  process.env.RAZORPAY_KEY_ID = "rzp_test_local_intercept";
  process.env.RAZORPAY_SECRET = "recharge-test-signing-secret";
  process.env.NEXT_PUBLIC_RECHARGE_LIVE = "true";
  process.env.CRON_SECRET = "recharge-test-cron-secret";
  for (const method of Object.keys(originalApiMethods)) SDKApi.prototype[method] = async () => { throw new Error(`Unexpected payment SDK ${method} call blocked`); };
  SDKApi.prototype.post = async ({ url, data }: any) => {
    if (url === "/orders") {
      const id = `order_intercept_${++serial}`;
      const order = { ...data, id, status: "created" };
      capturedOrders.set(id, order);
      return order;
    }
    if (/^\/payments\/pay_intercept_[a-zA-Z0-9_]+\/refund$/.test(url)) {
      const refund = { id: `refund_intercept_${++serial}`, url, ...data };
      refundCalls.push(refund);
      return refund;
    }
    throw new Error("Unexpected money-moving API call blocked");
  };
  SDKApi.prototype.get = async ({ url }: any) => {
    const match = /^\/orders\/([^/]+)\/payments$/.exec(url);
    assert.ok(match, "Unexpected payment SDK read blocked");
    return { items: capturedPayments.get(match[1]) || [] };
  };

  const { POST: createOrder } = await import("../src/app/api/recharge/order/route");
  const { POST: verifyPayment } = await import("../src/app/api/recharge/verify/route");
  const { GET: getStatus } = await import("../src/app/api/recharge/status/[txnId]/route");
  const { GET: providerCallback } = await import("../src/app/api/recharge/callback/route");
  const { GET: reconcileRoute } = await import("../src/app/api/recharge/reconcile/route");
  const { submitRecharge } = await import("../src/lib/linerpay");
  const { COMMISSION } = await import("../src/lib/recharge/commission");
  const { OPERATORS, DTH_OPERATORS } = await import("../src/config/recharge");
  const { startRechargeCheckout } = await import("../src/lib/recharge/client");
  const appPrisma = (await import("../src/lib/prisma")).default;
  assert.equal(appPrisma, db, "Application handlers must use the isolated Neon Prisma client");

  async function request(path: string, body?: any) {
    const req = new Request(`http://recharge.test${path}`, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", "x-forwarded-for": `recharge-test-${++serial}` }, ...(body ? { body: JSON.stringify(body) } : {}) });
    if (path === "/api/recharge/order") return createOrder(req);
    if (path === "/api/recharge/verify") return verifyPayment(req);
    throw new Error(`Unexpected application request blocked: ${path}`);
  }
  globalThis.fetch = (async (input: any, init?: any) => {
    const text = input instanceof URL ? input.href : String(input);
    if (text.startsWith("/api/")) return request(text, init?.body ? JSON.parse(init.body) : undefined);
    const url = new URL(text);
    assert.equal(url.origin, "https://linerpay.test", "Unexpected external fetch blocked");
    providerCalls.push(url);
    if (url.pathname === "/api/Service/Recharge2") {
      assert.equal(url.searchParams.get("ApiToken"), "recharge-test-token");
      if (failNetwork) throw new TypeError("Simulated connection interruption");
      return new Response(JSON.stringify(rechargeResult));
    }
    assert.equal(url.pathname, "/api/service/statuscheck");
    assert.equal(url.searchParams.has("OpId"), false);
    return new Response(JSON.stringify(statusResult));
  }) as any;

  const all = [...OPERATORS.map(op => ({ ...op, type: "mobile", number: "9999999992" })), ...DTH_OPERATORS.map(op => ({ ...op, type: "dth", number: op.slug === "dish-tv" || op.slug === "sun-direct" ? "12345678902" : "1234567892" }))];
  function payload(op: any) { return { type: op.type, operator: op.slug, number: op.number, amount: 200, circle: "Assam", planLabel: "Isolated integration test" }; }
  async function order(op: any) {
    const response = await request("/api/recharge/order", payload(op));
    assert.equal(response.status, 200, `Order creation failed for ${op.slug}: ${await response.clone().text()}`);
    const result = await response.json();
    const persisted = await db.rechargeTransaction.findUniqueOrThrow({ where: { transactionId: result.txnId } });
    assert.equal(persisted.type, op.type.toUpperCase()); assert.equal(persisted.operator, op.slug);
    assert.equal(persisted.subscriberNumber, op.number); assert.equal(Number(persisted.amount), 200); assert.equal(persisted.status, "CREATED");
    assert.equal(capturedOrders.get(result.orderId).amount, 20000); assert.equal(capturedOrders.get(result.orderId).currency, "INR");
    return result;
  }
  async function verify(created: any, suffix = "ok") {
    const paymentId = `pay_intercept_${created.orderId}_${suffix}`;
    return request("/api/recharge/verify", { razorpay_order_id: created.orderId, razorpay_payment_id: paymentId, razorpay_signature: sign(created.orderId, paymentId) });
  }
  async function row(created: any) { return db.rechargeTransaction.findUniqueOrThrow({ where: { transactionId: created.txnId } }); }
  async function status(created: any) { const res = await getStatus(new Request("http://recharge.test/status"), { params: { txnId: created.txnId } }); assert.equal(res.status, 200); return (await res.json()).txn; }

  for (const [index, op] of all.entries()) {
    const key = `LINERPAY_OP_${op.slug.toUpperCase().replaceAll("-", "_")}`;
    const configured = savedEnv[key]?.trim();
    assert.ok(configured && configured !== "TODO", `${key} must be configured`);
    const created = await order(op);
    const count = providerCalls.length;
    const invalid = await request("/api/recharge/verify", { razorpay_order_id: created.orderId, razorpay_payment_id: "pay_intercept_invalid", razorpay_signature: "invalid" });
    assert.equal(invalid.status, 400); assert.equal((await row(created)).status, "CREATED"); assert.equal(providerCalls.length, count);
    const verified = await verify(created);
    assert.equal(verified.status, 200);
    const response = (await verified.json()).txn;
    assert.equal(response.status, "SUCCESS"); assert.equal(response.type, op.type); assert.notEqual(response.number, op.number);
    const call = providerCalls.at(-1)!;
    assert.equal(call.searchParams.get("OpId"), configured);
    assert.equal(call.searchParams.get("MobileNo"), op.number); assert.equal(call.searchParams.get("Amount"), "200"); assert.equal(call.searchParams.get("RefTxnId"), created.txnId);
    const persisted = await row(created);
    assert.equal(persisted.status, "SUCCESS"); assert.equal(persisted.providerReference, "provider-success"); assert.equal(persisted.operatorReference, "operator-success");
    assert.ok(persisted.paidAt && persisted.processingAt && persisted.completedAt);
    assert.equal(Number(persisted.commissionRate), COMMISSION[op.slug].rate);
    assert.equal(Number(persisted.commissionAmount), Math.round(200 * COMMISSION[op.slug].rate) / 100);
    const calls = providerCalls.length;
    await Promise.all([verify(created), verify(created)]);
    assert.equal(providerCalls.length, calls, "Duplicate verification must not resubmit");
    assert.equal((await status(created)).status, "SUCCESS");
    pass(`${op.type} ${op.slug}: order, signed payment, Neon persistence, env OpId=${configured}, commission, masked status and duplicate verification`);

    process.env[key] = String(9000 + index);
    const override = await order(op); assert.equal((await verify(override)).status, 200);
    assert.equal(providerCalls.at(-1)!.searchParams.get("OpId"), process.env[key]);
    process.env[key] = configured;
    for (const invalidValue of [undefined, "", " ", "TODO"]) {
      if (invalidValue === undefined) delete process.env[key]; else process.env[key] = invalidValue;
      const before = providerCalls.length;
      await assert.rejects(submitRecharge({ operator: op.slug, number: op.number, amount: 200, txnId: "test-missing-env" }), /No LinerPay operator code/);
      assert.equal(providerCalls.length, before);
    }
    process.env[key] = configured;
  }
  pass("all nine operator environment overrides are read at runtime; missing/blank/TODO values never reach LinerPay");

  for (const op of [all[0], all[4]]) {
    rechargeResult = { STATUS: 2, TXNNO: "pending-provider", MESSAGE: "Pending" };
    statusResult = rechargeResult;
    const pending = await order(op); await verify(pending);
    assert.equal((await row(pending)).status, "PROCESSING");
    assert.equal((await status(pending)).state, "processing");
    const calls = providerCalls.length;
    await status(pending); assert.equal(providerCalls.length, calls, "Status polling should be throttled");
    await db.rechargeTransaction.update({ where: { transactionId: pending.txnId }, data: { lastCheckedAt: new Date(Date.now() - 5000) } });
    statusResult = { STATUS: 1, TXNNO: "settled-provider", OPTXNID: "settled-operator" };
    assert.equal((await status(pending)).status, "SUCCESS"); assert.equal((await row(pending)).checkCount, 2);
    pass(`${op.type}: pending result persists, polling throttles, provider status completes the Neon transaction`);

    rechargeResult = { STATUS: 3, ERRORCODE: "5", MESSAGE: "Operator declined" };
    const failed = await order(op); const refundsBefore = refundCalls.length;
    await verify(failed);
    const failedRow = await row(failed);
    assert.equal(failedRow.status, "REFUNDED"); assert.ok(failedRow.refundId); assert.equal(refundCalls.length, refundsBefore + 1);
    assert.equal(refundCalls.at(-1).amount, 20000);
    const view = await status(failed); assert.equal(view.refunded, true); assert.equal(view.state, "failed");
    await verify(failed); await status(failed); assert.equal(refundCalls.length, refundsBefore + 1);
    pass(`${op.type}: failed recharge stores refund and retries do not refund again (payment calls intercepted)`);

    failNetwork = true;
    const uncertain = await order(op); const countRefunds = refundCalls.length;
    const originalError = console.error;
    console.error = (...args: any[]) => { if (!String(args[0]).includes("[recharge] submit uncertain")) originalError(...args); };
    try { await verify(uncertain); } finally { console.error = originalError; failNetwork = false; }
    assert.equal((await row(uncertain)).status, "PROCESSING"); assert.equal(refundCalls.length, countRefunds);
    assert.equal((await status(uncertain)).status, "SUCCESS");
    pass(`${op.type}: interrupted submission stays processing, avoids premature refund, and recovers through status checking`);
  }

  rechargeResult = { STATUS: 1, TXNNO: "provider-success", OPTXNID: "operator-success" };
  statusResult = rechargeResult;
  const concurrent = await order(all[0]); const before = providerCalls.length;
  const racing = await Promise.all([verify(concurrent), verify(concurrent)]);
  assert.ok(racing.every(response => response.status === 200)); assert.equal(providerCalls.length, before + 1); assert.equal((await row(concurrent)).status, "SUCCESS");
  pass("concurrent payment verification uses one atomic Neon claim and submits one recharge");

  for (const invalidPayload of [
    { ...payload(all[0]), number: "123" }, { ...payload(all[4]), number: "123" },
    { ...payload(all[0]), operator: "tata-play" }, { ...payload(all[4]), operator: "jio" },
    { ...payload(all[0]), amount: 0 }, { ...payload(all[4]), amount: 10 },
    { ...payload(all[0]), amount: 12.5 }, { ...payload(all[0]), operator: "unknown" },
  ]) { const count = capturedOrders.size; const res = await request("/api/recharge/order", invalidPayload); assert.equal(res.status, 400); assert.equal(capturedOrders.size, count); }
  pass("invalid mobile/DTH numbers, operator types and amounts are rejected before payment creation");

  const createdForRecovery = await order(all[0]);
  await db.rechargeTransaction.update({ where: { transactionId: createdForRecovery.txnId }, data: { createdAt: new Date(Date.now() - 5 * 60000) } });
  capturedPayments.set(createdForRecovery.orderId, [{ id: `pay_intercept_${createdForRecovery.orderId}_recovered`, status: "captured" }]);
  const unpaidProcessing = await order(all[4]);
  await db.rechargeTransaction.update({ where: { transactionId: unpaidProcessing.txnId }, data: { status: "PAID", paidAt: new Date(Date.now() - 120000), razorpayPaymentId: `pay_intercept_${unpaidProcessing.orderId}_paid` } });
  assert.equal((await reconcileRoute(new Request("http://recharge.test/reconcile"))).status, 401);
  const reconciled = await reconcileRoute(new Request("http://recharge.test/reconcile", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
  assert.equal(reconciled.status, 200); assert.equal((await row(createdForRecovery)).status, "SUCCESS"); assert.equal((await row(unpaidProcessing)).status, "SUCCESS");
  pass("authenticated reconciliation recovers captured mobile payments and already-paid DTH transactions in Neon");

  rechargeResult = { STATUS: 2, MESSAGE: "Still pending" }; statusResult = rechargeResult;
  const callback = await order(all[4]); await verify(callback);
  const callbackReq: any = { nextUrl: new URL(`http://recharge.test/callback?YOURREQID=${callback.txnId}&STATUS=1&OPTXNID=untrusted`) };
  assert.equal((await providerCallback(callbackReq)).status, 200); assert.equal((await row(callback)).status, "PROCESSING");
  pass("unsigned provider callback cannot mark a pending recharge successful without checking provider status");

  rechargeResult = { STATUS: 1, TXNNO: "provider-success", OPTXNID: "operator-success" }; statusResult = rechargeResult;
  for (const op of [all[0], all[4]]) {
    let checkout: any;
    (globalThis as any).window = { Razorpay: class {
      options: any;
      constructor(options: any) { this.options = options; checkout = options; }
      on() {}
      open() { const id = `pay_intercept_${this.options.order_id}_browser`; void this.options.handler({ razorpay_order_id: this.options.order_id, razorpay_payment_id: id, razorpay_signature: sign(this.options.order_id, id) }); }
    } };
    const result: any = await startRechargeCheckout(payload(op));
    assert.ok(result.txnId); assert.equal(checkout.amount, 20000);
    assert.equal((await db.rechargeTransaction.findUniqueOrThrow({ where: { transactionId: result.txnId } })).status, "SUCCESS");
    pass(`${op.type}: frontend checkout helper connects order creation, Razorpay callback, payment verification and Neon completion`);
  }
  console.log(`Recharge checks passed: ${passed}. All nine operators covered. No live recharge, payment or refund API was called.`);
}

main().catch(error => { console.error(error instanceof Error ? error.message : "Recharge integration test failed"); process.exitCode = 1; }).finally(async () => {
  globalThis.fetch = originalFetch;
  (globalThis as any).window = originalWindow;
  (globalThis as any).__jonojivanPrisma = originalPrisma;
  for (const [name, method] of Object.entries(originalApiMethods)) SDKApi.prototype[name] = method;
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
  if (db) await db.$disconnect();
  try {
    if (schemaCreated) {
      assert.match(schema, /^recharge_test_[a-f0-9]{32}$/);
      await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
      const result = await admin.query("SELECT 1 FROM information_schema.schemata WHERE schema_name = $1", [schema]);
      assert.equal(result.rowCount, 0);
      console.log("PASS temporary Neon schema and all test transactions removed");
    }
  } catch (error) { console.error("Temporary test schema cleanup failed:", error instanceof Error ? error.message : error); process.exitCode = 1; }
  finally { await admin.end(); }
});
