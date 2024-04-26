const express = require('express');
const axios = require('axios');
const public_users = express.Router();
const { isValid, users } = require('./auth_users.js');

// Function to fetch the list of books available in the shop
async function getBookList() {
    try {
        const response = await axios.get('http://api.example.com/books');
        return response.data;
    } catch (error) {
        console.error('Error fetching book list:', error);
        throw error;
    }
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBookList();
        res.json(bookList);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookList = await getBookList();
        const book = bookList.find(book => book.isbn === isbn);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const bookList = await getBookList();
        const authorBooks = bookList.filter(book => book.author === author);
        if (authorBooks.length > 0) {
            res.json(authorBooks);
        } else {
            res.status(404).json({ message: `No books found for author: ${author}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const bookList = await getBookList();
        const titleBooks = bookList.filter(book => book.title === title);
        if (titleBooks.length > 0) {
            res.json(titleBooks);
        } else {
            res.status(404).json({ message: `No books found with title: ${title}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookList = await getBookList();
        const book = bookList.find(book => book.isbn === isbn);
        if (book) {
            res.json(book.reviews);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
