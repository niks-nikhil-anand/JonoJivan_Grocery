import "dotenv/config";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import prisma from "../src/lib/prisma";

// Exercise the real cron handler while replacing database reads with an empty
// queue. No payments, provider requests, or database mutations can be triggered.
async function main() {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(config.crons, [{ path: "/api/recharge/reconcile", schedule: "0 0 * * *" }]);
  const originalConnect = prisma.$connect;
  const originalFindMany = prisma.rechargeTransaction.findMany;
  const originalSecret = process.env.CRON_SECRET;
  let reads = 0;
  (prisma as any).$connect = async () => {};
  (prisma.rechargeTransaction as any).findMany = async () => { reads++; return []; };
  try {
    assert.match(originalSecret || "", /^[a-f0-9]{64}$/, "CRON_SECRET must be the generated 256-bit value");
    const { GET } = await import("../src/app/api/recharge/reconcile/route");
    for (const authorization of [undefined, "Bearer incorrect-secret"]) {
      const response = await GET(new Request("http://cron.test/api/recharge/reconcile", { headers: authorization ? { authorization } : {} }));
      assert.equal(response.status, 401);
      assert.equal(reads, 0, "Unauthorized requests must not run reconciliation");
    }
    const authorized = await GET(new Request("http://cron.test/api/recharge/reconcile", { headers: { authorization: `Bearer ${originalSecret}` } }));
    assert.equal(authorized.status, 200);
    assert.deepEqual(await authorized.json(), { paidRecovered: 0, processed: 0, refreshed: 0, stuck: 0 });
    assert.equal(reads, 3);
    delete process.env.CRON_SECRET;
    assert.equal((await GET(new Request("http://cron.test/api/recharge/reconcile", { headers: { authorization: `Bearer ${originalSecret}` } }))).status, 401);
    assert.equal(reads, 3, "Missing configuration must fail closed");
    console.log("PASS cron authentication: missing/wrong credentials rejected; generated secret accepted; missing configuration rejected. Database reads stubbed to an empty queue; no transactions processed.");
  } finally {
    (prisma as any).$connect = originalConnect;
    (prisma.rechargeTransaction as any).findMany = originalFindMany;
    if (originalSecret === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = originalSecret;
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
