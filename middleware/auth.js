module.exports = {
    userCheck: function (req, res, next) {
        if (req.user) return next();
        return res.redirect("/login");
    },
    userLoggedIn: (req, res, next) => {
        if (req.user) return res.redirect("/");
        return next();
    },
};