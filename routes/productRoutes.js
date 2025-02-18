import express from 'express';
import { getAllProducts, addProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/add', addProduct);

export default router;