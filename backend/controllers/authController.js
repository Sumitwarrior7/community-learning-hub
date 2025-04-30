// controllers/authController.js
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtConfig');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

// @desc    Authenticate user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  console.log("password :", password)
  console.log("found user :", user)

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      credits: user.credits,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // console.log("req :", req)
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    credits: req.user.credits
  });
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
