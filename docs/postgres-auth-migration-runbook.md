# Authentication migration runbook

Keep `AUTH_DATABASE=mongodb` until the dry-run is clean, a PostgreSQL backup exists, and the user apply operation has been explicitly approved.

Before applying, take a PostgreSQL provider snapshot/export and record its restore point. Keep MongoDB unchanged as the rollback source. Run the apply command once, then run `npm run db:verify-users`. If counts, IDs, or key fields differ, set `AUTH_DATABASE=mongodb` and restore PostgreSQL from the provider snapshot if needed. Never run the apply command as part of deployment.
