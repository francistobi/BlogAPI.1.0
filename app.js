require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { connectToMongodb } = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(methodOverride("_method"))

app.set("view engine", "ejs") // setting view engine
app.set("views", "views") // setting views folder

const authRoute = require("./route/auth.route")
const blogRoute = require("./route/blog.route")

//route
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);

app.get("/", (req, res) => {
  console.log("welcome");
  res.render("home");
});

app.use(notFound);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectToMongodb(MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`server started successfully at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start()
