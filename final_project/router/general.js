const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bcrypt = require("bcrypt");

public_users.post("/register", (req, res) => {
  //Write your code here
  const payload = req.body;
  if (isValid(payload.username)) {
    return res.status(404).json({ message: "User already exists!" });
  }
  payload.password = bcrypt.hashSync(payload.password, 16);
  payload.token = null;
  users.push(payload);
  return res
    .status(200)
    .json({ message: "Customer successfully registred. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const promise = new Promise((resolve, reject) => {
    if (!books[parseInt(isbn)]) {
      reject({
        message: "Data not found",
      });
    }
    resolve(books[parseInt(isbn)]);
  });

  promise
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((err) => {
      return res.status(200).json(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  const mappingData = Object.keys(books).map((key) => books[key]);

  const findDataBook = mappingData.filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (!findDataBook) {
    return res.status(404).json({ bookbyauthor: "Data not found" });
  }

  return res.status(200).json({ bookbyauthor: findDataBook });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const mappingData = Object.keys(books).map((key) => books[key]);

  const findDataBook = mappingData.filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  return res.status(200).json({ bookbytitle: findDataBook });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
