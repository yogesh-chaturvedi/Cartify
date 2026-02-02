import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();

  const [LoginLoading, setLoginLoading] = useState(false)
  const { verifyUser, user, setUser, loading } = useContext(AuthContext)

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
      setLoginLoading(true);
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASE_URL}/auth/login`,
        data: data,
        withCredentials: true
      })
      const { message, success, loggedInUser } = response.data;
      if (success) {
        setUser(loggedInUser)
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

        if (loggedInUser.role === "admin") navigate("/dashboard");
        else navigate("/");

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
      setLoginLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 shadow-xl">

        <h2 className="text-3xl font-bold text-white text-center mb-8">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* email */}
          <div>
            <label className="text-gray-200 block mb-1">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* password */}
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
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-blue-400 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>

          <button className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center ${LoginLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {LoginLoading ? (<span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>) : ("Login")}
          </button>

        </form>

        <p className="text-gray-300 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
