//translate HTTP requests into service calls and return HTTP responses
const bookService=require('../services/book.service');
async function listBooks(req,res,next) 
{
  try 
  {
    const books=await bookService.getAllBooks();
    res.json(books);
  } 
  catch(err) 
  {
    next(err);
  }
}

async function createBook(req,res,next) {
  try 
  {
    const {title,author,genre,price,coverImage}=req.body;
    if (!title||!author||!genre||price===undefined) {
      return res.status(400).json({
        error: 'Please provide title, author, genre and price',
      });
    }
    const result=await bookService.addBook({title,author,genre,price,coverImage});
    res.status(201).json({message:'Book created',id: result.insertId});
  } 
  catch(err) 
  {
    next(err);
  }
}

async function purchaseBook(req,res,next) {
  try 
  {
    const {id}=req.body;
    if(!id) 
    {
      return res.status(400).json({error:'Book id is required to purchase'});
    }
    const purchasedBook=await bookService.purchaseBook(id);
    res.json({message:'Purchase successful',book: purchasedBook});
  } 
  catch(err) {
    //map known errors to HTTP statuses
    if(err.code==='NOT_FOUND') 
        return res.status(404).json({error:err.message});
    if(err.code==='OUT_OF_STOCK') 
        return res.status(400).json({error:err.message});
    next(err);
  }
}
async function editBook(req,res,next) {
  try 
  {
    const id=req.params.id;
    const result=await bookService.updateBook(id,req.body);
    if(!result.changed) 
    {
      return res.status(400).json({message:'No fields provided for update'});
    }
    res.json({message:'Book updated'});
  } 
  catch(err) 
  {
    next(err);
  }
}
module.exports={
  listBooks,
  createBook,
  purchaseBook,
  editBook,
};
