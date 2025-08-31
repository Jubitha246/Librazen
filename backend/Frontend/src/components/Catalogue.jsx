import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

function Catalogue() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // This should be the name of the category
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [borrowError, setBorrowError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CATEGORIES);
        console.log('Categories fetched:', res.data); // Log the fetched categories
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        toast.error('Error fetching categories'); // Show error message with toast
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!selectedCategory) return; // If no category is selected, do nothing
      try {
        console.log('Fetching books for category:', selectedCategory); // Log the selected category
        const res = await axios.get(`${API_ENDPOINTS.BOOKS_BY_CATEGORY}/${selectedCategory}`);
        console.log('Books fetched:', res.data); // Log the fetched books
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error.response ? error.response.data : error.message);
        toast.error('Error fetching books'); // Show error message with toast
      }
    };

    fetchBooks();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setBooks([]); // Clear the books when the category changes
    console.log('Category changed to:', event.target.value); // Log the selected category
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now

      await axios.post(API_ENDPOINTS.BORROW_BOOK, 
        { bookId, dueDate: dueDate.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the list of books for the selected category
      const res = await axios.get(`${API_ENDPOINTS.BOOKS_BY_CATEGORY}/${selectedCategory}`);
      console.log('Books refreshed after borrowing:', res.data); // Log the refreshed books
      setBooks(res.data);
      toast.success('Book borrowed successfully'); // Show success message with toast
      setBorrowError('');
    } catch (error) {
      console.error('Error borrowing book:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.message) {
        setBorrowError(error.response.data.message);
      } else {
        setBorrowError('Error borrowing book');
      }
      toast.error(borrowError || 'Error borrowing book'); // Show error message with toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Book Catalogue
            </h1>
            <p className="text-gray-600 text-lg">Browse and borrow books from our collection</p>
          </div>

          {/* Category Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium min-w-[300px]"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          {selectedCategory && (
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20">
                <input
                  type="text"
                  placeholder="Search books by title..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium min-w-[300px]"
                />
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book._id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {book.image && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={`${API_ENDPOINTS.BOOKS.replace('/book', '')}/uploads/${book.image}`}
                        alt={book.title}
                        className="w-32 h-32 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-3">by {book.author}</p>
                    <div className="mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        book.availableCopies > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    {book.availableCopies > 0 && (
                      <button
                        onClick={() => handleBorrowBook(book._id)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        Borrow Book
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : selectedCategory ? (
              <div className="col-span-full text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No books available in this category</p>
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-xl text-gray-600">Please select a category to browse books</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
