import React from 'react';
export default function InventoryTable({books=[]}) 
{
  return(
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Cover</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Author</th>
            <th className="p-3 text-left">Genre</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Availability</th>
          </tr>
        </thead>
        <tbody>
          {books.length===0?(
            <tr><td colSpan="6" className="p-4 text-center">No books</td></tr>
          ):(
            books.map((b)=>(
              <tr key={b.id} className="border-t">
                <td className="p-3">
                  {b.coverImage ? <img src={`/book-covers/${b.coverImage}`} alt={b.title} className="h-12 object-contain" /> : '-'}
                </td>
                <td className="p-3">{b.title}</td>
                <td className="p-3">{b.author}</td>
                <td className="p-3">{b.genre}</td>
                <td className="p-3">₹{Number(b.price).toFixed(2)}</td>
                <td className="p-3">{b.availability==='IN_STOCK'?'In Stock':'Out of Stock'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
