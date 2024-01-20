const User = require("../models/userModel");
const createAsyncError = require("../middleware/createAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sentToken = require("../utils/jwtToken");
const sentEmail = require("../utils/sentEmail");
const crypto = require("crypto");

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

// Forgot Password
exports.forgotPassword = createAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Get ResetPassword Token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requseted this email then please ignore it.`;

  try {
    await sentEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully `,
      resetToken,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//  Reset Password
exports.resetPassword = createAsyncError(async (req, res, next) => {
  // creatind Token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is Invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sentToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = createAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});
