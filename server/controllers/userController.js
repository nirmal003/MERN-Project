const User = require("../models/userModel");
const createAsyncError = require("../middleware/createAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sentToken = require("../utils/jwtToken");

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

  sentToken(user, 201, res);
});

// login User
exports.loginUser = createAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    next(new ErrorHandler("Please Enter Email & Password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) next(new ErrorHandler("Invalid Email or Password", 401));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sentToken(user, 200, res);
});

// Logout User
exports.logoutUser = createAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({ success: true, message: "Logged Out" });
});
