import React, { useState, useRef, useEffect } from 'react';
import {addBook,uploadCover} from '../../api/bookApi';
export default function AddBookModal({onAdded}) 
{
  const [isOpen,setIsOpen]=useState(false);
  const [form,setForm]=useState({title:'',author:'',genre:'',price:'',coverImage:''});
  const [loading, setLoading] = useState(false);
  const [file,setFile]=useState(null);
  const fileInputRef=useRef(null);
  const firstInputRef=useRef(null);
  function open() 
    {
        setIsOpen(true);
    }
  function close()
    {
        setIsOpen(false);
    }
    useEffect(() => {
    if (isOpen) {
      //to autofocus first input and prevent background scroll while modal open
      setTimeout(() => firstInputRef.current?.focus(),0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      //to reset file input DOM value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  function updateField(e) 
  {
    const {name,value}=e.target;
    setForm(prev=>({...prev,[name]:value}));
  }
  function handleFileChange(e) {
    const f=e.target.files&&e.target.files[0];
    if(!f) 
    {
      setFile(null);
      return;
    }
    //small client-side checks
    const allowed=['image/jpeg','image/png'];
    if(!allowed.includes(f.type)) 
    {
      alert('Only JPG or PNG images are allowed for cover images.');
      e.target.value=null;
      setFile(null);
      return;
    }
    const MAX_BYTES=2*1024*1024; //2MB
    if(f.size>MAX_BYTES) 
    {
      alert('Image too large. Max 2MB allowed.');
      e.target.value = null;
      setFile(null);
      return;
    }
    setFile(f);
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
      //1)if user selected a file, upload it first and get filename
      let coverFilename=form.coverImage?.trim()||null;
      if(file) 
      {
        const uploaded=await uploadCover(file);
        coverFilename = uploaded.filename;
      } 
      else if(coverFilename==='') 
      {
        coverFilename=null;
      }
      //2)create book record pointing to uploaded filename 
      const payload=
      {
        title:form.title.trim(),
        author:form.author.trim(),
        genre:form.genre.trim(),
        price:Number(form.price),
        coverImage: coverFilename,
      };
      await addBook(payload);
      alert('Book added successfully');
      setForm({title:'',author:'',genre:'',price:'',coverImage:''});
      setFile(null);
      if(fileInputRef.current) 
        fileInputRef.current.value = null;
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
          <div className="absolute inset-0 bg-black opacity-40" onClick={()=>{
            const hasChanges = form.title || form.author || form.genre || form.price || form.coverImage || file;
              if(!hasChanges||window.confirm('Discard changes?')) close();
          }} />
          <div className="bg-white rounded shadow-lg w-full max-w-md z-10 p-4">
            <h3 className="font-semibold mb-2">Add a new book</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" value={form.title} onChange={updateField} placeholder="Title" className="w-full px-3 py-2 border rounded" />
              <input name="author" value={form.author} onChange={updateField} placeholder="Author" className="w-full px-3 py-2 border rounded" />
              <input name="genre" value={form.genre} onChange={updateField} placeholder="Genre" className="w-full px-3 py-2 border rounded" />
              <input name="price" value={form.price} onChange={updateField} placeholder="Price" type="number" step="0.01" className="w-full px-3 py-2 border rounded" />
              <input name="coverImage" value={form.coverImage} onChange={updateField} placeholder="Cover filename (optional)" className="w-full px-3 py-2 border rounded" />
              <div>
                <label className="text-sm text-gray-600">Upload cover image (optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                  aria-label="Cover file"
                />
                {file && <div className="text-xs text-gray-600 mt-1">Selected: {file.name}</div>}
              </div>
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
