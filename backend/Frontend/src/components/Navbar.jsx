import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Logout from '../components/Logout';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

function Navbar() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const showModal = () => {
    document.getElementById('my_modal_3').showModal();
  };

  const handleAdminLogin = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, {
        email: 'admin@example.com',
        password: 'adminpassword'
      });
      if (res.data) {
        setAuthUser({
          ...authUser,
          user: res.data.user,
          role: 'admin'
        });
        toast.success("Admin Logged In Successfully");
        document.getElementById('my_modal_3').close();
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        navigate('/admin/profile'); // Redirect to admin profile first
      }
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm`}>
      <div className="navbar flex justify-between items-center">
        <div className="navbar-start flex items-center">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              {authUser && authUser.role === 'user' && <li><Link to="/catalogue">Catalogue</Link></li>}
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              {authUser && authUser.role === 'admin' && (
                <>
                  <li><Link to="/admin">Admin Portal</Link></li>
                  <li><Link to="/admin/profile">Admin Profile</Link></li>
                  <li><Link to="/admin/analytics">Analytics</Link></li>
                </>
              )}
            </ul>
          </div>
          <a className="text-2xl text-black font-bold cursor-pointer ml-4">Librazen</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            {authUser && authUser.role === 'user' && <li><Link to="/catalogue">Catalogue</Link></li>}
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            {authUser && authUser.role === 'admin' && (
              <>
                <li><Link to="/admin">Admin Portal</Link></li>
                <li><Link to="/admin/profile">Admin Profile</Link></li>
                <li><Link to="/admin/analytics">Analytics</Link></li>
              </>
            )}
          </ul>
        </div>
        <div className="navbar-end flex items-center space-x-3">
          <label className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
            <input type="text" className="grow outline-none border-none bg-white placeholder-gray-500 text-black" placeholder="Search" style={{ backgroundColor: 'white', color: 'black' }} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
          {authUser ? (
            <>
              {authUser.role === 'user' && <Link to="/user/profile" className="text-black px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white duration-300 cursor-pointer">Profile</Link>}
              <Logout />
            </>
          ) : (
            <a className="bg-black text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer" onClick={showModal}>Login</a>
          )}
        </div>
      </div>
      <Login />
    </div>
  );
}

export default Navbar;
