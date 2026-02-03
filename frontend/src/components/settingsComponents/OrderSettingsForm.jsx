import React, { useContext, useState } from 'react'
import { Settings as SettingsIcon, Store, ShoppingBag, ShieldCheck, Save } from "lucide-react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { SettingsContext } from '../../context/SettingsContext';

const OrderSettingsForm = () => {

    const { settings } = useContext(SettingsContext)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            isOrderEnabled: "true",
            isCODEnabled: "true",
            autoConfirmOrders: "false",
            minOrderAmount: '',
        },
    });

    // Update form when settings load
    useEffect(() => {
        if (settings?.[0]?.order) {
            const orderData = settings[0].order;

            reset({
                isOrderEnabled: orderData.isOrderEnabled ?? true,
                isCODEnabled: orderData.isCODEnabled ?? true,
                autoConfirmOrders: orderData.autoConfirmOrders ?? false,
                minOrderAmount: orderData.minOrderAmount || '',
            });
        }
    }, [settings, reset]);


    async function onSubmit(data) {
        setLoading(true)
        const formattedData = {
            isOrderEnabled: data.isOrderEnabled === 'true',
            isCODEnabled: data.isCODEnabled === 'true',
            autoConfirmOrders: data.autoConfirmOrders === 'true',
            minOrderAmount: Number(data.minOrderAmount),
        };

        try {
            const resposne = await axios({
                method: 'put',
                data: formattedData,
                url: `${import.meta.env.VITE_BASE_URL}/settings/orders`,
                withCredentials: true
            })

            const { message, success } = resposne.data;
            if (success) {
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
            console.error('orderSettingsForm error', error)
            const message = error.resposne?.data?.message
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
            <div className="flex items-center gap-3">
                <ShoppingBag className="text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                    Order Settings
                </h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>

                {/* Enable / Disable Orders */}
                <div>
                    <select  {...register("isOrderEnabled", {
                        required: "Order status is required",
                    })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40">
                        <option value="true">Enable Orders</option>
                        <option value="false">Disable Orders</option>
                    </select>
                </div>

                {/* Minimum Order Amount */}
                <div>
                    <input
                        type="number"
                        {...register("minOrderAmount", {
                            required: "Minimum order amount is required",
                        })}
                        placeholder="Minimum Order Amount"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                    {errors.minOrderAmount && (
                        <p className="text-xs text-red-500 mt-1">
                            {errors.minOrderAmount.message}
                        </p>
                    )}
                </div>

                {/* COD */}
                <div>
                    <select
                        {...register("isCODEnabled")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                        <option value="true">Cash on Delivery Enabled</option>
                        <option value="false">Cash on Delivery Disabled</option>
                    </select>
                </div>

                {/* Auto Confirm Orders */}
                <div>
                    <select
                        {...register("autoConfirmOrders")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                        <option value="true">Auto Confirm Orders</option>
                        <option value="false">Manual Order Approval</option>
                    </select>
                </div>


                <div className=" md:col-span-2 flex justify-end">
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className="rounded-lg flex items-center gap-2 bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Save size={18} />
                        {loading ? (<span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>) : ('Save Order Settings')}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default OrderSettingsForm
