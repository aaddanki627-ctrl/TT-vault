import fs from 'fs'; import path from 'path';
import Document from '../models/Document.js';
import Permission from '../models/Permission.js';
import { validateFile, ALLOWED_EXT } from '../utils/virusScan.js';
import { logAudit } from '../utils/audit.js';
const uploadsDir=path.join(process.cwd(),'uploads');
if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir,{recursive:true});
export const upload=async(req,res)=>{
  try{
    if(!req.file) return res.status(400).json({message:'File required'});
    const err=validateFile(req.file);
    if(err){ await logAudit({user:req.user.id,actorEmail:req.user.email,action:'UPLOAD_BLOCKED',success:false,ip:req.ip,details:err}); return res.status(400).json({message:err}); }
    const ext=path.extname(req.file.originalname).toLowerCase();
    if(!ALLOWED_EXT.includes(ext)) return res.status(400).json({message:'Extension not allowed'});
    const safeName=Date.now()+'-'+req.file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_');
    const dest=path.join(uploadsDir,safeName);
    fs.writeFileSync(dest, req.file.buffer);
    const doc=await Document.create({title:req.body.title||req.file.originalname,category:req.body.category||'General',owner:req.user.id,fileName:req.file.originalname,filePath:safeName,mimeType:req.file.mimetype,size:req.file.size});
    await logAudit({user:req.user.id,actorEmail:req.user.email,action:'UPLOAD',document:doc._id,success:true,ip:req.ip,details:doc.title});
    res.status(201).json({document:doc});
  }catch(e){ res.status(500).json({message:e.message}); }
};
export const listMine=async(req,res)=>{
  const {q,category}=req.query;
  const filter={};
  if(req.user.role!=='ADMIN'){
    const perms=await Permission.find({user:req.user.id}).select('document');
    const ids=perms.map(p=>p.document);
    filter.$or=[{owner:req.user.id},{_id:{$in:ids}}];
  }
  if(category) filter.category=category;
  if(q) filter.title={$regex:q,$options:'i'};
  const docs=await Document.find(filter).populate('owner','name email').sort({createdAt:-1});
  res.json({documents:docs});
};
export const getOne=async(req,res)=>{ await logAudit({user:req.user.id,actorEmail:req.user.email,action:'VIEW',document:req.document._id,success:true,ip:req.ip}); res.json({document:req.document}); };
export const download=async(req,res)=>{
  const file=path.join(uploadsDir, path.basename(req.document.filePath));
  if(!fs.existsSync(file)) return res.status(404).json({message:'File missing on disk'});
  await logAudit({user:req.user.id,actorEmail:req.user.email,action:'DOWNLOAD',document:req.document._id,success:true,ip:req.ip});
  res.download(file, req.document.fileName);
};
export const remove=async(req,res)=>{
  const isOwner=String(req.document.owner)===String(req.user.id);
  if(req.user.role!=='ADMIN' && !isOwner) return res.status(403).json({message:'Only owner/admin can delete'});
  const file=path.join(uploadsDir, path.basename(req.document.filePath));
  if(fs.existsSync(file)) fs.unlinkSync(file);
  await Permission.deleteMany({document:req.document._id});
  await Document.findByIdAndDelete(req.document._id);
  await logAudit({user:req.user.id,actorEmail:req.user.email,action:'DELETE',document:req.document._id,success:true,ip:req.ip});
  res.json({message:'Deleted'});
};
