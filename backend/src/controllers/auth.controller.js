import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { blacklistToken } from '../utils/tokenBlacklist.js';
import { logAudit } from '../utils/audit.js';
const sign=(u)=>jwt.sign({id:u._id,email:u.email,role:u.role}, process.env.JWT_SECRET||'trustvault-dev-secret-change-in-prod-1234567890', {expiresIn:process.env.JWT_EXPIRES_IN||'1h'});
export const register=async(req,res)=>{
  try{
    const {name,email,password,role}=req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    if(password.length<8) return res.status(400).json({message:'Password min 8 chars'});
    const exists=await User.findOne({email:email.toLowerCase()});
    if(exists) return res.status(409).json({message:'Email exists'});
    const hash=await bcrypt.hash(password,10);
    const allowed=['ADMIN','OWNER','VIEWER'];
    const finalRole=allowed.includes(role)?role:'VIEWER';
    const user=await User.create({name,email:email.toLowerCase(),passwordHash:hash,role:finalRole});
    await logAudit({user:user._id,actorEmail:user.email,action:'REGISTER',success:true,ip:req.ip});
    res.status(201).json({user:{id:user._id,name:user.name,email:user.email,role:user.role},token:sign(user)});
  }catch(e){ res.status(500).json({message:e.message}); }
};
export const login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email:(email||'').toLowerCase()});
    if(!user){ await logAudit({actorEmail:email||'',action:'LOGIN_FAIL',success:false,ip:req.ip,details:'User not found'}); return res.status(401).json({message:'Invalid credentials'}); }
    const ok=await bcrypt.compare(password||'',user.passwordHash);
    if(!ok){ await logAudit({user:user._id,actorEmail:user.email,action:'LOGIN_FAIL',success:false,ip:req.ip}); return res.status(401).json({message:'Invalid credentials'}); }
    await logAudit({user:user._id,actorEmail:user.email,action:'LOGIN',success:true,ip:req.ip});
    res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role},token:sign(user)});
  }catch(e){ res.status(500).json({message:e.message}); }
};
export const logout=async(req,res)=>{
  blacklistToken(req.token);
  await logAudit({user:req.user.id,actorEmail:req.user.email,action:'LOGOUT',success:true,ip:req.ip});
  res.json({message:'Logged out'});
};
export const me=async(req,res)=>{ const u=await User.findById(req.user.id).select('-passwordHash'); res.json({user:u}); };
