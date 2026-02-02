import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { SettingsContext } from '../../context/SettingsContext'

const Contact = () => {

    // const [loading, setLoading] = useState(false)

    const { fetchSettings, settings, setSettings } = useContext(SettingsContext)

    const [Result, setResult] = useState("")
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()


    // // submit function 
    // async function onSubmit(data) {

    //     try {
    //         setLoading(true);
    //         const response = await axios({
    //             method: 'post',
    //             url: `${import.meta.env.VITE_BASE_URL}/contact/send`,
    //             data: data,
    //             withCredentials: true
    //         })
    //         const { message, success } = response.data;
    //         if (success) {
    //             console.log(message)
    //             toast(message, {
    //                 position: "top-center",
    //                 autoClose: 1500,
    //                 hideProgressBar: false,
    //                 closeOnClick: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "dark",
    //             });
    //         }
    //     }
    //     catch (error) {
    //         console.error('error', error);

    //         const message = error.response?.data?.message
    //         toast(message, {
    //             position: "top-center",
    //             autoClose: 1500,
    //             hideProgressBar: false,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "dark",
    //         });
    //     }
    //     finally {
    //         reset();
    //         setLoading(false)
    //     }
    // }

    const onSubmit = async (data) => {
        setResult("Sending....");

        // Create form data
        const formData = new FormData();
        formData.append("access_key", "125c2463-db82-4644-99f9-2b8b70145dca");
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("message", data.message);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                setResult("Form Submitted Successfully");
                toast.success("Form submitted successfully!");
                reset(); // reset the form
            } else {
                setResult("Error submitting form");
                toast.error("Error submitting form");
            }
        } catch (error) {
            console.error(error);
            setResult("Error submitting form");
            toast.error("Error submitting form");
        }
    };


    return (

        <div>
            {/* <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />*/}
            <Navbar />

            <section className="w-full h-[calc(100vh-64px)] bg-white py-16 px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* LEFT SIDE – COMPANY INFO */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>


                        <p className="text-gray-700 text-lg leading-relaxed">
                            We’d love to hear from you. Whether you have a question about our
                            handcrafted home mandirs, pricing, custom designs, or anything else —
                            our team is always ready to help.
                        </p>


                        <div className="space-y-3">
                            <p className="text-gray-800 text-lg"><strong>Email:</strong> {settings?.[0]?.business?.supportEmail}</p>
                            <p className="text-gray-800 text-lg"><strong>Phone:</strong> {settings?.[0]?.business?.phoneNumber}</p>
                            <p className="text-gray-800 text-lg"><strong>Address:</strong> {settings?.[0]?.business?.address}</p>
                        </div>


                        <p className="text-gray-700 text-lg">
                            Feel free to reach out to us anytime, we usually respond within 24 hours.
                        </p>
                    </motion.div>


                    {/* RIGHT SIDE – CONTACT FORM */}
                    <motion.form
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-gray-50 p-8 rounded-2xl shadow-md space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* name */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-700 font-semibold">Full Name</label>
                            <input
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Full name must be at least 3 characters",
                                    },
                                })}
                                type="text"
                                placeholder="Enter your full name"
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-600"
                            />
                            {errors.fullName && (
                                <p className="text-red-400 text-sm">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* email */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-700 font-semibold">Email</label>
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
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-600"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* message */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-700 font-semibold">Message</label>
                            <textarea
                                {...register("message", {
                                    required: "Message is required",
                                    minLength: {
                                        value: 3,
                                        message: "Message must be at least 3 characters",
                                    },
                                })}
                                rows="5"
                                placeholder="Write your message here"
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-600 resize-none"
                            />
                            {errors.message && (
                                <p className="text-red-400 text-sm">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all`}
                        > {Result === "Sending...." ? "Sending..." : "Send Message"}</button>

                    </motion.form>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Contact
