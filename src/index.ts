import express from "express";
import login from "./routes/login";
import newPost from "./routes/posts";
import shortUrl from "./routes/shortUrl";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";

export { PORT };

const PORT = 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(login);
app.use(newPost);
app.use(shortUrl);

app.engine(
  "handlebars",
  engine({
    defaultLayout: "index",
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

function main() {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:5000`)
  );
}

main();
