const mongoose = require('mongoose');
const User = require('./models/User');  
const connectDB = require('./config/db');

connectDB(); // Koneksi ke MongoDB

const addUser = async () => {
  try {
    const user = new User({
      name: "Rival",
      email: "rivalmaulana990@gmail.com",
      password: "rival123",  // Akan otomatis di-hash
      role: "user"
    });

    await user.save();
    console.log("✅ User berhasil ditambahkan!");

    mongoose.connection.close(); // Tutup koneksi setelah selesai
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

addUser();
