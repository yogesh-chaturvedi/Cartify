import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { assets } from '../../assets/assets'
import { motion } from "framer-motion"

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <section className="w-full h-[calc(100vh-64px)] justify-center items-center flex bg-white py-16 px-6 md:px-12 lg:px-20">
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
                            Welcome to our premium collection of handcrafted home mandirs. We
                            specialize in bringing traditional craftsmanship into modern homes.
                            Every temple we create reflects purity, devotion, and elegant design.
                        </p>


                        <p className="text-gray-700 leading-relaxed text-lg">
                            Our mission is to provide beautifully designed mandirs that
                            harmonize spirituality with modern home aesthetics. We ensure
                            top-quality materials, expert craftsmanship, and timeless designs
                            suitable for every household.
                        </p>


                        <p className="text-gray-700 leading-relaxed text-lg">
                            This space will later include the official content provided by your
                            client. Feel free to share the real text when you receive it, and I
                            will update the entire design accordingly.
                        </p>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default AboutUs
