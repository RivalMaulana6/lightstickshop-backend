// Load environment variables dari file .env
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Pastikan frontend diizinkan
  credentials: true,
}));
app.use(morgan('dev'));

// Cek apakah MONGO_URI terbaca dengan benar
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI tidak ditemukan di .env");
  process.exit(1);
}

// Koneksi ke MongoDB
targetConnectDB();
async function targetConnectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Connection to MongoDB failed:", error);
    process.exit(1); // Matikan server jika gagal konek DB
  }
}

// Model MongoDB untuk produk
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
  image: String,
  stock: Number,
  description: String,
});

// API Root Check
app.get('/api', (req, res) => {
  res.send('API is running...');
  res.json({ message: "Backend Lightstick Shop is running! 🚀" });
});

  res.json({ message: "Backend Lightstick Shop is running! 🚀" });

// Endpoint untuk mendapatkan daftar produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Endpoint untuk mendapatkan produk berdasarkan ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Endpoint untuk menambahkan produk baru
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error });
  }
});

// Endpoint untuk memperbarui produk berdasarkan ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Endpoint untuk menghapus produk berdasarkan ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Jalankan server di port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
