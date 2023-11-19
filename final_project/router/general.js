const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
 public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
  
});


// Get book details based on ISBN using synchronous callback
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  

 
// TASK 10- 
public_users.get('/async-get-books', async function (req, res) {
  try {
    const bookList = JSON.stringify({ books }, null, 4);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(404).json({ message: `Book list not found` });
  }
});




// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
  const get_books_isbn = new Promise((resolve, reject) => {
  const isbn = req.params.isbn;
  // console.log(isbn);
      if (req.params.isbn <= 10) {
      resolve(res.send(books[isbn]));
  }
      else {
          reject(res.send('ISBN not found'));
      }
  });
  get_books_isbn.
      then(function(){
          console.log("Promise for Task 11 is resolved");
 }).
      catch(function () { 
              console.log('ISBN not found');
});

});

  
// Get book details based on author
public_users.get('/author/:author?', function (req, res) {
  const requestedAuthor = req.params.author;

  if (requestedAuthor) {
    // If author is specified in the URL, return books by that author
    const based_author = requestedAuthor.toLowerCase();
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === based_author);

    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: `Books by ${requestedAuthor} not found` });
    }
  } else {
    // If no author is specified, return all books
    res.status(200).json(books);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const requestedTitle = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive comparison

  // Find books by the given title
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === requestedTitle);

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: `Books with title '${req.params.title}' not found` });
  }
});

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
  const get_books_isbn = new Promise((resolve, reject) => {
  const isbn = req.params.isbn;
      if (req.params.isbn <= 10) {
      resolve(res.send(books[isbn]));
  }
      else {
          reject(res.send('ISBN not found'));
      }
  });
  get_books_isbn.then(function(){
          console.log("Promise for Task 11 is resolved");
 }).catch(function () { 
              console.log('ISBN not found');
});
});


//  Get book review

public_users.get('/review/:isbn',function (req, res) {

  const isbnParam = req.params.isbn;

  // Get the book reviews based on ISBN provided in the request parameters

  const reviews = books[isbnParam]["reviews"];

  if (!reviews) {

    res.status(404).json({ message: 'No reviews found for the ISBN provided' });

  } else {

    res.status(200).json(reviews);

  }

});

module.exports.general = public_users;