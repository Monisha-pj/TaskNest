// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

//   if (!token) return res.status(401).json({ msg: 'No token, access denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user; // contains { id: user._id }
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Invalid token' });
//   }
// };

// module.exports = auth;



const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Fix here
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;
