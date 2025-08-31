import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPortal() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', image: null });
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:4001/book');
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:4001/category');
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
      await axios.post('http://localhost:4001/book', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Book added successfully');
      setNewBook({ title: '', author: '', category: '', image: null });
      const res = await axios.get('http://localhost:4001/book');
      setBooks(res.data);
    } catch (error) {
      console.error('Error adding book:', error);
      setMessage('Error adding book');
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
      await axios.put(`http://localhost:4001/book/${selectedBook._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Book updated successfully');
      setSelectedBook(null);
      const res = await axios.get('http://localhost:4001/book');
      setBooks(res.data);
    } catch (error) {
      console.error('Error updating book:', error);
      setMessage('Error updating book');
    }
  };

  const handleDeleteBook = async (id) => {
    console.log('Deleting book with ID:', id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4001/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Book deleted successfully');
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      setMessage('Error deleting book');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4001/category', { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Category added successfully');
      setNewCategory('');
      const res = await axios.get('http://localhost:4001/category');
      setCategories(res.data);
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Error adding category');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl md:px-8 px-4 mt-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">Admin Portal</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex flex-col items-center">
          <div className="mb-4 w-full md:w-80">
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
          </div>
          <div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 mx-auto"
          >
            Add Category
          </button>
          </div>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="flex flex-col items-center">
          <div className="mb-4 w-full md:w-80">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4 w-full md:w-80">
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4 w-full md:w-80">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={newBook.category}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md w-full"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 w-full md:w-80">
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          </div>
          <div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 mx-auto"
          >
            Add Book
          </button>
          </div>
          {message && <p className="mt-4 text-green-500">{message}</p>}
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">All Books</h2>
        <table className="min-w-full bg-white mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Serial No</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Title</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Author</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Category</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Image</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book._id}>
                <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                <td className="py-2 px-4 border-b border-gray-200">{book.title}</td>
                <td className="py-2 px-4 border-b border-gray-200">{book.author}</td>
                <td className="py-2 px-4 border-b border-gray-200">{book.category}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {book.image && (
                    <img
                      src={`http://localhost:4001/uploads/${book.image}`}
                      alt={book.title}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="mt-2 mb-1">
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 ml-2"
                    onClick={() => setSelectedBook(book)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            <form onSubmit={handleUpdateBook}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedBook.title}
                  onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  name="author"
                  value={selectedBook.author}
                  onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={selectedBook.category}
                  onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setSelectedBook({ ...selectedBook, image: e.target.files[0] })}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
              >
                Update Book
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white p-2 rounded-md w-full mt-4 hover:bg-gray-600"
                onClick={() => setSelectedBook(null)}
              >
                Cancel
              </button>
              {message && <p className="mt-4 text-green-500">{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPortal;
