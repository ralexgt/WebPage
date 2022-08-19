import express from "express";
import routes from "./routes/routes";


const PORT = 5000;
const app = express();
app.use(routes);


function main (){
  
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );
}

main();

//homePage register logIn  userPanel