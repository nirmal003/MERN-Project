const Order = require("../models/orderModel");
const createAsyncError = require("../middleware/createAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Product = require("../models/productModel");

//  Create New Order
exports.newOrder = createAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({ success: true, order });
});

//  Get Single Order
exports.getSingleOrder = createAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({ success: true, order });
});

//  Get Logged in User Orders
exports.myOrders = createAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({ success: true, orders });
});

//  Get All Orders -- Admin
exports.getAllOrders = createAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  const totalAmount = orders.reduce((acc, order) => {
    return acc + order.totalPrice;
  }, 0);

  res.status(200).json({ success: true, totalAmount, orders });
});
