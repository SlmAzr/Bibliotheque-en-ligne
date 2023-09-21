const { Book } = require("../model/Book");
const { upload } = require("../middlewares/multer");
const express = require("express");
const jwt = require("jsonwebtoken");
const { sharpMiddleware } = require("../middlewares/sharp");

const booksRouter = express.Router();
booksRouter.get("/bestrating", getBestRating);
booksRouter.get("/", getBooks);
booksRouter.post(
  "/",
  checkToken,
  upload.single("image"),
  sharpMiddleware,
  postBooks
);
booksRouter.get("/:id", getBooksId);
booksRouter.delete("/:id", checkToken, deleteBook);
booksRouter.put(
  "/:id",
  checkToken,
  upload.single("image"),
  sharpMiddleware,
  putBooks
);
booksRouter.post("/:id/rating", checkToken, postRating);

function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;

  if (authorization == null) {
    res.status(401).send("Unauthorized1");
    return;
  }
  const token = authorization.split(" ")[1];
  try {
    const verificator = jwt.verify(token, process.env.JWT_KEY);
    req.userId = verificator.userId;
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

async function deleteBook(req, res) {
  const id = req.params.id;
  try {
    const dbsBook = await Book.findById(id);
    if (dbsBook == null) {
      res.status("404").send("Book not found");
      return;
    }
    const dbUserId = dbsBook.userId;
    const tokenUserId = req.userId;
    if (dbUserId != tokenUserId) {
      res.status(403).send("Forbidden");
      return;
    }
    await Book.findByIdAndDelete(id);
    res.send("livre suprimé");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error: " + e.message);
  }
}

async function putBooks(req, res) {
  const id = req.params.id;
  const book = JSON.parse(req.body.book);
  try {
    const dbsBook = await Book.findById(id);
    if (dbsBook == null) {
      res.status("404").send("Book not found");
      return;
    }
    const dbUserId = dbsBook.userId;
    const tokenUserId = req.userId;
    if (dbUserId != tokenUserId) {
      res.status(403).send("Forbidden");
      return;
    }

    const newBook = {};
    if (book.title) newBook.title = book.title;
    if (book.author) newBook.author = book.author;
    if (book.year) newBook.year = book.year;
    if (book.genre) newBook.genre = book.genre;
    if (req.file != null) {
      newBook.imageUrl = req.file.filename;
    }

    await Book.findByIdAndUpdate(id, newBook);
    res.send("live modifié");
  } catch (error) {
    console.error(e);
    res.status(500).send("Error: " + e.message);
  }
}

async function getBestRating(req, res) {
  try {
    const highestRatingBooks = await Book.find().sort({ rating: -1 }).limit(3);
    highestRatingBooks.forEach((book) => {
      book.imageUrl = imagePath(book.imageUrl);
    });
    res.send(highestRatingBooks);
  } catch (error) {
    res.status(500).send("Error: " + e.message);
  }
}

async function postRating(req, res) {
  try {
    const id = req.params.id;
    if (id == null || id == "undefined") {
      res.status(400).send("missing book");
      return;
    }
    const rating = req.body.rating;
    const userId = req.userId;
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Error");
      return;
    }
    const dbRatings = book.ratings;
    const verifRatingFromUser = dbRatings.find(
      (rating) => rating.userId == userId
    );
    if (verifRatingFromUser != null) {
      res.status(400).send("This user already rated");
      return;
    }
    const newRating = { userId: userId, grade: rating };
    dbRatings.push(newRating);

    book.averageRating = calculateAverageRating(dbRatings);
    await book.save();
    res.send("Your rating has been posted");
  } catch (error) {
    res.status(500).send("Error" + e.message);
  }
}

function calculateAverageRating(ratings) {
  const length = ratings.length;
  const somme = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  const moyenne = somme / length;
  const moyenneArrondie = moyenne.toFixed(2);

  return parseFloat(moyenneArrondie);
}

module.exports = { booksRouter };
