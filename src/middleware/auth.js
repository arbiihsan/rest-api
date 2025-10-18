const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid or has expired'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
