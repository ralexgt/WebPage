import express from "express";
import login from "./routes/login";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";

const PORT = 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(login);

app.engine(
  "handlebars",
  engine({
    defaultLayout: "index",
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

function main() {
  app.get("/", (req, res) => {
    res.redirect("/homePage");
  });

  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );
}

main();
