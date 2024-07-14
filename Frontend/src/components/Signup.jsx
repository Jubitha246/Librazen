import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm();
  const password = React.useRef({});
  password.current = watch("password", "");

  const showModal = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('my_modal_3').showModal();
    }, 0);
  };

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("http://localhost:4001/user/signup", userInfo);
      console.log(res.data);
      if (res.data) {
        toast.success("Signup Successfully");
        navigate('/');  // Redirect after successful signup
      }
      localStorage.setItem("Users",JSON.stringify(res.data.user));
    } catch (err) {
      console.log(err);
      toast.error("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitForm = (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match. Please re-enter your passwords.");
      reset();
      return;
    }
    onSubmit(data);  // Call the onSubmit function
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="font-bold text-2xl text-center mb-6">Sign Up</h3>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="mb-4">
            <label className="block mb-2">Full Name:</label>
            <input type="text" className="input input-bordered w-full focus:outline-black" {...register("fullname", { required: true })} />
            {errors.fullname && <span className="text-sm text-red-600">Name is required</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input type="email" className="input input-bordered w-full focus:outline-black" {...register("email", { required: true })} />
            {errors.email && <span className="text-sm text-red-600">Email is required</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Create Password:</label>
            <input type="password" className="input input-bordered w-full focus:outline-black" {...register("password", { required: true })} />
            {errors.password && <span className="text-sm text-red-600">Password is required</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirm Password:</label>
            <input type="password" className="input input-bordered w-full focus:outline-black" {...register("confirmPassword", {
              required: true,
              validate: value => value === password.current || "Passwords do not match"
            })} />
            {errors.confirmPassword && <span className="text-sm text-red-600">{errors.confirmPassword.message}</span>}
          </div>
          <div className="flex justify-center">
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>Sign Up</button>
          </div>
        </form>
        <p className="text-center mt-4">Already have an account? <button type="button" className="text-blue-500 underline" onClick={showModal}>Login</button></p>
      </div>
    </div>
  );
}

export default Signup;
