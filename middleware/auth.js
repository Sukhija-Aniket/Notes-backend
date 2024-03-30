module.exports = {
    userCheck: function (req, res, next) {
        console.log("Request sent to Usercheck");
        if (!req.user) {
            console.log("User not Authenticated");
            return res.status(401).json({ authenticated: false, message: "User not authenticated" });
        }
        return next();
    },
    userLoggedIn: (req, res, next) => {
        console.log("Request sent to UserLoggedIn");
        if (req.user) {
            console.log("User Already Logged In");
            return res.status(200).json({ authenticated: true, message: "User already logged in" });
        }
        return next();
    },
};