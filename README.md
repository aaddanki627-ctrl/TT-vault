# TrustVault
Secure document sharing platform - MERN. See docs/README.md for full docs.

## Quick Start
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Local demo accounts
After MongoDB is available and the backend environment is configured, seed demo accounts:
```bash
cd backend
npm run seed:demo
```

The sign-in page lists the demo roles and passwords. The seeder creates or resets only the
`@trustvault.demo` accounts, so rerun it if you need to restore the demo credentials. These
accounts and passwords are for local development only; do not use them in production.
