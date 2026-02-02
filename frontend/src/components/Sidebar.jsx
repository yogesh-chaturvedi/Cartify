import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, Package, Users, Settings, ShoppingCart, LogOut, ExternalLink } from "lucide-react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const Sidebar = () => {

    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const location = useLocation();

    const tabs = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Products", path: "/dashboard/products", icon: <Package size={20} /> },
        { name: "Orders", path: "/dashboard/orders", icon: <ShoppingCart size={20} /> },
        { name: "Users", path: "/dashboard/users", icon: <Users size={20} /> },
        { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
    ];

    // logout request
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
                setTimeout(() => {
                    navigate('/login')
                }, 1500);
            }
        }
        catch (error) {
            console.error('Logout error', error)
        }
    }


    return (
        <div className="flex">
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            {/* MOBILE TOGGLE */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-4" >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* SIDEBAR */}
            <aside
                className={`bg-[#0e1b2c] text-white min-h-screen w-64 p-6 flex flex-col shadow-lg transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 fixed md:static left-0 top-0 z-30`}
            >
                <h1 className="text-2xl font-bold tracking-wide mb-6">Admin Panel</h1>

                <nav className="space-y-2">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${location.pathname === tab.path ? "bg-blue-600 shadow-md" : "hover:bg-blue-500/40"
                                }`}>
                            {tab.icon}
                            <span className="text-lg">{tab.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* SPACER TO PUSH BUTTONS TO BOTTOM */}
                <div className="flex-1"></div>

                {/* BOTTOM BUTTONS */}
                <div className="space-y-2">
                    {/* VISIT WEBSITE */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500/40 w-full transition-colors"
                    >
                        <ExternalLink size={20} />
                        <span className="text-lg">Visit Website</span>
                    </a>

                    {/* LOGOUT */}
                    <button onClick={() => { handleLogout() }} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 w-full">
                        <LogOut size={20} />
                        <span className="text-lg">Logout</span>
                    </button>
                </div>
            </aside>
        </div>
    )
}

export default Sidebar
