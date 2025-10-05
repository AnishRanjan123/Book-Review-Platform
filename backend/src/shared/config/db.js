import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  console.log('MongoDB connected');
}


