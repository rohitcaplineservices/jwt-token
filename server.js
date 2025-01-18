require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "Ashutosh@",
    title: "capline",
  },
  {
    username: "Rishav$",
    title: "capline",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  try {
    const userPosts = posts.filter((post) => post.username === req.user.name);
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

app.post("/login", (req, res) => {
  try {
    const username = req.body.username;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken: accessToken });
  } catch {
    res.status(500).json({ error: "Error during login" });
  }
});

function authenticateToken(req, res, next) {
  try {
    const authheader = req.headers["Unauthorized"];

    const token = authheader && authheader.split(" ")[1];

    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch {
    res.status(500).json({ error: "Authentication error" });
  }
}

app.listen(8008);
