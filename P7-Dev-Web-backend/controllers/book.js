const { book }=require('../db/books');
const { Book }= require('../model/Book');
const { upload }= require("../middlewares/multer");
const express= require('express');

function getBooks(req, res) {
    res.send(books);
  }
  
  async function postBooks(req, res) {
    const file = req.file; 
    const stringBooks = req.body.book;
    const books = JSON.parse(stringBooks);
    books.imageUrl= file.path;
    try {
      const result = await Book.create(books);
      res.send({ message: "Book posted" });
    } catch (e) {
      console.error(e);
      res.status(500).send("Erreur: " + e.message);
    }
  
  
  }
  const booksRouter = express.Router();
  booksRouter.get("/",getBooks)
  booksRouter.post("/",upload.single("image"), postBooks);

  module.exports = { booksRouter}; 