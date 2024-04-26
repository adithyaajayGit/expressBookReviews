const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Write code to check if the username is valid
    // For example, you might check the length and allowed characters
    return /^[a-zA-Z0-9]+$/.test(username) && username.length >= 6 && username.length <= 20;
}

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the one we have in records
    const user = users.find(user => user.username === username && user.password === password);
    return !!user; // Return true if a matching user is found, otherwise return false
}

// Route to authenticate users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username is valid
    if (!isValid(username)) {
        return res.status(400).json({ message: 'Invalid username' });
    }

    // Check if username and password match the records
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });

        // Return token as response
        res.json({ token });
    } else {
        // Return error message for invalid credentials
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Route to add a book review
regd_users.post("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const review = req.query.review; // Get the review from the request query parameters
  const username = req.session.username; // Get the username from the session

  // Check if username is available in session
  if (!username) {
      return res.status(401).json({ message: 'User not logged in' });
  }

  // Check if review is provided
  if (!review) {
      return res.status(400).json({ message: 'Review content is required' });
  }

  // Check if the book exists
  if (books[isbn]) {
      // Check if the user already has a review for the book
      if (books[isbn].reviews[username]) {
          // Modify the existing review
          books[isbn].reviews[username] = review;
          res.status(200).json({ message: 'Review modified successfully' });
      } else {
          // Add a new review
          books[isbn].reviews[username] = review;
          res.status(200).json({ message: 'Review added successfully' });
      }
  } else {
      // If the book with the specified ISBN is not found, send a 404 Not Found response
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
