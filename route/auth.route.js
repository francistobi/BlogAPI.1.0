const express = require("express");
const authRouter = express.Router();
const {
  signup_post,
  login_post,
  signup_get,
  login_get,
  logout
} = require("../controllers/auth");

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);
authRouter.get("/signup", signup_get);
authRouter.get("/login", login_get);
authRouter.get("/logout", logout);

module.exports = authRouter;
