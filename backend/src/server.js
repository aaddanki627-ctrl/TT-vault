import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import app from './app.js';
import {connectDB} from './config/db.js';
app.use(cors({origin:'https://trust-vault-1op2.onrender.com/',credentials:true}));
const PORT=process.env.PORT||5000;
await connectDB();
app.listen(PORT,()=>console.log(`TrustVault backend on ${PORT}`));
