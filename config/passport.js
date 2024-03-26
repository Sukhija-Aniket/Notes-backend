const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
    passport.use(
        "user-local",
        new localStrategy(
            { usernameField: "userName", passwordField: "password" },
            async function (userName, password, done) {
                const userTable = require("../models/user");
                const user = await userTable.findOne({ userName: userName });
                if (user && (await bcrypt.compare(password, user.password))) {
                    return done(null, user);
                }
                return done(null, false);
            }
        )
    )
    passport.serializeUser((userObj, done) => {
        done(null, userObj);
      });
    passport.deserializeUser((userObj, done) => {
        done(null, userObj);
    });
}