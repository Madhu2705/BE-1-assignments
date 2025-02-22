const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const POSTS_FILE = path.join(__dirname, "posts.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const getPosts = () => {
    try {
        const data = fs.readFileSync(POSTS_FILE, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};
const savePosts = (posts) => {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
};

app.get("/posts", (req, res) => {
    const posts = getPosts();
    res.render("home", { posts });
});

app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (!post) return res.status(404).send("Post not found");
    res.render("post", { post });
});

app.get("/addPost", (req, res) => {
    res.render("addPost");
});

app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    if (!title) {
        return res.status(400).send("Title is required");
    }
    
    const posts = getPosts();
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title,
        content: content || "No content"
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect("/posts");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
