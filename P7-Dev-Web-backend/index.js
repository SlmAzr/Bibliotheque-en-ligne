require("dotenv").config();
const { app } = require("./config/common")
const { usersRouter }=require('./controllers/user')
const { booksRouter }= require('./controllers/book')

app.get("/",(req,res)=>res.send("ON"))

app.use("/api/auth",usersRouter);
app.use("/api/books", booksRouter);



