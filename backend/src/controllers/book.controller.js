import Book from "../models/Book.js";

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
