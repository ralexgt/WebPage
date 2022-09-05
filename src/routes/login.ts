import express from "express";
import { MongoClient } from "mongodb";
import Accounts from "../account";

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
    console.log(`MongoDB Connected: ${dbUrl}`);

    app.get("/", (req, res) => {
      res.redirect("homePage");
    });
    app.get("/homePage", (req, res) => {
      if (!req.cookies.loggedIn) res.render("loggedOut");
      else res.render("loggedIn", { user: `${req.cookies.loggedIn}` });
    });

    app.get("/register", (req, res) => {
      if (!req.cookies.loggedIn) res.render("register");
      else res.redirect("homePage");
    });
    app.post("/register", async (req, res) => {
      const account = new Accounts({
        username: req.body.username,
        password: req.body.password,
      });
      if (
        await db.collection("accounts").findOne({ username: account.username })
      ) {
        res.render("register", { problem: "User already exists!" });
        return;
      }
      db.collection("accounts").insertOne(account);
      res.redirect("logIn");
    });

    app.get("/logIn", (req, res) => {
      if (!req.cookies.loggedIn) res.render("logIn");
      else res.redirect("homePage");
    });
    app.post("/logIn", async (req, res) => {
      const connectAccount = new Accounts({
        username: req.body.username,
        password: req.body.password,
      });
      if (
        !(await db
          .collection("accounts")
          .findOne({ username: connectAccount.username }))
      ) {
        res.render("logIn", { problem: "This user does not exist" });
        return;
      }
      if (
        !(await db
          .collection("accounts")
          .findOne({ password: connectAccount.password }))
      ) {
        res.render("logIn", { problem: "Wrong password" });
        return;
      }
      res.cookie("loggedIn", `${connectAccount.username}`, {
        maxAge: 600000,
      });
      res.redirect("homePage");
    });

    app.get("/logOut", (req, res) => {
      res.clearCookie("loggedIn");
      res.redirect("homePage");
    });
  });
}

main();
