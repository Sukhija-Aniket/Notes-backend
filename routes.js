const router = require("express").Router();
const { userCheck, userLoggedIn } = require("./middleware/auth");
const { localUserLogin, userRegister, getIndexPageData } = require("./utils")
const NoteTable = require("./models/note");

// <---- Registration and authentication for Users ----->
router.get("/register", userLoggedIn, (req, res) => {
    console.log("Get request sent to register");
    res.render("register", { message: "" });
});

router.post("/register", userLoggedIn, async (req, res) => {
    console.log("Post request sent to register");
    const message = await userRegister(req);
    if (
        message == "Password is too Short" ||
        message == "user already Exists"
    ) {
        res.status(401).json({ success: false, message: message });
    } else {
        res.json({ success: true, message: message });
    }
});

router.get("/login", userLoggedIn, (req, res) => {
    console.log("Get Request sent to login");
    res.render("login", { message: "" });
});

router.post("/login", userLoggedIn, localUserLogin);

router.post('/logout', (req, res) => {
    console.log("Post Request sent to logout");
    req.logOut(req.user, function(err) {
        if (err) { return next(err); }
        req.session.destroy(function (err) {
            if (err) {
                console.error("Error: Failed to destroy the session during logout.", err);
            }
            res.clearCookie('connect.sid', { path: '/'});

            res.json({ message: 'Logged out successfully' });
        });
    }); 
});


// ----------- APP ROUTES ---------------


router.get("/isAuthenticated", (req, res) => {
    console.log("Get Request sent to Authenticate");
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

router.get("/", async (req, res) => {
    console.log("Get Request sent to Index");
    if (req.isAuthenticated()) {
        const context = await getIndexPageData(req);
        res.render("index", {
            authenticated: req.isAuthenticated(),
            user: req.user,
            ...context,
        });
    } else {
        res.render("login-register", {
            authenticated: false
        });
    }
});

router.get('/notes', userCheck, async (req, res) => {
    console.log("Get Request sent to notes");
    try {
        const notes = await NoteTable.find({ user_id: req.user._id });
        res.json(notes);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/createNote', userCheck, async (req, res) => {
    console.log("Post request sent to createNote");
    try {
        const note = await NoteTable.create({
            user_id: req.user._id,
            title: req.body.title,
            content: req.body.content
        });
        res.json(note)
    } catch (error) {
        res.status(401).json({ message: error });
    }
});

router.post('/viewNote', userCheck, async (req, res) => {
    console.log("Post request sent to viewNote");
    try {
        const note = await NoteTable.findOne({ _id: req.body._id });
        res.json(note);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/updateNote', userCheck, async (req, res) => {
    console.log("Post request sent to updateNote");
    try {
        const updateStatus = await NoteTable.updateOne(
            { _id: req.body._id },
            { $set: { title: req.body.title, content: req.body.content } }
        );
        if (updateStatus.modifiedCount === 1) {
            const updatedNote = {
                _id: req.body._id,
                title: req.body.title,
                content: req.body.content,
                user_id: req.user._id,
            }
            res.json({ success: true, message: "Note updated successfully.", note: updatedNote });
        } else {
            res.status(401).json({ success: false, message: "Note update failed." });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: error });
    }
});

router.post('/deleteNote', userCheck, async (req, res) => {
    console.log("Post request sent to delete Note");
    try {
        const removedNote = await NoteTable.deleteOne({ _id: req.body._id });
        if (removedNote.deletedCount > 0) {
            res.json({success: true, message: "Note Deleted Successfully"});
        } else {
            res.status(401).json({success: false, message: "Note Could not be deleted!"});
        }
    } catch (error) {
        res.status(401).json({ message: error });
    }
});

module.exports = router;