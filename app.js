const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear", year: 2018, completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", year: 2008, completed: true, createdAt: new Date().toISOString() }
];

// 1. GET /books → Get all books
app.get('/books', (req, res) => {
  res.json({ success: "this is your collection", data: books });
});

// 1. GET /books/completed → Get only completed books
app.get('/books/completed', (req, res) => {
  const completedBooks = books.filter(book => book.completed);
  res.json({ success: true, data: completedBooks });
});

// 3. GET /books/search?title=... → Search books by title (case-insensitive)
app.get('/books/search', (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ success: false, message: "Query parameter 'title' is required" });
  }
  const matchedBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  res.json({ success: "this is your search resault", data: matchedBooks });
});

// 2 & 4. POST /books → Add a new book with validation and createdAt field
app.post('/books', (req, res) => {
  const { title, author, year, completed } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ success: false, message: "Title, author, and year are required" });
  }
  if (typeof year !== 'number' || year <= 1900) {
    return res.status(400).json({ success: false, message: "Year must be a number greater than 1900" });
  }
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year,
    completed: completed === undefined ? false : completed,
    createdAt: new Date().toISOString()
  };
  books.push(newBook);
  res.status(201).json({ success: "Book added", data: newBook });
});

// 5. PUT /books/:id → Update a book by ID with validation
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year, completed } = req.body;
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  if (year !== undefined && (typeof year !== 'number' || year <= 1900)) {
    return res.status(400).json({ success: false, message: "Year must be a number greater than 1900" });
  }
  // Update fields if provided
  if (title !== undefined) books[bookIndex].title = title;
  if (author !== undefined) books[bookIndex].author = author;
  if (year !== undefined) books[bookIndex].year = year;
  if (completed !== undefined) books[bookIndex].completed = completed;

  res.json({ success: true, data: books[bookIndex], message: "Book updated successfully" });
});

// 6. DELETE /books/:id → Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  books.splice(bookIndex, 1);
  res.json({ success: true, message: "Book deleted successfully" });
});

// Optional: GET /books/:id → Get book by ID (unchanged)
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  res.json({ success: true, data: book });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Book Tracker running on http://localhost:${PORT}`));