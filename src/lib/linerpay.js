// ─────────────────────────────────────────────────────────────────────────────
// LinerPay recharge provider adapter — the ONLY file that talks to LinerPay.
//
// Real calls: Recharge2 + statuscheck (GET, token in query string — server only).
// Set LINERPAY_MOCK=true to exercise the whole flow against a simulator.
//
// Result shape used by the rest of the app:
//   { status: "SUCCESS" | "PENDING" | "FAILED", providerRef, operatorRef, message }
//
// Mock behaviour (by last digit of the number / customer ID):
//   0 → FAILED, 1 → PENDING for ~20s then SUCCESS, anything else → SUCCESS.
// ─────────────────────────────────────────────────────────────────────────────

const env = (name) => process.env[name] || "";

export const isMock = () => process.env.LINERPAY_MOCK === "true";

const config = () => ({
  token: env("LINERPAY_API_TOKEN"),
  baseUrl: (env("LINERPAY_BASE_URL") || "https://linerpay.in/api").replace(/\/+$/, ""),
});

// OpId codes are configured only through the environment. Missing, blank,
// or "TODO" values are refused before any request is sent.
export const OPERATOR_CODES = {
  get jio() { return env("LINERPAY_OP_JIO").trim(); },
  get airtel() { return env("LINERPAY_OP_AIRTEL").trim(); },
  get vi() { return env("LINERPAY_OP_VI").trim(); },
  get bsnl() { return env("LINERPAY_OP_BSNL").trim(); },
  get "tata-play"() { return env("LINERPAY_OP_TATA_PLAY").trim(); },
  get "airtel-digital-tv"() { return env("LINERPAY_OP_AIRTEL_DIGITAL_TV").trim(); },
  get "dish-tv"() { return env("LINERPAY_OP_DISH_TV").trim(); },
  get d2h() { return env("LINERPAY_OP_D2H").trim(); },
  get "sun-direct"() { return env("LINERPAY_OP_SUN_DIRECT").trim(); },
};
const operatorCode = (slug) => {
  const code = Object.hasOwn(OPERATOR_CODES, slug) ? OPERATOR_CODES[slug] : null;
  return code && code !== "TODO" ? code : null;
};

const mockStore = new Map(); // txnId → first-seen time (dev only, per process)

function mockResult(txn, checking) {
  const last = String(txn.number).slice(-1);
  const ref = `MOCK-${txn.txnId.slice(-8)}`;
  if (last === "0") return { status: "FAILED", providerRef: ref, message: "Mock: operator declined" };
  if (last === "1") {
    if (!mockStore.has(txn.txnId)) mockStore.set(txn.txnId, Date.now());
    const done = Date.now() - mockStore.get(txn.txnId) > 20000;
    return done
      ? { status: "SUCCESS", providerRef: ref, operatorRef: `OP-${ref}`, message: "Mock: success" }
      : { status: "PENDING", providerRef: ref, message: "Mock: pending" };
  }
  return { status: "SUCCESS", providerRef: ref, operatorRef: `OP-${ref}`, message: "Mock: success" };
}

// Definitive "this recharge did not happen" codes. Everything else with
// STATUS 3 is also a failure, but these are the ones we are sure about.
const ADMIN_ALERT_CODES = new Set(["1", "2", "7", "9", "17", "18"]); // our account/IP/balance problem (an unlisted IP comes back as code 2)
const PENDING_CODES = new Set(["16", "21", "102", "104"]);

/** Map a LinerPay JSON body onto SUCCESS / PENDING / FAILED. Exported for tests. */
export function mapResponse(j, { checking = false } = {}) {
  const code = String(j?.ERRORCODE ?? "");
  const base = {
    providerRef: j?.TXNNO != null ? String(j.TXNNO) : undefined,
    operatorRef: j?.OPTXNID ? String(j.OPTXNID) : undefined,
    message: j?.MESSAGE || "",
  };
  const status = Number(j?.STATUS);
  if (status === 1) return { ...base, status: "SUCCESS" };
  if (status === 2 || PENDING_CODES.has(code)) return { ...base, status: "PENDING" };
  if (status === 3) {
    if (ADMIN_ALERT_CODES.has(code)) console.error(`[linerpay] ACTION NEEDED: error ${code} — ${base.message}`);
    // "No record found" right after sending can just be lag on their side.
    if (checking && code === "26") return { ...base, status: "PENDING" };
    return { ...base, status: "FAILED" };
  }
  // No STATUS (e.g. status check "Request is processed!"), or code 6/unknown: not final.
  return { ...base, status: "PENDING" };
}

async function callProvider(action, params, opts) {
  const cfg = config();
  if (!cfg.token) throw new Error("LinerPay API token is not configured");
  const path = action === "recharge" ? "/Service/Recharge2" : "/service/statuscheck";
  const url = new URL(cfg.baseUrl + path);
  url.searchParams.set("ApiToken", cfg.token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  let res;
  try {
    res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
  } catch (err) {
    // Never leak the token via the URL in error text.
    throw new Error(`LinerPay ${action} request failed: ${err.name}`);
  }
  if (res.status >= 500) throw new Error(`LinerPay ${action} HTTP ${res.status}`);
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`LinerPay ${action} returned non-JSON`);
  }
  return mapResponse(json, opts);
}

/** Send a recharge. Throws on network/unknown errors (caller treats that as still-processing). */
export async function submitRecharge(txn) {
  if (isMock()) return mockResult(txn, false);
  const OpId = operatorCode(txn.operator);
  if (!OpId) throw new Error(`No LinerPay operator code for "${txn.operator}"`);
  return callProvider("recharge", {
    MobileNo: txn.number, // DTH: the customer ID
    Amount: txn.amount,
    OpId,
    RefTxnId: txn.txnId,
  });
}

/** Ask the provider for the current result of a recharge we already sent. */
export async function checkRechargeStatus(txn) {
  if (isMock()) return mockResult(txn, true);
  return callProvider("status", { RefTxnId: txn.txnId }, { checking: true });
}
