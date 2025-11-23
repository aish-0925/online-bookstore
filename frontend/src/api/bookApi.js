import axios from 'axios';

const API_BASE=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
const client = axios.create(
{
  baseURL:API_BASE,
  timeout:5000,
});
//transform error to uniform shape
function extractError(err) 
{
  if(!err||!err.response) 
    {
        return {status:0,message:err?.message||'Network error'};
    }
  const{status,data}=err.response;
  return {status,message:(data && data.error)||data?.message||'Server error',data};
}

export async function fetchBooks(params={}) 
{
  try 
  {
    const res=await client.get('/books',{params});
    //backend returns{ data,meta}
    return {data:res.data.data||[],meta:res.data.meta||{}};
  } catch(err) 
  {
    throw extractError(err);
  }
}

export async function addBook(payload) 
{
  try {
    const res=await client.post('/add-book',payload);
    return res.data;
  } 
  catch(err) 
  {
    throw extractError(err);
  }
}

export async function purchaseBook(id) 
{
  try 
  {
    const res=await client.post('/purchase',{id});
    return res.data;
  } 
  catch(err) 
  {
    throw extractError(err);
  }
}

export async function updateBook(id,payload) 
{
  try 
  {
    const res=await client.put(`/update-book/${id}`,payload);
    return res.data;
  } 
  catch(err) 
  {
    throw extractError(err);
  }
}
