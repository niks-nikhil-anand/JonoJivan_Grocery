import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(path.resolve(process.cwd()), process.env.NODE_ENV !== "production");

type NeonBranch = { id?: string; project_id?: string };
type NeonEndpoint = { branch_id?: string; host?: string };

function neonErrorCategory(status: number) {
  if (status === 401) return "authorization failed";
  if (status === 403) return "permission denied";
  if (status === 404) return "project or API resource not found";
  if (status === 429) return "rate limited";
  return "Neon API request failed";
}

async function readNeonJson<T>(resource: string, apiKey: string) {
  const response = await fetch(`https://console.neon.tech/api/v2${resource}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
  });

  if (!response.ok) {
    // Do not include Neon response bodies: they can contain provider metadata.
    throw new Error(`Neon branch identity verification ${neonErrorCategory(response.status)} (HTTP ${response.status})`);
  }

  try {
    return await response.json() as T;
  } catch {
    throw new Error("Neon branch identity verification received an invalid API response");
  }
}

function normalizeHost(host: string) {
  return host.trim().toLowerCase().replace(/\.$/, "");
}

export async function assertIsolatedPostgres() {
  const testUrl = process.env.RESTORE_TEST_DATABASE_URL;
  const productionUrl = process.env.DATABASE_URL;
  const testBranchId = process.env.RESTORE_TEST_NEON_BRANCH_ID;
  const productionBranchId = process.env.PRODUCTION_NEON_BRANCH_ID;
  const apiKey = process.env.NEON_API_KEY;
  const projectId = process.env.NEON_PROJECT_ID;

  if (!testUrl || !productionUrl || !testBranchId || !productionBranchId) {
    throw new Error("Isolated URL and Neon branch IDs are required");
  }
  if (!apiKey || !projectId) {
    throw new Error("NEON_API_KEY and NEON_PROJECT_ID are required to independently verify branch identity");
  }
  if (testUrl === productionUrl || testBranchId === productionBranchId) {
    throw new Error("Test target must differ from production");
  }

  let testHost: string;
  let productionHost: string;
  try {
    testHost = normalizeHost(new URL(testUrl).hostname);
    productionHost = normalizeHost(new URL(productionUrl).hostname);
  } catch {
    throw new Error("PostgreSQL connection URL is invalid");
  }
  if (/-pooler/i.test(testHost)) {
    throw new Error("Use a direct Neon endpoint, not a pooled endpoint");
  }
  if (testHost === productionHost) {
    throw new Error("Test endpoint hostname must differ from the production endpoint");
  }

  const branchPayload = await readNeonJson<{ branches?: NeonBranch[] }>(
    `/projects/${encodeURIComponent(projectId)}/branches`,
    apiKey,
  );
  const branches = Array.isArray(branchPayload.branches) ? branchPayload.branches : [];
  const productionBranch = branches.find((branch) => branch.id === productionBranchId);
  const testBranch = branches.find((branch) => branch.id === testBranchId);

  if (!productionBranch || !testBranch) {
    throw new Error("Configured Neon branch ID was not found in the configured project");
  }
  if (productionBranch.project_id !== projectId || testBranch.project_id !== projectId) {
    throw new Error("Configured Neon branch does not belong to the configured project");
  }

  const endpointPayload = await readNeonJson<{ endpoints?: NeonEndpoint[] }>(
    `/projects/${encodeURIComponent(projectId)}/endpoints`,
    apiKey,
  );
  const endpoints = Array.isArray(endpointPayload.endpoints) ? endpointPayload.endpoints : [];
  const matchingTestEndpoint = endpoints.find(
    (endpoint) => endpoint.branch_id === testBranchId && endpoint.host && normalizeHost(endpoint.host) === testHost,
  );

  if (!matchingTestEndpoint) {
    throw new Error("RESTORE_TEST_DATABASE_URL endpoint is not assigned to the declared isolated Neon branch");
  }
  if (endpoints.some((endpoint) => endpoint.branch_id === productionBranchId && endpoint.host && normalizeHost(endpoint.host) === testHost)) {
    throw new Error("RESTORE_TEST_DATABASE_URL endpoint is assigned to the production Neon branch");
  }

  return testUrl;
}
