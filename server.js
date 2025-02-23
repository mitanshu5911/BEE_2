const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const postsFilePath = path.join(__dirname, "posts.json");

// Function to read posts
const readPosts = () => {
    try {
        return JSON.parse(fs.readFileSync(postsFilePath, "utf8"));
    } catch (err) {
        return [];
    }
};

// Function to write posts
const writePosts = (posts) => {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
};

// Route to show all posts
app.get("/posts", (req, res) => {
    const posts = readPosts();
    res.render("posts", { posts });
});

// Route to show a single post
app.get("/post", (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id == req.query.id);
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to add a new post
app.get("/add-post", (req, res) => {
    res.render("add-post");
});

app.post("/add-post", (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    writePosts(posts);
    res.redirect("/posts");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
