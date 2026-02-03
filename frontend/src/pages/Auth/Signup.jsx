import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';

const Signup = () => {

  const [signupLoading, setSignupLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()


  // submit function 
  async function onSubmit(data) {

    try {
      setSignupLoading(true);
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        data: data
      })
      const { message, success } = response.data;
      if (success) {
        toast(message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
    catch (error) {
      console.error('error', error);

      const message = error.response?.data?.message
      toast(message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    finally {
      reset();
      setSignupLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Create an Account
        </h2>

        {/* ---------- FORM START ---------- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="text-gray-200 block mb-1">Full Name</label>
            <input
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
              })}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-200 block mb-1">Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-200 block mb-1">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Button */}
          <button className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center ${signupLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {signupLoading ? (<span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>) : ("Creat Account")}
          </button>
        </form>
        {/* ---------- FORM END ---------- */}

        {/* NEXT PAGE LINKS */}
        <p className="text-gray-300 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
