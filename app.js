// app.js
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Koneksi ke MongoDB berhasil'))
.catch((error) => console.error('❌ Koneksi ke MongoDB gagal:', error));

// Menggunakan rute produk
app.use('/api/products', productRoutes);

// Menggunakan rute pengguna
app.use('/api/users', userRoutes);

// Menggunakan rute pesanan
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
