import React from 'react'
import { Link } from 'react-router-dom'

const Reset = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Reset Password</h2>


        <form className="space-y-5">
          <div>
            <label className="text-gray-200 block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Send Reset Link
          </button>
        </form>


        <p className="text-gray-300 text-center mt-6">
          Back to{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Reset
