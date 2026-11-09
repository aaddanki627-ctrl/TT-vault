import mongoose from 'mongoose';
const s = new mongoose.Schema({ name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true}, passwordHash:{type:String,required:true}, role:{type:String,enum:['ADMIN','OWNER','VIEWER'],default:'VIEWER'} }, {timestamps:true});
export default mongoose.model('User', s);
