const User = require("../models/userModel");
const createAsyncError = require("../middleware/createAsyncError");
const ErrorHandler = require("../utils/errorHandler");

//  Register User
exports.registerUser = createAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });

  res.status(201).json({
    success: true,
    user,
  });
});
