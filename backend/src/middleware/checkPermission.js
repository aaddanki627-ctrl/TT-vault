import Document from '../models/Document.js';
import Permission from '../models/Permission.js';
import { logAudit } from '../utils/audit.js';
export const loadDocument = async (req,res,next)=>{
  const doc = await Document.findById(req.params.id);
  if(!doc) return res.status(404).json({message:'Document not found'});
  req.document=doc; next();
};
export const requireDocAccess = (needed='READ') => async (req,res,next)=>{
  try{
    const doc=req.document;
    if(!doc) return res.status(404).json({message:'Document not found'});
    if(req.user.role==='ADMIN') return next();
    if(String(doc.owner)===String(req.user.id)) return next();
    const perm=await Permission.findOne({document:doc._id,user:req.user.id});
    if(!perm) { await logAudit({user:req.user.id,actorEmail:req.user.email,action:'DENIED_ACCESS',document:doc._id,success:false,ip:req.ip,details:`Needed ${needed}, no permission`}); return res.status(403).json({message:'No permission'}); }
    if(needed==='EDIT' && perm.access!=='EDIT') { await logAudit({user:req.user.id,actorEmail:req.user.email,action:'DENIED_EDIT',document:doc._id,success:false,ip:req.ip,details:'READ only'}); return res.status(403).json({message:'Read only'}); }
    req.permission=perm; next();
  }catch(e){ return res.status(500).json({message:e.message}); }
};
