import React, {useState} from 'react';
import {addBook} from '../../api/bookApi';
export default function AddBookModal({onAdded}) 
{
  const [isOpen,setIsOpen]=useState(false);
  const [form,setForm]=useState({title:'',author:'',genre:'',price:'',coverImage:''});
  const [loading, setLoading] = useState(false);
  function open() 
    {
        setIsOpen(true);
    }
  function close()
    {
        setIsOpen(false);
    }
  function updateField(e) 
  {
    const {name,value}=e.target;
    setForm(prev=>({...prev,[name]:value}));
  }
  async function handleSubmit(e) 
  {
    e.preventDefault();
    //client-side validation
    if(!form.title.trim()||!form.author.trim()||!form.genre.trim()||!form.price) 
    {
      return alert('Please fill title,author,genre and price');
    }
    if(Number(form.price)<=0) 
        return alert('Price must be a positive number');
    setLoading(true);
    try 
    {
      const payload=
      {
        title:form.title.trim(),
        author:form.author.trim(),
        genre:form.genre.trim(),
        price:Number(form.price),
        coverImage:form.coverImage.trim() || null,
      };
      await addBook(payload);
      alert('Book added successfully');
      setForm({title:'',author:'',genre:'',price:'',coverImage:''});
      close();
      if(typeof onAdded==='function') 
        onAdded();
    } 
    catch(err) 
    {
      alert(err.message||'Failed to add book');
    } 
    finally 
    {
      setLoading(false);
    }
  }
  return (
    <>
      <button onClick={open} className="px-3 py-1 bg-green-600 text-white rounded">Add Book</button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={close} />
          <div className="bg-white rounded shadow-lg w-full max-w-md z-10 p-4">
            <h3 className="font-semibold mb-2">Add a new book</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" value={form.title} onChange={updateField} placeholder="Title" className="w-full px-3 py-2 border rounded" />
              <input name="author" value={form.author} onChange={updateField} placeholder="Author" className="w-full px-3 py-2 border rounded" />
              <input name="genre" value={form.genre} onChange={updateField} placeholder="Genre" className="w-full px-3 py-2 border rounded" />
              <input name="price" value={form.price} onChange={updateField} placeholder="Price" type="number" step="0.01" className="w-full px-3 py-2 border rounded" />
              <input name="coverImage" value={form.coverImage} onChange={updateField} placeholder="Cover filename (optional)" className="w-full px-3 py-2 border rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={close} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
                  {loading?'Saving...':'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
