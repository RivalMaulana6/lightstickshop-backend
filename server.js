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
app.use(express.urlencoded({ extended: true })); // Untuk menangani form-data
app.use(cors());
app.use(morgan('dev'));

// Cek apakah MONGO_URI terbaca dengan benar
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI tidak ditemukan! Pastikan file .env sudah dikonfigurasi.");
  process.exit(1); // Hentikan server jika MONGO_URI tidak tersedia
}
console.log("✅ MONGO_URI ditemukan:", process.env.MONGO_URI);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ Connection to MongoDB failed:', err.message);
  process.exit(1);
});

// Model MongoDB untuk produk
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
});

const Product = mongoose.model('Product', productSchema);

// ✅ Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// ✅ Endpoint untuk mendapatkan produk berdasarkan ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// ✅ Endpoint untuk menambahkan produk baru
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, stock, description } = req.body;
    
    if (!name || !price || !image || !stock) {
      return res.status(400).json({ message: "Semua field wajib diisi (name, price, image, stock)" });
    }

    const newProduct = new Product({ name, price, image, stock, description });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Endpoint untuk memperbarui produk berdasarkan ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// ✅ Endpoint untuk menghapus produk berdasarkan ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

// ✅ Jalankan server di port yang sudah dikonfigurasi di .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
