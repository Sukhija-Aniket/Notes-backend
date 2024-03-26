const passport = require("passport");
const UserTable = require("./models/user");
const NoteTable = require("./models/note");

module.exports = {
    localUserLogin: passport.authenticate("user-local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),

    getIndexPageData: async function (req) {
        const notes = NoteTable.find({user_id: req.user._id});
        const context = {
            notes: notes,
        }
        return context;
    },

    userRegister: async function (req) {
        const {userName, password } = req.body;
        if (name.length == 0) {
            const message = "User name cannot be empty";
            return message;
        }
        if (password.length < 8) {
            const message = "Password is too Short";
            return message;
        }
        const oldUser = await UserTable.findOne( {userName });

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