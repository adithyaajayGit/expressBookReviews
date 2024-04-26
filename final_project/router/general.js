const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const book = books[isbn]; // Find the book with the specified ISBN

  // Check if the book exists
  if (book) {
    // Send the book details as a JSON response
    res.json(book);
  } else {
    // If the book with the specified ISBN is not found, send a 404 Not Found response
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Get the author from the request parameters
  const authorBooks = Object.values(books).filter(book => book.author === author);

  // Check if there are books by the specified author
  if (authorBooks.length > 0) {
    res.json(authorBooks); // Send the books as a JSON response
  } else {
    res.status(404).json({ message: "No books found for the specified author" });
  }
});


// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Get the title from the request parameters
  const titleBooks = Object.values(books).filter(book => book.title === title);

  // Check if there are books with the specified title
  if (titleBooks.length > 0) {
    res.json(titleBooks); // Send the books as a JSON response
  } else {
    res.status(404).json({ message: "No books found with the specified title" });
  }
});


//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const book = books[isbn]; // Find the book with the specified ISBN

  // Check if the book exists
  if (book) {
    const reviews = book.reviews; // Get the reviews for the book

    // Send the reviews as a JSON response
    res.json(reviews);
  } else {
    // If the book with the specified ISBN is not found, send a 404 Not Found response
    res.status(404).json({ message: "Book not found" });
  }
});

// Register a new user

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the list of users
  users.push({ username, password });

  // Return success message
  return res.status(200).json({ message: "User registered successfully" });
});





module.exports.general = public_users;
