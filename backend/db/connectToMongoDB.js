import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB...');
  } catch (e) {
    console.log('Error connecting to MongoDB', e.message);
  }
};

export default connectToMongoDB;
