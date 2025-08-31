import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
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
        const res = await axios.get(API_ENDPOINTS.USER_PROFILE, {
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
      await axios.post(API_ENDPOINTS.RETURN_BOOK, { bookId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch updated user profile and borrowed books
      const res = await axios.get(API_ENDPOINTS.USER_PROFILE, {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              User Profile
            </h1>
            <p className="text-gray-600 text-lg">Manage your borrowed books and account</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">{user.fullname}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Issued</p>
                    <p className="text-lg font-semibold text-gray-800">{user.booksIssued}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Returned</p>
                    <p className="text-lg font-semibold text-gray-800">{user.booksReturned}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dues</p>
                    <p className="text-lg font-semibold text-gray-800">${user.dues}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Borrowed Books Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Borrowed Books</h3>
            </div>
            
            {borrowedBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
                  <thead className="bg-gradient-to-r from-pink-500 to-pink-600">
                    <tr>
                      <th className="py-4 px-6 text-left text-white font-semibold">Si. No.</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Book Title</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Borrow Date</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Due Date</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Return Date</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Status</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Fine</th>
                      <th className="py-4 px-6 text-left text-white font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrowedBooks.map((borrow, index) => (
                      <tr key={borrow._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        <td className="py-4 px-6 text-gray-800 font-semibold">{borrow.book.title}</td>
                        <td className="py-4 px-6 text-gray-700">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-700">{new Date(borrow.dueDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-700">{borrow.returnedDate ? new Date(borrow.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            borrow.returnedDate
                              ? 'bg-green-100 text-green-800'
                              : new Date(borrow.dueDate) < new Date()
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {borrow.returnedDate
                              ? 'Returned'
                              : new Date(borrow.dueDate) < new Date()
                                ? 'Overdue'
                                : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {borrow.returnedDate && borrow.returnedDate > borrow.dueDate
                            ? `Fine: ${Math.ceil((new Date(borrow.returnedDate) - new Date(borrow.dueDate)) / (1000 * 3600 * 24)) * 2} Rs`
                            : '$0'}
                        </td>
                        <td className="py-4 px-6">
                          {!borrow.returnedDate ? (
                            <button
                              onClick={() => handleReturnBook(borrow.book._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200 font-medium"
                            >
                              Return
                            </button>
                          ) : (
                            <span className="text-green-600 font-medium">Returned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <p className="text-xl text-gray-600">No borrowed books</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
