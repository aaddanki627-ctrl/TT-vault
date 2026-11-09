# PROMPTS.md - AI Usage Log
## Entry 1 - 2026-11-09 - Scaffold
Asked: MERN folder structure. AI gave: 3 folders. Mistake: AI initially allowed frontend-only hiding. Fix: Added server checkPermission. Commit: scaffold.
## Entry 2 - 2026-11-09 - Auth
Asked: JWT auth. AI gave: verify only. Mistake: No revoke. Fix: Added blacklist. Commit: scaffold.
## Entry 3 - 2026-11-09 - List API
Asked: List docs. AI gave: return all. Mistake: Permission leak. Fix: Filter by owner/permission. Commit: scaffold.
## Entry 4 - 2026-11-09 - Upload
Asked: Upload. AI gave: accept any file. Mistake: No validation. Fix: Allowlist + MZ check. Commit: scaffold.
## Entry 5 - 2026-11-09 - Audit
Asked: Audit. AI gave: log only success. Mistake: Missed failed attempts. Fix: Log DENIED + LOGIN_FAIL. Commit: scaffold.
