import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { SettingsContext } from '../context/SettingsContext'

function Footer() {

    const { fetchSettings, settings, setSettings } = useContext(SettingsContext)

    return (
        <footer className="bg-blue-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Website Name & Motto */}
                <div>
                    <h2 className="text-2xl font-bold mb-3">{settings?.[0]?.business.brandName}</h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        A modern e-commerce platform built for effortless, secure, and personalized shopping experiences.
                    </p>
                </div>


                {/* Navigation Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <div className="flex flex-col">
                        <NavLink to='/' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Home</NavLink>
                        <NavLink to='/collection' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Collection</NavLink>
                        <NavLink to='/about' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>About</NavLink>
                        <NavLink to='/contact' className={({ isActive }) => isActive ? "underline text-gray-200" : ""}>Contact</NavLink>
                    </div>
                </div>


                {/* Extra About Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        To redefine online shopping by blending innovation, trust, and simplicity-creating an e-commerce platform that understands users, evolves with technology, and delivers value beyond products.
                    </p>
                </div>
                
            </div>


            {/* Bottom Bar */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} Yogesh Chaturvedi. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
