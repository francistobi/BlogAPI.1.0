const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/user.model");

const age = 60 * 60;
const createJwt = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: age });
};

const signup_get = (req, res) => {
  res.render("register");
};
const login_get = (req, res) => {
  res.render("login");
}

const signup_post = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });
    console.log("User created successfully:", user);
    const token = createJwt(user.id, email);
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/api/v1/auth/login");
    // console.log(user.id)
    console.log("Redirecting to /api/v1/auth/login");
  } catch (err) {
    console.log(err);
    res.status(400).redirect("/api/v1/auth/signup");
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = createJwt(user.id, email);
        res.cookie("jwt", token,{ httpOnly: true });
        
        // res.redirect("/api/v1/blog");
        res.render("home");
      } else {
        res.redirect("/api/v1/auth/login");
      }
    } else {
      res.redirect("/api/v1/auth/login");
    }
  } catch (err) {
    console.log(err);
    res.status(400).redirect("/api/v1/auth/login");
  }
};
const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.render("home")
};
module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout
};
