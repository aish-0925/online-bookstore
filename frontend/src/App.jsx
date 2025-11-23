import React from 'react';
import {Routes,Route,Link } from 'react-router-dom';
import StorePage from './pages/StorePage';
import InventoryPage from './pages/InventoryPage';
export default function App() 
{
  return(
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Online Bookstore</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-700">Store</Link>
            <Link to="/inventory" className="text-gray-700 hover:text-blue-700">Inventory</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; 2025
      </footer>
    </div>
  );
}
