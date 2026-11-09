import express from 'express';
import {register,login,logout,me} from '../controllers/auth.controller.js';
import {requireAuth} from '../middleware/auth.js';
const r=express.Router();
r.post('/register',register); r.post('/login',login); r.post('/logout',requireAuth,logout); r.get('/me',requireAuth,me);
export default r;
