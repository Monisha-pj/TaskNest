const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    // check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: 'User already exists' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // send token + user info
    res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });

  } catch (err) {
    console.error('❌ Register Error:', err); // 👈 REAL ERROR LOGGED
    res.status(500).json({ msg: err.message }); // 👈 REAL MESSAGE SENT TO CLIENT
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
