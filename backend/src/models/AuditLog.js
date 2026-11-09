import mongoose from 'mongoose';
const s = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, actorEmail:{type:String}, action:{type:String,required:true}, document:{type:mongoose.Schema.Types.ObjectId,ref:'Document'}, targetUser:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, success:{type:Boolean,required:true}, ip:{type:String}, details:{type:String} }, {timestamps:true});
export default mongoose.model('AuditLog', s);
