import express from "express";
import login from "./routes/login";


const PORT = 5000;
const app = express();
app.use(login);


function main (){
  
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );
}

main();