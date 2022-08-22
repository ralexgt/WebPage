import express from "express";
import { engine } from "express-handlebars";
import Accounts from "../account";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";

const app = express();

export default app;

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

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


  app.get("/homePage", async (req, res) => {
      if(!req.cookies.loggedIn)
        res.render("loggedOut");
        else res.render("loggedIn");
  });

  app.get("/register", async (req, res) => {
    if(!req.cookies.loggedIn) 
      res.render("register");
      else res.redirect("./homePage");


  });
  app.post("/register", async (req, res) => {
      const account = new Accounts({
        username: req.body.username,
        password: req.body.password,
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
    if(!req.cookies.loggedIn) 
      res.render("logIn");
      else res.redirect(`./homePage`)

  });
  app.post("/logIn", async (req, res) => {
    const  connectAccount = new Accounts ({username: req.body.username,
           password: req.body.password
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
    res.cookie("loggedIn", `${connectAccount.username}`, {
      maxAge: 600000
    })
    res.redirect(`./homePage`);
    console.log(`${connectAccount.username} logged in`);
  });

  
  app.post("/logOut", async (req, res) => {
    console.log(`${req.cookies.loggedIn} logged out`);
    res.clearCookie("loggedIn");
    res.redirect("./homePage");
  });
  });
  }

main();