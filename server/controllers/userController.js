const User = require("../models/userModel");
const createAsyncError = require("../middleware/createAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sentToken = require("../utils/jwtToken");
const sentEmail = require("../utils/sentEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//  Register User
exports.registerUser = createAsyncError(async (req, res, next) => {
  //  Add Cloudinary for Uploading files

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 720,
    crop: "scale",
    resource_type: "auto",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
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

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

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
      // resetToken,
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
exports.getUserDetail = createAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

// Update User Password
exports.updatePassword = createAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't matched", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sentToken(user, 200, res);
});

// Update User Profile
exports.updateUserProfile = createAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //  We will add Couldinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    // user
  });
});

//  Get All User -- Admin
exports.getAllUser = createAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ success: true, users });
});

//  Get Single User -- Admin
exports.getSingleUser = createAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id} `, 400)
    );
  }

  res.status(200).json({ success: true, user });
});

// Update User Role -- Admin
exports.updateUserRole = createAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

// Update User Role -- Admin
exports.deleteUser = createAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //  We will remove Couldinary later

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  await user.deleteOne({ _id: user.id });

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
