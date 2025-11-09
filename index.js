const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const multer = require('multer');//it is a package for image to upload
const methodOverride = require('method-override');


const upload = multer({ dest: 'uploads/' });
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//template
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//public
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));



let posts = [
    {
        id: uuidv4(),
        username: "meowsterpiece",
        image: "img2.jpeg",
        caption: "Sometimes the smallest things take up the most room in your heart."
    },
    {
        id: uuidv4(),
        username: "goldenjoys",
        image: "img3.jpeg",
        caption: "When you pause to enjoy the little wonders, life becomes extraordinary."
    },
    {
        id: uuidv4(),
        username: "dreamscape_hooves",
        image: "img1.jpeg",
        caption: "Lost in a daydream among wildflowers and magic."
    }
    
];

app.get("/posts", (req, res) => {
    res.render("main.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", upload.single('image'), (req, res) => {
    let { username, caption } = req.body;
    let image = req.file ? req.file.filename : null;
    let id = uuidv4();
    posts.push({ id, username, image, caption });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
});

app.patch("/posts/:id", upload.single('image'), (req, res) => {
    let { id } = req.params;
    let newCaption = req.body.caption;
    let newImage = req.file ? req.file.filename : null;
    let post = posts.find((p) => id === p.id);
    post.caption = newCaption;
    post.image = newImage;
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});