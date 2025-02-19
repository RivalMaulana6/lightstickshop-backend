import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Koneksi ke MongoDB berhasil');
  } catch (error) {
    console.error(`❌ Koneksi ke MongoDB gagal: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
