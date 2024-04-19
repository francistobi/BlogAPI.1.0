const passport = require("passport")
const { createCustomError } = require("../error/custom-error");


const isLoggedIn = (req, res, next) => {
  passport.authenticate("jwt", { session: false })(req, res, (err) => {
    if (err) {
      const error = new Error();
      error.status = 401;
      return next(createCustomError(`error: "Unauthorized"`, 404));
    }
    return next();
  });
};

module.exports = { isLoggedIn };