import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast, Toaster } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

function AdminPortal() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', image: null });
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.BOOKS);
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CATEGORIES);
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBooks();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewBook({ ...newBook, image: e.target.files[0] });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('category', newBook.category);
    formData.append('image', newBook.image);
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.BOOKS, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Book added successfully');
      setNewBook({ title: '', author: '', category: '', image: null });
      const res = await axios.get(API_ENDPOINTS.BOOKS);
      setBooks(res.data);
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error adding book');
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', selectedBook.title);
    formData.append('author', selectedBook.author);
    formData.append('category', selectedBook.category);
    if (selectedBook.image) {
      formData.append('image', selectedBook.image);
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_ENDPOINTS.BOOKS}/${selectedBook._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Book updated successfully');
      setSelectedBook(null);
      const res = await axios.get(API_ENDPOINTS.BOOKS);
      setBooks(res.data);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_ENDPOINTS.BOOKS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book deleted successfully');
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.CATEGORIES, { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category added successfully');
      setNewCategory('');
      const res = await axios.get(API_ENDPOINTS.CATEGORIES);
      setCategories(res.data);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-screen-xl px-4 py-8">
          <div className="mt-16">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Admin Portal
              </h1>
              <p className="text-gray-600 text-lg">Manage your library's books and categories</p>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Add New Category Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
                </div>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Add Category
                  </button>
                </form>
              </div>
              
              {/* Add New Book Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
                </div>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newBook.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter book title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={newBook.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={newBook.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Add Book
                  </button>
                </form>
              </div>
            </div>
            
            {/* All Books Table Section */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">All Books</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
                  <thead className="bg-gradient-to-r from-purple-500 to-purple-600">
                    <tr>
                      <th className="py-4 px-6 text-left text-white font-semibold">Serial No</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Title</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Author</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Category</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books.map((book, index) => (
                      <tr key={book._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        <td className="py-4 px-6 text-gray-800 font-semibold">{book.title}</td>
                        <td className="py-4 px-6 text-gray-700">{book.author}</td>
                        <td className="py-4 px-6">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedBook(book)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

                      {/* Edit Book Section */}
            {selectedBook && (
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
                </div>
                <form onSubmit={handleUpdateBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={selectedBook.title}
                      onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={selectedBook.author}
                      onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={selectedBook.category}
                      onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedBook({ ...selectedBook, image: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Update Book
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPortal;
