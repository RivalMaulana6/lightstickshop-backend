import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  totalPrice: Number,
  paymentMethod: String,
  status: { type: String, default: 'Pending' }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;