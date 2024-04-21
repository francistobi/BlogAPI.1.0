const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongodb = (url) => {
  mongoose.connect(url);
  mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB successfully`);
  });
  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
  });
};

module.exports = { connectToMongodb };
