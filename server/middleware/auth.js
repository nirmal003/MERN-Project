const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const createAsyncError = require("./createAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatrdUser = createAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await userModel.findById(decodedData.id);

  next();
});
