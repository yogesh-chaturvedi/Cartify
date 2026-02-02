import React from 'react'
import { assets } from '../assets/assets'
import AnchorLink, { } from 'react-anchor-link-smooth-scroll'

const Hero = () => {
    return (
        <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-blue-900 text-white">
            {/* Background Image */}
            <img
                src={assets.heroImage}
                alt="hero Image"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-start justify-center h-[80vh]">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                   Shop Smarter. Live Better.
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-xl">
                   Discover a seamless shopping experience powered by smart technology-curated products, secure payments, and lightning-fast delivery, all in one place.
                </p>
                <AnchorLink className='anchor-link' offset={50} href='#Collection'><button className="bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors">
                    Get Started
                </button></AnchorLink>
            </div>
        </section>
    )
}

export default Hero
