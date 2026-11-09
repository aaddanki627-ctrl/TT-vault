import Permission from '../models/Permission.js';
import User from '../models/User.js';
import { logAudit } from '../utils/audit.js';
export const grant=async(req,res)=>{
  const {userId,access}=req.body;
  if(!['READ','EDIT'].includes(access)) return res.status(400).json({message:'Invalid access'});
  const isOwner=String(req.document.owner)===String(req.user.id);
  if(req.user.role!=='ADMIN' && !isOwner) return res.status(403).json({message:'Only owner/admin'});
  const target=await User.findById(userId);
  if(!target) return res.status(404).json({message:'Target user not found'});
  if(String(target._id)===String(req.document.owner)) return res.status(400).json({message:'Owner already has access'});
  const perm=await Permission.findOneAndUpdate({document:req.document._id,user:userId},{access,grantedBy:req.user.id},{upsert:true,new:true});
  await logAudit({user:req.user.id,actorEmail:req.user.email,action:'PERMISSION_GRANT',document:req.document._id,targetUser:userId,success:true,ip:req.ip,details:access});
  res.json({permission:perm});
};
export const revoke=async(req,res)=>{
  const {userId}=req.params;
  const isOwner=String(req.document.owner)===String(req.user.id);
  if(req.user.role!=='ADMIN' && !isOwner) return res.status(403).json({message:'Only owner/admin'});
  await Permission.findOneAndDelete({document:req.document._id,user:userId});
  await logAudit({user:req.user.id,actorEmail:req.user.email,action:'PERMISSION_REVOKE',document:req.document._id,targetUser:userId,success:true,ip:req.ip});
  res.json({message:'Revoked - access stops immediately'});
};
export const listForDoc=async(req,res)=>{ const list=await Permission.find({document:req.document._id}).populate('user','name email role'); res.json({permissions:list}); };
