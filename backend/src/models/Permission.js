import mongoose from 'mongoose';
const s = new mongoose.Schema({ document:{type:mongoose.Schema.Types.ObjectId,ref:'Document',required:true}, user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, access:{type:String,enum:['READ','EDIT'],required:true}, grantedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'} }, {timestamps:true});
s.index({document:1,user:1},{unique:true});
export default mongoose.model('Permission', s);
