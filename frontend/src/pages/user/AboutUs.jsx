import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { assets } from '../../assets/assets'
import { motion } from "framer-motion"

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <section className="w-full min-h-[calc(100vh-64px)] justify-center items-center flex bg-white py-16 px-6 md:px-12 lg:px-20">
                {/* Container */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Image */}
                    <motion.img
                        src={assets.heroImage}
                        alt="About Our Company"
                        className="w-full rounded-2xl shadow-lg object-cover h-[350px] md:h-[450px]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    />


                    {/* Right Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            About Our Company
                        </h2>


                        <p className="text-gray-700 leading-relaxed text-lg">
                            Cartify is a modern e-commerce platform built with one simple idea in mind — making online shopping smooth, fast, and reliable. We focus on creating a seamless experience where users can explore products easily, find what they need quickly, and shop with confidence.
                        </p>


                        <p className="text-gray-700 leading-relaxed text-lg">
                            At Cartify, we bring together a wide range of products across multiple categories, designed to meet everyday needs without unnecessary complexity. From browsing to checkout, every step is carefully crafted to be intuitive, responsive, and user-friendly across all devices.
                        </p>


                        <p className="text-gray-700 leading-relaxed text-lg">
                            Quality matters to us — not just in products, but in experience. Cartify is built using modern technologies to ensure fast load times, secure interactions, and consistent performance. We continuously improve our platform to maintain reliability, scalability, and a smooth user journey.
                        </p>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default AboutUs
