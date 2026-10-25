# Non-production restore testing

No isolated targets are configured in the environment. Do not use `DATABASE_URL`, `BACKUP_DATABASE_URL`, or `MONGODB_URI` for restore testing.

Provide only separately created, non-production values:

```env
RESTORE_TEST_DATABASE_URL=postgresql://...non-production-neon-branch...
MONGODB_RESTORE_TEST_URI=mongodb+srv://...isolated-test-database...
```

The PostgreSQL target should be a Neon branch created from the verified backup point or another explicitly disposable database. The MongoDB target must be a separately named test database with no production data. Creating cloud branches/databases may incur account charges; obtain approval before provisioning either target.

After targets are provided, restore tests must compare table/collection counts, validate the 34 user IDs and non-secret fields, then create disposable PostgreSQL users for bcrypt, JWT, cookie, role, and disabled-account authentication tests. Keep `AUTH_DATABASE=mongodb` until those tests pass and a separate production migration is explicitly approved.
