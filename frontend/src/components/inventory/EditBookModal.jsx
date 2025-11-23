import React, {useState,useEffect} from 'react';
import {updateBook} from '../../api/bookApi';
export default function EditBookModal({book,onUpdated}) 
{
  const [isOpen,setIsOpen]=useState(false);
  const [form,setForm]=useState({title:'',author:'',genre:'',price:'',availability:'IN_STOCK',coverImage:''});
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    if(book) 
    {
      setForm(
        {
            title:book.title||'',
            author:book.author||'',
            genre:book.genre||'',
            price:book.price||'',
            availability:book.availability||'IN_STOCK',
            coverImage:book.coverImage||'',
      });
    }
  },[book]);
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
    const {name,value} = e.target;
    setForm(prev=>({ ...prev,[name]:value}));
  }
  async function handleSubmit(e) 
  {
    e.preventDefault();
    setLoading(true);
    try 
    {
      const payload = 
      {
        title:form.title.trim(),
        author:form.author.trim(),
        genre:form.genre.trim(),
        price:Number(form.price),
        availability:form.availability,
        coverImage:form.coverImage.trim()||null,
      };
      await updateBook(book.id,payload);
      alert('Book updated');
      close();
      if(typeof onUpdated==='function') 
        onUpdated();
    } 
    catch(err) 
    {
      alert(err.message||'Failed to update book');
    } 
    finally 
    {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={open} className="px-2 py-1 border rounded">Edit</button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={close} />
          <div className="bg-white rounded shadow-lg w-full max-w-md z-10 p-4">
            <h3 className="font-semibold mb-2">Edit book</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" value={form.title} onChange={updateField} placeholder="Title" className="w-full px-3 py-2 border rounded" />
              <input name="author" value={form.author} onChange={updateField} placeholder="Author" className="w-full px-3 py-2 border rounded" />
              <input name="genre" value={form.genre} onChange={updateField} placeholder="Genre" className="w-full px-3 py-2 border rounded" />
              <input name="price" value={form.price} onChange={updateField} placeholder="Price" type="number" step="0.01" className="w-full px-3 py-2 border rounded" />
              <select name="availability" value={form.availability} onChange={updateField} className="w-full px-3 py-2 border rounded">
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
              <input name="coverImage" value={form.coverImage} onChange={updateField} placeholder="Cover filename (optional)" className="w-full px-3 py-2 border rounded" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={close} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
                  {loading ?'Saving...':'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
