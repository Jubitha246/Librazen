import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const [loginType, setLoginType] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    const url = loginType === 'admin' ? '/user/login/admin' : '/user/login';
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post(`http://localhost:4001${url}`, userInfo);
      console.log(res.data);
      if (res.data) {
        toast.success(`Logged in as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)} successfully`);
        localStorage.setItem('token', res.data.token);
        document.getElementById("my_modal_3").close();
        setTimeout(() => {
          window.location.reload();
          localStorage.setItem("Users", JSON.stringify(res.data.user));
        }, 1000);
        navigate('/');  // Redirect after successful signup
      }
    } catch (err) {
      console.log(err);
      toast.error("Error: " + (err.response?.data?.message || err.message));
      setTimeout(() => { }, 3000);
    }
  };
  // Function to open the modal
  const openModal = () => {
    document.getElementById('my_modal_3').showModal();
  };
  // Function to close the modal and navigate to the home page
  const closeModalAndNavigateHome = () => {
    setLoginType(null);
    document.getElementById('my_modal_3').close();
    navigate('/');
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        {/* Close button for the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeModalAndNavigateHome}>
          ✕
        </button>
        {/* Conditional rendering based on loginType */}
        {loginType === null ? (
          <div>
            <h3 className="font-bold text-lg">Login</h3>
            <p className="py-4">Are you an Admin or User?</p>
            <div className="flex justify-around mb-4">
              {/* Buttons to choose Admin or User */}
              <button className="btn btn-primary" type="button" onClick={() => setLoginType('admin')}>Admin</button>
              <button className="btn btn-secondary" type="button" onClick={() => setLoginType('user')}>User</button>
            </div>
            <p className="text-center">
              {/* Link to Signup page */}
              Don't have an account? <Link to="/signup" className="text-blue-500 underline" onClick={closeModalAndNavigateHome}>Sign up</Link>
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-lg">{loginType === 'admin' ? 'Admin Login' : 'User Login'}</h3>
            {/* Form for login with email and password */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="py-1">
                <label className="block mb-1">Email:</label>
                {/* Input field for Email with validation */}
                <input type="email" className="input input-bordered w-full focus:outline-black" {...register("email", { required: true })} />
                {/* Error message for Email validation */}
                {errors.email && <span className="text-sm text-red-600">This field is required</span>}
              </div>
              <div className="py-1">
                <label className="block mb-1">Password:</label>
                {/* Input field for Password with validation */}
                <input type="password" className="input input-bordered w-full focus:outline-black" {...register("password", { required: true })} />
                {/* Error message for Password validation */}
                {errors.password && <span className="text-sm text-red-600">This field is required</span>}
              </div>
              <div className="modal-action">
                {/* Submit button for login */}
                <button type="submit" className="btn">Login</button>
              </div>
            </form>
            <p className="text-center">
              {/* Link to Signup page */}
              Don't have an account? <Link to="/signup" className="text-blue-500 underline" onClick={closeModalAndNavigateHome}>Sign up</Link>
            </p>
            {/* Close button inside the login form */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModalAndNavigateHome}>✕</button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default Login;
