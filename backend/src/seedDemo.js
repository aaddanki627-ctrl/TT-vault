import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {connectDB} from './config/db.js';
import User from './models/User.js';

const demoUsers = [
  {name: 'Demo Admin', email: 'admin@trustvault.demo', password: 'DemoAdmin!2026', role: 'ADMIN'},
  {name: 'Demo Owner', email: 'owner@trustvault.demo', password: 'DemoOwner!2026', role: 'OWNER'},
  {name: 'Demo Viewer', email: 'viewer@trustvault.demo', password: 'DemoViewer!2026', role: 'VIEWER'},
];

try {
  await connectDB();
  for (const {name, email, password, role} of demoUsers) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      {email},
      {$set: {name, email, passwordHash, role}},
      {upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true},
    );
    console.log(`Ready: ${email} (${role})`);
  }
  console.log('Demo accounts seeded. These credentials are for local development only.');
} catch (error) {
  console.error('Could not seed demo accounts:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
