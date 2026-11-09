import mongoose from 'mongoose';
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/trustvault';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB failed:', e.message);
    process.exit(1);
  }
};
