import { assertIsolatedPostgres } from "./lib/assert-isolated-postgres";
assertIsolatedPostgres().then(() => console.log(JSON.stringify({ isolatedPostgresTargetValidated: true, distinctNeonBranchesVerified: true }))).catch((error) => { console.error(error.message); process.exitCode = 1; });
