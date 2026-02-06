import React, { useState } from 'react'
import { Leaf, ListOrdered, ShoppingCart } from "lucide-react"
import { User, LayoutDashboard, LogOut, X } from "lucide-react";
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { SettingsContext } from '../context/SettingsContext';
import { assets } from '../assets/assets';



const Navbar = () => {

    const { verifyUser, user, setUser, loading } = useContext(AuthContext);
    const { fetchCart, cart, setCart } = useContext(CartContext);
    const { fetchSettings, settings, setSettings } = useContext(SettingsContext)

    // console.log("cart", cart)

    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)

    // run verify function 
    useEffect(() => {
        verifyUser()
    }, [])

    function handleToggle() {
        if (isOpen === true) {
            setIsOpen(false)
        }
        else {
            setIsOpen(true)
        }
    }

    // it will naviagte to login page
    function navigateLogin() {
        navigate('/login');
    }

    // it will naviagte to signup page
    function navigateSignup() {
        navigate('/signup');
    }

    // to logout user 
    async function handleLogout() {
        try {
            const response = await axios({
                method: 'delete',
                url: `${import.meta.env.VITE_BASE_URL}/auth/logout`,
                withCredentials: true
            })
            const { message, success } = response.data;
            if (success) {
                toast(message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setUser(null)
                setTimeout(() => {
                    navigate('/login')
                }, 100);
            }
        }
        catch (error) {
            console.error('Logout error', error)
        }
        finally {
            setIsOpen(false)
        }
    }

    // it will naviagte to cart
    function handleCart() {
        navigate('/cart')
    }

    return (
        <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        {/* < Leaf color='black' size={36} /> */}
                        <img src={assets.logo} alt="logo" className='h-10 rounded-md ' />
                        <span className="font-bold text-xl">{settings?.[0]?.business.brandName}</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <NavLink to='/' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Home</NavLink>
                        <NavLink to='/collection' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Collection</NavLink>
                        <NavLink to='/about' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>About</NavLink>
                        <NavLink to='/contact' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Contact</NavLink>
                    </div>


                    {/* Buttons */}
                    {user !== null ? (
                        <div className='flex items-center gap-8'>

                            <button onClick={() => { handleToggle() }} className='relative'>{user?.profileImage?.url ? (<img src={user?.profileImage?.url} alt="profile-image" className='h-12 w-12 border-2 border-gray-700  rounded-full' />) : (<User size={20} className="text-gray-500 h-12 w-12 rounded-full bg-gray-200" />)}
                            </button>

                            {user?.role === "user" ? (<button className='relative' onClick={() => { handleCart() }}><ShoppingCart color='green' size={26} className="cursor-pointer" />
                                <span
                                    className="absolute -top-3 -right-2  rounded-full min-w-[20px] h-5 flex items-center justify-center bg-red-600 text-white text-xs font-semibold px-1 shadow-md"
                                >
                                    {cart !== null ? (cart.items.length) : ("0")}
                                </span>
                            </button>) : ('')}
                        </div>
                    ) : (<div className="flex space-x-4">
                        <button onClick={() => { navigateLogin() }} className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-900 transition-colors">
                            Login
                        </button>
                        <button onClick={() => { navigateSignup() }} className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors">
                            Signup
                        </button>

                    </div>)}

                    {/* options */}
                    {isOpen && (
                        <div className="absolute top-14 right-20 w-44 rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden animate-fadeIn ">

                            {/* Close Icon */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition"
                            >
                                <X size={16} className="text-gray-500 hover:text-gray-700" />
                            </button>

                            {/* profile */}
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-3 pt-4 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                            >
                                <User size={18} />
                                Profile
                            </Link>

                            {/* my orders */}
                            {user.role === "user" && (<Link
                                to="/myorders"
                                className="flex items-center gap-3 px-4 py-3 pt-4 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                            >
                                <ListOrdered size={18} />
                                My Orders
                            </Link>)}

                            {/* dashboard */}
                            {user?.role === "admin" && (<Link
                                to="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>)}

                            <div className="border-t border-gray-200" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Navbar
