import mongoose from 'mongoose';
const s = new mongoose.Schema({ title:{type:String,required:true,trim:true}, category:{type:String,default:'General',trim:true}, owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, fileName:{type:String,required:true}, filePath:{type:String,required:true}, mimeType:{type:String}, size:{type:Number}, version:{type:Number,default:1} }, {timestamps:true});
s.index({title:'text',category:'text'});
export default mongoose.model('Document', s);
