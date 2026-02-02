import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Landmark, UploadCloud, HandCoins, ShieldCheck } from "lucide-react";

const Services = () => {

    const services = [
        {
            title: "Explore Sacred Temples",
            description:
                "Discover verified temples with complete details, history, location, and spiritual significance.",
            icon: Landmark,
        },
        {
            title: "List Your Temple",
            description:
                "Temple owners can register and showcase their temples to reach devotees across the platform.",
            icon: UploadCloud,
        },
        {
            title: "Book & Contribute",
            description:
                "Easily book pujas, rituals, or make secure donations directly to your chosen temple.",
            icon: HandCoins,
        },
        {
            title: "Secure & Trusted Platform",
            description:
                "All temples are verified and payments are secured to ensure trust and transparency.",
            icon: ShieldCheck,
        },
    ];
    return (
        <div>
            <Navbar />
            <section className="h-[calc(100vh-64px)] py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">
                            Our Services
                        </h2>
                        <p className="text-gray-900 mt-3 max-w-2xl mx-auto">
                            aspect.cnc connects devotees and temple owners on a single trusted
                            platform for discovery, contribution, and spiritual engagement.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gray-300 border border-gray-500 rounded-2xl p-6 text-center hover:border-blue-500 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-blue-600/20 mb-5">
                                        <Icon className="text-blue-500" size={28} />
                                    </div>

                                    <h3 className="text-lg font-semibold text-black mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-900 text-sm">
                                        {service.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Services
