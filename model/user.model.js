const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
    // maxlength: [8, "password should be less than 8 characters"],
  },
});

// userSchema.pre("save", async function (next) {
//   const user = this;
//   const hash = await bcrypt.hash(this.password, 10);

//   this.password = hash;
//   next();
// });

// userSchema.methods.isValidPassword = async function (password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);

//   return compare;
// };

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
