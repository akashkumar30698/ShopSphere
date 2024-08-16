const jwt = require("jsonwebtoken")


// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, `${process.env.ACCESS_SECRET_KEY}`, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };


  module.exports  = {
    authenticateToken,
  }