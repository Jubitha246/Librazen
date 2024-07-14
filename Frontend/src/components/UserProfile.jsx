import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [borrowError, setBorrowError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in');
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:4001/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error.response || error.message);
        setError('Error fetching user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4001/user/book/return/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Book returned successfully');
      setBorrowError('');
      const res = await axios.get('http://localhost:4001/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error returning book:', error.response || error.message);
      setBorrowError('Error returning book');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="container mx-auto md:px-20 px-4 mt-8">
      <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div>
          <p><strong>Fullname:</strong> {user.user.fullname}</p>
          <p><strong>Email:</strong> {user.user.email}</p>
          <p><strong>Role:</strong> {user.user.role}</p>
          <p><strong>Books Issued:</strong> {user.booksIssued}</p>
          <p><strong>Books Returned:</strong> {user.booksReturned}</p>
          <p><strong>Dues:</strong> ${user.dues}</p>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Borrowed Books:</h3>
            {user.borrowedBooks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50">Si. No.</th>
                    <th className="px-6 py-3 bg-gray-50">Book Title</th>
                    <th className="px-6 py-3 bg-gray-50">Author</th>
                    <th className="px-6 py-3 bg-gray-50">Category</th>
                    <th className="px-6 py-3 bg-gray-50">Borrow Date</th>
                    <th className="px-6 py-3 bg-gray-50">Due Date</th>
                    <th className="px-6 py-3 bg-gray-50">Return Date</th>
                    <th className="px-6 py-3 bg-gray-50">Status</th>
                    <th className="px-6 py-3 bg-gray-50">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user.borrowedBooks.map((borrow, index) => (
                    <tr key={borrow.book._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrow.book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrow.book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrow.book.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(borrow.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrow.returnedDate ? new Date(borrow.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrow.returnedDate ? 'Returned' : 'Pending'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!borrow.returnedDate && (
                          <button
                            onClick={() => handleReturnBook(borrow.book._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No books borrowed</p>
            )}
          </div>
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          {borrowError && <p className="text-red-500 mt-4">{borrowError}</p>}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
