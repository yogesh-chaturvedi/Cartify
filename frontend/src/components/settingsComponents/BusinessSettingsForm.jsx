import React, { useContext } from 'react'
import { Settings as SettingsIcon, Store, ShoppingBag, ShieldCheck, Save } from "lucide-react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { SettingsContext } from '../../context/SettingsContext';
import { useEffect } from 'react';

const BusinessSettingsForm = () => {

    const { fetchSettings, settings, setSettings } = useContext(SettingsContext)
    console.log("settings", settings)

    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            brandName: '',
            supportEmail: '',
            phoneNumber: '',
            whatsappNumber: '',
            address: '',
            instagram: '',
            facebook: '',
            website: '',
        }
    });

    // update form when settings load
    useEffect(() => {
        if (settings?.[0]?.business) {
            const businessData = settings[0].business;

            // Single reset() call with ALL fields
            reset({
                brandName: businessData.brandName || '',
                supportEmail: businessData.supportEmail || '',
                phoneNumber: businessData.phoneNumber || '',
                whatsappNumber: businessData.whatsappNumber || '',
                address: businessData.address || '',
                instagram: businessData.socialLinks?.instagram || '',
                facebook: businessData.socialLinks?.facebook || '',
                website: businessData.website || '',
            });
        }
    }, [settings, reset]);


    async function onSubmit(data) {
        setLoading(true)
        try {
            const resposne = await axios({
                method: 'put',
                data: data,
                url: `${import.meta.env.VITE_BASE_URL}/settings/business`,
                withCredentials: true
            })

            const { message, success } = resposne.data;
            if (success) {
                console.log(message);
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
            console.error('BusinessSettingsForm error', error)
            const message = error.response?.data?.message
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
            setLoading(false)
        }
    }

    return (
        <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="flex items-center gap-3">
                <Store className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                    Temple / Business Information
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Brand Name */}
                <div>
                    <input
                        {...register("brandName", {
                            required: "Brand name is required",
                        })}
                        placeholder="Brand / Company Name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm  "
                    />
                    {errors.brandName && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.brandName.message}
                        </p>
                    )}
                </div>

                {/* Support Email */}
                <div>
                    <input
                        {...register("supportEmail", {
                            required: "Support email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email address",
                            },
                        })}
                        placeholder="Support Email"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm "
                    />
                    {errors.supportEmail && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.supportEmail.message}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <input
                        {...register("phoneNumber", {
                            required: "Phone number is required",
                            minLength: {
                                value: 10,
                                message: "Enter valid phone number",
                            },
                        })}
                        placeholder="Phone Number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm "
                    />
                    {errors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                {/* WhatsApp Number */}
                <div>
                    <input
                        {...register("whatsappNumber")}
                        placeholder="WhatsApp Number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm "
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <textarea
                        {...register("address")}
                        placeholder="Address"
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                </div>

                {/* Instagram */}
                <div>
                    <input
                        {...register("instagram")}
                        placeholder="Instagram URL"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm -2"
                    />
                </div>

                {/* Facebook */}
                <div>
                    <input
                        {...register("facebook")}
                        placeholder="Facebook URL"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm "
                    />
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                    <input
                        {...register("website")}
                        placeholder="Website URL"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm "
                    />
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-blue-600 px-5 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? (<span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>) : ('Save Business Info')}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default BusinessSettingsForm
