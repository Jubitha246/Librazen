import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
        const res = await axios.get('http://localhost:4001/category');
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
        const res = await axios.get(`http://localhost:4001/book/category/${selectedCategory}`);
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

      await axios.post('http://localhost:4001/user/borrow', 
        { bookId, dueDate: dueDate.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the list of books for the selected category
      const res = await axios.get(`http://localhost:4001/book/category/${selectedCategory}`);
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
      {selectedCategory && (
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search books by title"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-2 rounded-md w-64"
          />
        </div>
      )}
      <div className="mt-8">
        <div className="flex flex-wrap justify-center">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="border border-gray-300 p-4 rounded-md m-2">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-center">{book.author}</p>
                {book.image && (
                  <img
                    src={`http://localhost:4001/uploads/${book.image}`}
                    alt={book.title}
                    className="w-32 h-32 object-cover mx-auto mt-2"
                  />
                )}
                <p
                  className={`mt-2 px-3 text-center ${book.availableCopies > 0 ? 'text-green-500' : 'text-red-500'}`}
                >{book.availableCopies > 0 ? 'Available' : 'Not Available'}
                </p>
                {book.availableCopies > 0 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleBorrowBook(book._id)}
                      className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mx-auto"
                    >
                      Borrow
                    </button>
                  </div>
                )}
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
