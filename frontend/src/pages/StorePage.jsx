// src/pages/StorePage.jsx
import React,{useEffect,useState}from 'react';
import {fetchBooks,purchaseBook}from '../api/bookApi';
import BookCard from '../components/store/BookCard';
export default function StorePage() 
{
  const [books,setBooks]=useState([]);
  const [meta,setMeta]=useState({page:1,limit:12,total:0});
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState('');
  const [availabilityFilter,setAvailabilityFilter]=useState(''); 
  const [error,setError]=useState(null);
  async function loadBooks(page=1) 
  {
    setLoading(true);
    setError(null);
    try 
    {
      const res = await fetchBooks({page,limit:meta.limit,search:search||undefined,availability:availabilityFilter||undefined });
      setBooks(res.data);
      setMeta(prev=>({ ...prev,page:page,total:res.meta?.total||0 }));
    } 
    catch(err) 
    {
      setError(err.message||'Failed to load books');
    } 
    finally 
    {
      setLoading(false);
    }
  }
  useEffect(()=>{
    loadBooks(1);
  },[search,availabilityFilter]);
  async function handlePurchase(id) 
  {
    try 
    {
      await purchaseBook(id);
      //refetch current page to reflect changed availability
      await loadBooks(meta.page);
      alert('Purchase succeeded');
    } 
    catch(err) 
    {
      alert(err.message||'Purchase failed');
    }
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Store</h1>
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author..."
          className="px-3 py-2 border rounded w-full"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading books…</div>
      ):books.length===0?(
        <div>No books found.</div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} onPurchase={handlePurchase} />
          ))}
        </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <div>
          Showing page{meta.page}—total{meta.total}items
        </div>
        <div className="flex gap-2">
          <button
            disabled={meta.page <= 1}
            onClick={() => loadBooks(meta.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={meta.page * meta.limit >= meta.total}
            onClick={() => loadBooks(meta.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
