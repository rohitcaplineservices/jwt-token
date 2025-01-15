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
  res.json(posts.filter((post) => post.username === req.username));
});

app.post("/login", (req, res) => {
  const username = req.body.username;

  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authheader = req.headers["Unauthorized"];

  const token = authheader && authheader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(8008);
