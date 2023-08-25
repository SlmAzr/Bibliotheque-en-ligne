const express = require("express");
const cors =require('cors')
const app = express();

const PORT = process.env.PORT || 4000;
app.listen(PORT, function (){
    console.log(`Running on: ${PORT}`);
  });

app.use(cors());
app.use(express.json());
app.use("/images",express.static("uploads"));

module.exports= { app };