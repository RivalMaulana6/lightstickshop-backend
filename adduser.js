import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

connectDB(); // Koneksi ke MongoDB

const addUser = async () => {
  try {
    const user = new User({
      name: 'Rival',
      email: 'rivalmaulana990@gmail.com',
      password: 'rival123', // Pastikan password di-hash sebelum disimpan
      role: 'user',
    });

    await user.save();
    console.log('✅ User berhasil ditambahkan!');

    mongoose.connection.close(); // Tutup koneksi setelah selesai
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
};

addUser();
