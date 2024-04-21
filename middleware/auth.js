const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.redirect("/api/v1/auth/login");
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    console.log("There was no token");
    res.redirect("/api/v1/auth/login");
  }
};

module.exports = { authenticateToken };
