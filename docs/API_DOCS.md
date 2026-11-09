# API Docs - Who can call what
POST /api/auth/register - Public (role defaults VIEWER)
POST /api/auth/login - Public
POST /api/auth/logout - Any logged-in (revokes token)
GET /api/auth/me - Any logged-in
POST /api/documents/upload - Any logged-in (becomes Owner)
GET /api/documents - Any logged-in, filtered to own+shared (Admin sees all)
GET /api/documents/:id - Owner/Admin/Permission READ+
GET /api/documents/:id/download - Owner/Admin/Permission READ+
DELETE /api/documents/:id - Owner/Admin only (EDIT check + owner check)
POST /api/permissions/:id/grant - Owner/Admin only
DELETE /api/permissions/:id/revoke/:userId - Owner/Admin only, immediate
GET /api/permissions/:id - Owner/Admin/READ+
GET /api/audit - ADMIN only
