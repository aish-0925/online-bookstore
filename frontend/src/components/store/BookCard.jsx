import React,{useState} from 'react';
export default function BookCard({book,onPurchase}) 
{
  const [loading,setLoading]=useState(false);
  const handleBuy=async()=>{
    if(!book||book.availability!=='IN_STOCK') 
        return;
    setLoading(true);
    try 
    {
      await onPurchase(book.id);
    } 
    catch(err) 
    {
      alert(err.message||'Purchase failed');
    } 
    finally{
      setLoading(false);
    }
  };
  return(
    <div className="bg-white shadow-sm rounded-lg overflow-hidden flex flex-col">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {book.coverImage?(
          <img
            src={`/book-covers/${book.coverImage}`}
            alt={book.title}
            className="h-full object-contain"
          />
        ):(
          <div className="text-sm text-gray-500">No cover</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-600">{book.author}</p>
        <div className="mt-2 text-sm text-gray-700">{book.genre}</div>
        <div className="mt-auto flex items-center justify-between">
          <div className="font-medium">₹{Number(book.price).toFixed(2)}</div>
          <button
            onClick={handleBuy}
            disabled={loading||book.availability!=='IN_STOCK'}
            className={`px-3 py-1 rounded text-white text-sm ${
              book.availability==='IN_STOCK'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading?'Buying...':book.availability==='IN_STOCK'?'Buy':'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
