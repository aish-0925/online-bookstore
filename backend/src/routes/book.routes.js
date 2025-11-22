const express = require('express');
const router = express.Router();
const controller = require('../controllers/book.controller');
//public:list books
router.get('/books',controller.listBooks);
//customer:purchase a book
//body:{id:number}
router.post('/purchase',controller.purchaseBook);
//admin:add a book
//body:{title,author,genre,price,coverImage}
router.post('/add-book',controller.createBook);
//admin:update book partially
router.put('/update-book/:id',controller.editBook);
module.exports = router;
