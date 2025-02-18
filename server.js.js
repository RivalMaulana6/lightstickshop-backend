// Load environment variables dari file .env
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Cek apakah MONGO_URI terbaca dengan benar
console.log("MONGO_URI:", process.env.MONGO_URI);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Connection failed', err));

// Model MongoDB untuk produk
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
  image: String,
});

// Endpoint untuk mendapatkan daftar produk
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Jalankan server di port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
