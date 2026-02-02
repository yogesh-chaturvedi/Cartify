import React, { use, useContext, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { User, Mail, Phone, MapPin, Edit, X, Camera } from "lucide-react";
import { AuthContext } from '../../context/AuthContext';
import { UsersContext } from '../../context/UsersContext';
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm()

    const { verifyUser, user, setUser, loading } = useContext(AuthContext)
    // const { fetchUsers, allUsers, setAllUsers } = useContext(UsersContext)

    const [isEditMode, setIsEditMode] = useState(false)

    const [preview, setPreview] = useState(null)

    const profileImage = watch('profileImage')

    const [isLoading, setIsLoading] = useState(false)

    function toggleModel() {
        if (isEditMode) {
            setIsEditMode(true)
        }
        else {
            setIsEditMode(true)
        }
    }

    function handleClose() {
        setIsEditMode(false)
    }

    function handleChangeImage(e) {
        const file = e.target.files[0]

        // setting up new field, without using new useState
        if (file) {
            setValue("profileImage", file)
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }


    async function onSubmit(data) {
        // e.preventDefault();

        setIsLoading(true)

        const formData = new FormData()

        formData.append('fullName', data.fullName)
        formData.append('newPassword', data.newPassword)
        formData.append('phoneNumber', data.phoneNumber)
        formData.append('country', data.country)

        // set image in form data 
        if (data.profileImage) {
            formData.append('profileImage', data.profileImage)
        }

        try {
            const response = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_BASE_URL}/users/edit-profile`,
                data: formData,
                withCredentials: true
            })
            const { message, success } = response.data;
            if (success) {
                console.log(message)
                verifyUser();
                setIsEditMode(false)
                toast(message, {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        catch (error) {
            console.error("edit profile error", error)

            const message = error.response?.data?.message;
            toast(message, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        finally {
            reset()
            setIsLoading(false)
        }
    }

    return (
        <div>
            {/* <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" /> */}

            <Navbar />

            <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4">

                {/* Main Profile Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center">
                            {user?.profileImage?.url ? (<img src={user.profileImage.url} alt="profile-image" className='w-28 h-28 rounded-full bg-gray-200' />) : (<User size={48} className="text-gray-500 w-28 h-28 rounded-full bg-gray-200" />)}
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            {user?.name}
                        </h2>
                        {/* <p className="text-sm text-gray-500">Frontend Developer</p> */}
                    </div>

                    {/* User Info */}
                    <div className="mt-6 space-y-4">

                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail size={18} className="text-green-600" />
                            <span className="text-sm">{user?.email}</span>
                        </div>

                        {/* thinking about them later */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone size={18} className="text-green-600" />
                            <span className="text-sm">{user?.phoneNumber || "Add phone number"}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin size={18} className="text-green-600" />
                            <span className="text-sm">{user?.country || "Add your country"}</span>
                        </div>

                    </div>

                    {/* Edit Button */}
                    <button onClick={() => { toggleModel() }} className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                        <Edit size={18} />
                        Edit Profile
                    </button>

                </div>

                {/* ================= Popup Modal ================= */}
                {isEditMode ? (<div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">

                    {/* Modal Box */}
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Edit Profile
                            </h3>

                            <button
                                onClick={() => { handleClose() }}
                                type="button"
                                className="rounded-full p-1 hover:bg-gray-200 transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* FORM START */}
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>

                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center gap-3">

                                {/* Image Preview */}
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {preview ? (<img
                                            src={preview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />) : user.profileImage?.url ? (<img
                                            src={user.profileImage.url}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />) : (<User size={48} className="text-gray-500" />)
                                        }
                                    </div>

                                    {/* Upload Button */}
                                    <label className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition">
                                        <Camera size={16} className="text-white" />
                                        <input onChange={handleChangeImage} type="file" accept="image/*" className="hidden" />
                                    </label>
                                </div>

                                <p className="text-xs text-gray-500">
                                    Click camera icon to change photo
                                </p>

                            </div>

                            {/* Inputs */}

                            {/* name */}
                            <input
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Full name must be at least 3 characters",
                                    },
                                })}
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Full Name"
                            />
                            {errors.fullName && (
                                <p className="text-red-400 text-sm">{errors.fullName.message}</p>
                            )}

                            {/* email */}
                            <input
                                value={user.email}
                                disabled
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />


                            {/* password */}
                            <input
                                {...register("newPassword", {
                                    required: "New Password required",
                                    minLength: {
                                        value: 5,
                                        message: "Password must be at least 5 digits",
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: "Password can not contain more than 12 digits"
                                    }
                                })}
                                type="password"
                                placeholder="Enter New Password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.newPassword && (
                                <p className="text-red-400 text-sm">{errors.newPassword.message}</p>
                            )}


                            {/* phone number */}
                            <input
                                {...register("phoneNumber", {
                                    required: "Phone number required",
                                    minLength: {
                                        value: 10,
                                        message: "Phone number must be at least 10 digits",
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Phone number must be at least 10 digits"
                                    }
                                })}
                                type="text"
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-400 text-sm">{errors.phoneNumber.message}</p>
                            )}

                            {/* Country */}
                            <input
                                {...register("country", {
                                    required: "Country name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Country name must be at least 3 characters",
                                    },
                                })}
                                type="text"
                                placeholder="Country"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.country && (
                                <p className="text-red-400 text-sm">{errors.country.message}</p>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    className="w-full py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-2 rounded-xl bg-green-600 text-white transition flex items-center justify-center
                                ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"}
                                `}
                                >
                                    {isLoading ? (
                                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                            </div>

                        </form>
                        {/* FORM END */}

                    </div>

                </div>) : ('')}

            </div>

            <Footer />
        </div>
    )
}

export default Profile
