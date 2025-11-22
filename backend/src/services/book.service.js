//this module is for all database interactions for books
const db=require('../config/db');
async function getAllBooks()
{
  const [rows]=await db.query('select*from books order by id asc');
  return rows;
}
async function getBookById(id) 
{
  const [rows]=await db.query('select*from books where id=?',[id]);
  return rows[0];
}
async function addBook({title,author,genre,price,coverImage}) 
{
  const sql=`insert into books(title,author,genre,price,availability,coverImage)values(?, ?, ?, ?, 'IN_STOCK', ?)`;
  const [result]=await db.query(sql,[title,author,genre,price,coverImage]);
  //return the new record id for confirmation
  return {insertId: result.insertId};
}
async function purchaseBook(id) 
{
  //1) fetch book to verify it exists and check availability
  const book = await getBookById(id);
  if(!book) 
    {
        const err=new Error('Book not found');
        err.code='NOT_FOUND';
        throw err;
    }
  if(book.availability==='OUT_OF_STOCK') 
    {
        const err=new Error('Book is already out of stock');
        err.code='OUT_OF_STOCK';
        throw err;
    }
  //2) mark as OUT_OF_STOCK
  await db.query("update books set availability='OUT_OF_STOCK' where id = ?",[id]);

  //3) return the original book row  for confirmation
  return book;
}
async function updateBook(id,{title,author,genre,price,availability,coverImage }) 
{
  //to build a simple update that accepts partial updates
  const updates=[];
  const params=[];
  if(title!==undefined) 
    {
        updates.push('title=?');
        params.push(title);
    }
  if(author!==undefined) 
    {
        updates.push('author=?');
        params.push(author);
    }
  if(genre !== undefined) 
    {
        updates.push('genre=?');
        params.push(genre);
    }
  if(price!==undefined) 
    {
        updates.push('price=?');
        params.push(price);
    }
  if(availability!==undefined) 
    {
        //expect 'IN_STOCK' or 'OUT_OF_STOCK'
        updates.push('availability=?');
        params.push(availability);
    }
  if(coverImage!==undefined) 
    {
        updates.push('coverImage=?');
        params.push(coverImage);
    }

  if(updates.length===0) 
    {
        //nothing to update
        return {changed:false};
    }
  const sql=`update books set ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  const [result]=await db.query(sql, params);
  return {changed:result.affectedRows>0};
}
module.exports={
  getAllBooks,
  getBookById,
  addBook,
  purchaseBook,
  updateBook,
};
