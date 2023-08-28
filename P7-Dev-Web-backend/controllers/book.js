const { Book } = require("../model/Book");
const { upload } = require("../middlewares/multer");
const express = require("express");
const jwt = require("jsonwebtoken");

const booksRouter = express.Router();
booksRouter.get("/", getBooks);
booksRouter.post("/", checkToken, upload.single("image"), postBooks);
booksRouter.get("/:id", getBooksId);

function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;

  if (authorization == null) {
    res.status(401).send("Unauthorized1");
    return;
  }
  try {
    const token = authorization.split(" ")[1];
    const verificator = jwt.verify(token, process.env.JWT_KEY);
    console.log("verif : ", verificator);
    next();
  } catch (e) {
    res.status(401).send("ERRor: " + e.message);
  }
}

async function getBooks(req, res) {
  const dbBooks = await Book.find();
  dbBooks.forEach((book) => {
    book.imageUrl = imagePath(book.imageUrl);
  });
  res.send(dbBooks);
}

function imagePath(imageUrl) {
  return process.env.PUBLIC_HOST + "/" + process.env.IMG + "/" + imageUrl;
}
async function postBooks(req, res) {
  const file = req.file;
  const stringBooks = req.body.book;
  const books = JSON.parse(stringBooks);
  const filename = req.file.filename;
  books.imageUrl = filename;
  try {
    const result = await Book.create(books);
    res.send({ message: "Book posted" });
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur: " + e.message);
  }
}

async function getBooksId(req, res) {
  const id = req.params.id;
  try {
    const books = await Book.findById(id);
    if (books == null) {
      res.status(404).send("Error");
      return;
    }
    books.imageUrl = imagePath(books.imageUrl);
    res.send(books);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
}

module.exports = { booksRouter };
