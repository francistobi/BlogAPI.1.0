const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  firstname: {
    type: "string",
    required: true,
  },
  lastname: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    unique: [true, "Email must be unique"],
    validate: [isEmail, "Please enter a valid email"],
  },

  password: {
    type: "string",
    required: true,
    minlength: [6, "minimum password length is six"],
  },
});


const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
