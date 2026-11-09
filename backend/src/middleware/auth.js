import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../utils/tokenBlacklist.js';
import { logAudit } from '../utils/audit.js';
export const requireAuth = (req,res,next)=>{
  const h=req.headers.authorization||'';
  const token=h.startsWith('Bearer ')?h.slice(7):null;
  if(!token) return res.status(401).json({message:'No token'});
  if(isBlacklisted(token)) return res.status(401).json({message:'Token revoked'});
  try{
    const decoded=jwt.verify(token, process.env.JWT_SECRET||'trustvault-dev-secret-change-in-prod-1234567890');
    req.user={id:decoded.id,email:decoded.email,role:decoded.role};
    req.token=token;
    next();
  }catch(e){ return res.status(401).json({message:'Invalid token'}); }
};
export const requireRole=(...roles)=>(req,res,next)=>{
  if(!req.user) return res.status(401).json({message:'Unauthenticated'});
  if(!roles.includes(req.user.role)) { logAudit({user:req.user.id,actorEmail:req.user.email,action:'FORBIDDEN_ROLE',success:false,ip:req.ip,details:`Needed ${roles.join(',')}`}); return res.status(403).json({message:'Forbidden role'}); }
  next();
};
