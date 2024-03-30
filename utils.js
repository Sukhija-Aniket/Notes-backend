const passport = require("passport");
const bcrypt = require("bcryptjs")
const UserTable = require("./models/user");
const NoteTable = require("./models/note");

module.exports = {
    localUserLogin: (req, res, next) => {
        console.log("post request sent to login");
        passport.authenticate("user-local", function (err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.status(401).json({ success: false, message: "Incorrect UserName or Password" });
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                // Authentication succeeded
                return res.json({ success: true, message: "Logged in successfully", user: user });
            });
        })(req, res, next)
    },

    getIndexPageData: async function (req) {
        const notes = await NoteTable.find({ user_id: req.user._id });
        const context = {
            notes: notes,
        }
        return context;
    },

    userRegister: async function (req) {
        const { userName, password } = req.body;
        if (userName.length == 0) {
            const message = "User name cannot be empty";
            return message;
        }
        if (password.length < 8) {
            const message = "Password is too Short";
            return message;
        }
        const oldUser = await UserTable.findOne({ userName });

        if (oldUser) {
            const message = "user already Exists";
            return message;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserTable.create({
            userName: userName,
            password: encryptedPassword,
        });

        const message = "user Created Successfully";
        return message;
    }
};