import express from 'express';
import {listAudit} from '../controllers/audit.controller.js';
import {requireAuth,requireRole} from '../middleware/auth.js';
const r=express.Router();
r.use(requireAuth,requireRole('ADMIN'));
r.get('/',listAudit);
export default r;
