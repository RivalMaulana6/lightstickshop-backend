// routes/productRoutes.js
import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Rute untuk menambahkan produk baru
router.post('/products', addProduct);

// Rute untuk mendapatkan semua produk
router.get('/products', getAllProducts);

// Rute untuk mendapatkan produk berdasarkan ID
router.get('/products/:id', getProductById);

// Rute untuk memperbarui produk berdasarkan ID
router.put('/products/:id', updateProduct);

// Rute untuk menghapus produk berdasarkan ID
router.delete('/products/:id', deleteProduct);

export default router;
