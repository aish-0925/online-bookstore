// src/pages/InventoryPage.jsx
import React,{useEffect,useState} from 'react';
import {fetchBooks} from '../api/bookApi';
import InventoryTable from '../components/inventory/InventoryTable';
import GenreBarChart from '../components/charts/GenreBarChart';
import AvailabilityPieChart from '../components/charts/AvailabilityPieChart';
export default function InventoryPage() 
{
  const [books,setBooks]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  async function loadAll() 
  {
    setLoading(true);
    setError(null);
    try 
    {
      //fetch many items: backend default limit is high; request a large limit to get full set
      const res=await fetchBooks({page:1,limit:1000});
      setBooks(res.data);
    } 
    catch(err) 
    {
      setError(err.message||'Failed to load inventory');
    } 
    finally 
    {
      setLoading(false);
    }
  }
  useEffect(()=>{
    loadAll();
  },[]);

  const inStockCount=books.filter(b=>b.availability==='IN_STOCK').length;
  const outStockCount=books.length-inStockCount;
  const genreMap=books.reduce((acc, b)=> {
    if(b.availability==='IN_STOCK') 
    {
      acc[b.genre]=(acc[b.genre]||0)+1;
    }
    return acc;
  },{});
  const genreData=Object.entries(genreMap).map(([genre, value])=>({ genre, value }));
  return(
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? <div>Loading inventory…</div>:<InventoryTable books={books}/>}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Available Books by Genre</h3>
          <GenreBarChart data={genreData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Availability Summary</h3>
          <AvailabilityPieChart inStockCount={inStockCount} outStockCount={outStockCount} />
          <div className="mt-3">
            <div>In Stock: {inStockCount}</div>
            <div>Out of Stock: {outStockCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
