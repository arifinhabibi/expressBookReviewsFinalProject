const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bcrypt = require("bcrypt");
const jwtsecret = require("./jwt_secret.js").jwtsecret;

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const findUser = users.find((user) => user.username === username);
  if (findUser) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const findUser = users.find((user) => user.username === username);
  if (bcrypt.compareSync(password, findUser.password)) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const payload = req.body;
  if (!isValid(payload.username)) {
    return res.status(401).json({
      message: "unauthorized user",
    });
  }

  if (authenticatedUser(payload.username, payload.password)) {
    users.map((user, index) => {
      if (user.username === payload.username) {
        user.token = jwt.sign(
          {
            userId: index,
            username: user.username,
          },
          jwtsecret,
          { expiresIn: "1h" }
        );
        req.session.authorization = {
          accessToken: user.token,
          username: user.username,
        };
      }
    });
    return res.status(200).json({ message: "Customer Successfully log in" });
  } else {
    console.log(users);
    return res.status(401).json({ message: "Your password is wrong!" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;

  return res.status(200).json({
    message: user,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Write your code here
  const user = req.user;
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
