import express from "express";
import { MongoClient } from "mongodb";

const app = express.Router();
export default app;

function main() {
  const dbUrl = "mongodb://127.0.0.1:27017";
  MongoClient.connect(dbUrl, {}, async (err, client) => {
    if (err) {
      return console.log(err);
    }
    if (!client) return;
    const db = client.db("webpage");

    app.get("/shortUrls", async (req, res) => {
      let urls: Array<string> = [];
      await db
        .collection("urls")
        .find()
        .forEach((item) => {
          urls.push(`${item.longUrl} --> ${item.shortUrl}`);
        });
      res.render("urlshortener", {
        currentUrls: urls,
      });
    });
    app.post("/shortUrls", async (req, res) => {
      const newUrl: string = req.body.newUrl;
      let shortenedUrl = `localhost:5000/${randomUrl(4)}`;
      if (await db.collection("urls").findOne({ longUrl: newUrl })) {
        res.render("urlshortener", { problem: "Url is already on the list" });
        return;
      }
      while (await db.collection("urls").findOne({ shortUrl: shortenedUrl })) {
        shortenedUrl = randomUrl(4);
      }
      db.collection("urls").insertOne({
        longUrl: newUrl,
        shortUrl: shortenedUrl,
      });
      res.redirect("/shortUrls");
    });

    app.get("/:url", async (req, res) => {
      const url = `localhost:5000/${req.params.url}`;
      if (!(await db.collection("urls").findOne({ shortUrl: url }))) {
        res.status(404).send("Wrong URL");
        return;
      }
      const redirectUrl = await db
        .collection("urls")
        .findOne({ shortUrl: url });
      res.redirect(`http://${redirectUrl!.longUrl}`);
    });
  });
}

function randomUrl(length: number) {
  let randomUrl = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < length; i++) {
    randomUrl += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomUrl;
}

main();
