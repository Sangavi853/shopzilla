// Cancel order (user can only cancel their own order if not delivered)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.user.id, isDelivered: false });
    if (!order) return res.status(404).json({ message: 'Order not found or already delivered' });
    // Optionally, restore stock for each product
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: item.qty } },
        { new: true }
      );
    }
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place new order
exports.placeOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, user: req.user.id });
    const saved = await order.save();
    // Decrease stock for each product
    for (const item of req.body.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.qty } },
        { new: true }
      );
    }
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('orderItems.product');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
