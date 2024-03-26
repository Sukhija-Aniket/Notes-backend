const router = require("express").Router();
const { userCheck, userLoggedIn } = require("./middleware/auth");
const { localUserLogin, userRegister, getIndexPageData } = require("./utils")
const NoteTable = require("./models/note");

// <---- Registration and authentication for Users ----->
router.get("/register", userLoggedIn, (req, res) => {
    res.render("register", { message: "" });
});

router.post("/register", async (req, res) => {
    const message = await userRegister(req);
    if (
        message == "Password is too Short" ||
        message == "user already Exists"
    ) {
        res.render("register", { message: message });
    } else {
        res.redirect("/login");
    }
});

router.get("/login", userLoggedIn, (req, res) => {
    res.render("login");
});

router.post("/login", localUserLogin);


// ----------- APP ROUTES ---------------

router.get("/", async(req, res) => {
    if (req.isAuthenticated()) {
        const context = await getIndexPageData();
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
    try {
        const notes = await NoteTable.find({user_id: req.user._id });
        res.json(notes);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/createNote', userCheck, async (req, res) => {
    try {
        const note = await NoteTable.create({
            user_id: req.user._id,
            title: req.body.title,
            content: req.body.content
        });
        console.log("note created: ", note._id)
    } catch (error) {
        res.json( {message: error });
    }
});

router.post('/viewNote', userCheck, async (req, res) => {
    try {
        const note = await NoteTable.findOne({_id: req.body.noteId});
        res.json(note);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/updateNote', userCheck, async (req, res) => {
    try {
        const updatedNote = await NoteTable.updateOne(
            { _id: req.params.noteId },
            { $set: { title: req.body.title, content: req.body.content } }
        );
        res.json(updatedNote);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/deleteNote', userCheck, async (req, res) => {
    try {
        const removedNote = await NoteTable.deleteOne({ _id: req.params.noteId });
        res.json(removedNote);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;