import express from "express";
import { MongoClient } from "mongodb";
import { PORT } from "../index";

const app = express.Router();
export default app;

function main() {
  const dbUrl = "mongodb://mongo:27017/page";
  MongoClient.connect(dbUrl, {}, (err, client) => {
    if (err) {
      return console.log(err);
    }
    if (!client) return;
    const db = client.db("webpage");

    app.get("/posts", async (req, res) => {
      let urls: Array<string> = [];
      await db
        .collection("posts")
        .find()
        .forEach((item) => {
          urls.unshift(`${item.url}`);
        });
      res.render("posts", {
        posts: urls,
        port: PORT,
      });
    });
    app.get("/newPost", (req, res) => {
      if (!req.cookies.loggedIn) {
        res.redirect("homePage");
      } else {
        res.render("newPost", { author: req.cookies.loggedIn, port: PORT });
      }
    });
    app.post("/newPost", async (req, res) => {
      const title: String = req.body.title;
      const link = title.split(" ").join("_");
      db.collection("posts").insertOne({
        author: req.cookies.loggedIn,
        title: title,
        content: req.body.content,
        url: `${link}`,
      });
      res.redirect("posts");
    });
    app.get("/blogs/:url", async (req, res) => {
      const blog = await db
        .collection("posts")
        .findOne({ url: `${req.params.url}` });
      if (!blog) {
        res.status(404).send("Blog not found!");
        return;
      }
      let isAuthor = false;
      if (req.cookies.loggedIn == blog!.author) {
        isAuthor = true;
      }
      res.render("post", {
        author: blog!.author,
        content: blog!.content,
        title: blog!.title,
        blogUrl: req.params.url,
        isAuthor: isAuthor,
        port: PORT,
      });
    });
    app.post("/blogs/:url", async (req, res) => {
      db.collection("posts").deleteOne({
        url: `localhost:${PORT}/blogs/${req.params.url}`,
      });
      res.redirect("/posts");
    });
  });
}

main();
