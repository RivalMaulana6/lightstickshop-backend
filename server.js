// Load environment variables dari file .env
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Pastikan frontend diizinkan
    credentials: true,
  })
);
app.use(morgan("dev"));

// Cek apakah MONGO_URI terbaca dengan benar
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI tidak ditemukan di .env");
  process.exit(1);
}

// Koneksi ke MongoDB
async function connectDB() {
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
connectDB();

// Model MongoDB untuk Produk
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String,
  stock: Number,
  description: String,
});

// Model MongoDB untuk Pengguna (Users)
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String, // Simpan password dengan hash di sistem produksi
});

// Model MongoDB untuk Keranjang Belanja (Carts)
const Cart = mongoose.model("Cart", {
  userId: String, // ID user yang memiliki keranjang
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

// API Root Check
app.get("/", (req, res) => {
  res.json({ message: "Backend Lightstick Shop is running! 🚀" });
});

// ========================= PRODUK ENDPOINT =========================

// Endpoint untuk mendapatkan daftar produk
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Endpoint untuk mendapatkan produk berdasarkan ID
app.get("/api/products/:id", async (req, res) => {
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
app.post("/api/products", async (req, res) => {
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
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Endpoint untuk menghapus produk berdasarkan ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// ========================= USERS ENDPOINT =========================

// Endpoint untuk mendapatkan semua pengguna
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// ========================= CARTS ENDPOINT =========================

// Endpoint untuk mendapatkan semua keranjang belanja
app.get("/api/carts", async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.productId");
    res.json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ message: "Error fetching carts", error });
  }
});

// Endpoint untuk mendapatkan keranjang pengguna tertentu berdasarkan userId
app.get("/api/carts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.json({ userId, items: [] }); // Jika tidak ada, kembalikan objek kosong
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Jalankan server di port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
