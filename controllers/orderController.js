// controllers/orderController.js
import Order from '../models/Order.js';

// Membuat pesanan baru
export const createOrder = async (req, res) => {
  const { userId, products, totalAmount } = req.body;

  if (!userId || !products || !totalAmount) {
    return res.status(400).json({ message: 'Data yang diperlukan tidak lengkap' });
  }

  try {
    const newOrder = new Order({ userId, products, totalAmount });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat pesanan', error: error.message });
  }
};

// Mendapatkan semua pesanan
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').populate('products.productId', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil pesanan', error: error.message });
  }
};

// Mendapatkan pesanan berdasarkan ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('userId', 'name email').populate('products.productId', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil pesanan', error: error.message });
  }
};

// Memperbarui status pesanan
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui pesanan', error: error.message });
  }
};

// Menghapus pesanan
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pesanan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pesanan', error: error.message });
  }
};
