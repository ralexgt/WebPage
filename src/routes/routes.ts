import express from "express";
import { engine } from "express-handlebars";
import Accounts from "../account";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

export default app;

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", engine({
  defaultLayout: "index",
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

function main(){
  const dbUrl = 'mongodb://127.0.0.1:27017';

  MongoClient.connect(dbUrl, {}, (err, client) => {
   if (err) {
        return console.log(err);
   }
   if(!client)
      return;  
    const db = client.db("webpage");
    console.log(`MongoDB Connected: ${dbUrl}`);


  let currentAccount = new Accounts;
  app.get("/homePage", async (req, res) => {
    if(!currentAccount.logged_in)
      res.render("loggedOut");
      else res.redirect(`./userPanel/${currentAccount.username}`);
  });


  app.get("/register", async (req, res) => {
    if(!currentAccount.logged_in) 
      res.render("register");
      else res.redirect(`./userPanel/${currentAccount.username}`)

  });
  app.post("/register", async (req, res) => {
        const account = new Accounts({
          username: req.body.username,
          password: req.body.password,
          logged_in: 0
        });

        if(await db.collection("accounts").findOne({username: account.username}))
          {res.render("userExists");
          console.log("tried to register an existing user");
          return;
        }
        db.collection("accounts").insertOne(account);
        res.redirect("./logIn");
        console.log("new account added to db");
  });


  app.get("/logIn", async (req, res) => {
    if(!currentAccount.logged_in) 
      res.render("logIn");
      else res.redirect(`./userPanel/${currentAccount.username}`)

  });
  app.post("/logIn", async (req, res) => {
    const  connectAccount = new Accounts ({username: req.body.username,
           password: req.body.password, logged_in: true
          })
    if(!(await db.collection("accounts").findOne({username: connectAccount.username}))){
      res.render("wrongUsername");
      console.log("wrong username");
      return;
    }
    if(!(await db.collection("accounts").findOne({password: connectAccount.password}))){
      res.render("wrongPassword");
      console.log("wrong password");
      return;
    }
    await db.collection("accounts").findOneAndReplace({username: connectAccount.username}, {username: connectAccount.username, password: connectAccount.password, logged_in: true});
    currentAccount = connectAccount;
    res.redirect(`./userPanel/${connectAccount.username}`);
    console.log(`${connectAccount.username} logged in`);
  });

  
  app.get("/userPanel/:user", async (req, res) => {
    const account = await db.collection("accounts").findOne({username: req.params.user});
    if(!account) return;
    if(account.logged_in) {
      res.render("userPanelLoggedIn");
    }
      else {
        res.status(400); 
        res.render("forcedUserPanel");
      }
  });
  app.post("/logOut", async (req, res) => {
    db.collection("accounts").findOneAndReplace({username: currentAccount.username}, {username: currentAccount.username, password: currentAccount.password, usernamelogged_in: false});
    currentAccount = new Accounts;
    res.redirect("./homePage");
  });
  });
  }

main();