# THREATS.md
## 1. IDOR - User changes document ID in URL/API
Mitigation: Server-side checkPermission on EVERY doc API. Frontend hiding is NOT security.
## 2. JWT Revoke - Logout but old token still works
Mitigation: In-memory blacklist (prod: Redis). check in auth middleware.
## 3. Permission Leak via List - /documents returns all files
Mitigation: listMine filters by owner OR explicit Permission. No permission = not in list.
## 4. Stale Access - Revoke but download link still works
Mitigation: No public links. Every download re-checks permission + token.
## 5. Malicious Upload - .exe / virus / huge file
Mitigation: Extension allowlist, MIME block, 10MB limit, MZ header check.
## 6. Audit Tampering
Mitigation: AuditLog has no update/delete API. Only ADMIN can read.
## Known Weakness (honest)
- Blacklist is in-memory, restarts clear it. Prod needs Redis. Time leka vadilesanu, but documented.
- Virus scan is signature check only, not full AV engine.
