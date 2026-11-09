# DB Schema
User {_id, name, email unique, passwordHash, role ADMIN|OWNER|VIEWER}
Document {_id, title, category, owner -> User, fileName, filePath, mimeType, size}
Permission {document -> Document, user -> User, access READ|EDIT, unique(document,user)}
AuditLog {_id, user, actorEmail, action, document, targetUser, success, ip, details, createdAt} - NO update/delete API
