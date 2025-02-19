import express from 'express';
import mongoose from 'mongoose';
import orderRoutes from './routes/orderRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Koneksi ke MongoDB Atlas berhasil!');
})
.catch((error) => {
  console.error('Koneksi ke MongoDB Atlas gagal:', error);
});

// Menggunakan rute
app.use('/api', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
