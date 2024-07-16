import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from './Navbar'; // Import the Navbar component

function UserProfile() {
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in');
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:4001/user/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        setBorrowedBooks(res.data.borrowedBooks);
      } catch (error) {
        console.error('Error fetching user profile:', error.response || error.message);
        setError('Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleReturnBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4001/user/book/return', { bookId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch updated user profile and borrowed books
      const res = await axios.get('http://localhost:4001/user/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data.user);
      setBorrowedBooks(res.data.borrowedBooks);

      toast.success('Book returned successfully');
    } catch (error) {
      console.error('Error returning book:', error.response || error.message);
      toast.error('Error returning book');
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return <div className="text-center text-white">No user data</div>;

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      <div className="container mx-auto max-w-screen-xl md:px-8 px-4 mt-8">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-2xl mt-30 text-white font-bold mb-4 text-center">User Profile</h2>
          <div className="mb-4 text-center">
            <p><strong>Fullname:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Books Issued:</strong> {user.booksIssued}</p>
            <p><strong>Books Returned:</strong> {user.booksReturned}</p>
            <p><strong>Dues:</strong> ${user.dues}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">Borrowed Books</h3>
          {borrowedBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mx-auto">
                <thead className="bg-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Si. No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Book Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Borrow Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Return Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowedBooks.map((borrow, index) => (
                    <tr key={borrow._id}>
                      <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{borrow.book.title}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{new Date(borrow.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{borrow.returnedDate ? new Date(borrow.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {borrow.returnedDate
                          ? 'Returned'
                          : new Date(borrow.dueDate) < new Date()
                            ? 'Overdue'
                            : 'Pending'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {borrow.returnedDate && borrow.returnedDate > borrow.dueDate
                          ? `Fine: ${Math.ceil((new Date(borrow.returnedDate) - new Date(borrow.dueDate)) / (1000 * 3600 * 24)) * 2} Rs`
                          : '$0'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {!borrow.returnedDate ? (
                          <button
                            onClick={() => handleReturnBook(borrow.book._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Return
                          </button>
                        ) : (
                          <span>Returned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-white">No borrowed books</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

