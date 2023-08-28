const express = require("express");
const cors =require('cors')
const app = express();
require('./../db/mongo')

const PORT = process.env.PORT || 4000;

app.listen(PORT, function (){
    console.log(`Running on: ${PORT}`);
  });

app.use(cors());
app.use(express.json());
app.use("/"+process.env.IMG,express.static("uploads"));

module.exports= { app };