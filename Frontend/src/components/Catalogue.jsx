import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Catalogue() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [borrowError, setBorrowError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:4001/category');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (selectedCategory) {
          const res = await axios.get(`http://localhost:4001/book/category/${selectedCategory}`);
          setBooks(res.data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Error fetching books');
      }
    };

    fetchBooks();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now

      await axios.post(`http://localhost:4001/book/borrow/${bookId}`, { dueDate: dueDate.toISOString() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Book borrowed successfully');
      setBorrowError('');
    } catch (error) {
      console.error('Error borrowing book:', error);
      setBorrowError('Error borrowing book');
    }
  };

  return (
    <div className="container mx-auto md:px-20 px-4 mt-8">
      <div className="mt-20 flex justify-center">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 p-2 rounded-md w-64"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8">
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {borrowError && <p className="text-red-500">{borrowError}</p>}
        <div className="flex flex-wrap justify-center">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="border border-gray-300 p-4 rounded-md m-2">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
                {book.image && (
                  <img
                    src={`http://localhost:4001/uploads/${book.image}`}
                    alt={book.title}
                    className="w-32 h-32 object-cover mx-auto mt-2"
                  />
                )}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleBorrowBook(book._id)}
                    className="mt-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mx-auto"
                  >
                    Borrow
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No books available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
