import AuditLog from '../models/AuditLog.js';
export const logAudit = async ({user,actorEmail,action,document,targetUser,success,ip,details})=>{
  try{ await AuditLog.create({user:user||null,actorEmail:actorEmail||'',action,document:document||null,targetUser:targetUser||null,success:!!success,ip:ip||'',details:details||''}); }catch(e){ console.error('Audit failed',e.message); }
};
