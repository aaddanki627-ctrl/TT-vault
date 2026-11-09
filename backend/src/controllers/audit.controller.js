import AuditLog from '../models/AuditLog.js';
export const listAudit=async(req,res)=>{
  const logs=await AuditLog.find().populate('user','name email').populate('document','title').sort({createdAt:-1}).limit(200);
  res.json({logs});
};
