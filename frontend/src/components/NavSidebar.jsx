import React, { useState } from 'react'
import { X } from "lucide-react";
import { NavLink } from 'react-router-dom';

const NavSidebar = ({ openMenu, onClose }) => {


    return (
        <div>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${openMenu ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}

            <aside
                className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-50
        transform transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">

                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex flex-col gap-4 p-4">
                    <NavLink to='/' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Home</NavLink>
                    <NavLink to='/collection' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Collection</NavLink>
                    <NavLink to='/about' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>About</NavLink>
                    <NavLink to='/contact' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Contact</NavLink>
                </nav>
            </aside>


        </div>
    )
}

export default NavSidebar
