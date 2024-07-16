import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Logout from '../components/Logout';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';

function Navbar() {
  const [authUser, setAuthUser] = useAuth();
  const [sticky, setSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showModal = () => {
    document.getElementById('my_modal_3').showModal();
  };

  const handleAdminLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4001/user/login/admin", {
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
        navigate('/admin'); // Redirect to admin dashboard or portal
      }
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0${sticky ? " sticky-navbar shadow-md bg-slate-100 transition-all ease-in-out z-50" : ""}`}>
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
              <li><a>About Us</a></li>
              {authUser && authUser.role === 'user' && <li><Link to="/catalogue">Catalogue</Link></li>}
              <li><a href="/Leaderboard">Leaderboard</a></li>
              {authUser && authUser.role === 'admin' && <li><Link to="/admin/profile">Admin Portal</Link></li>}
            </ul>
          </div>
          <a className="text-2xl text-black font-bold cursor-pointer ml-4">Librazen</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <li><Link to="/">Home</Link></li>
            <li><a>About Us</a></li>
            {authUser && authUser.role === 'user' && <li><Link to="/catalogue">Catalogue</Link></li>}
            <li><a>Leaderboard</a></li>
            {authUser && authUser.role === 'admin' && <li><Link to="/admin/profile">Admin Portal</Link></li>}
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
