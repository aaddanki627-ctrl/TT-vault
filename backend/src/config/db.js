import mongoose from 'mongoose';
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://ar9542550:38E1Y9VaQPuGzbMJ@akhileswar.wyzldsp.mongodb.net/resvault?retryWrites=true&w=majority&appName=Akhileswar';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB failed:', e.message);
    process.exit(1);
  }
};
