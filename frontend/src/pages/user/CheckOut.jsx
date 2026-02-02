import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, ShoppingBag } from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckOut = () => {

    const { fetchCart, cart, setCart } = useContext(CartContext)

    const navigate = useNavigate();
    const location = useLocation()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()
    console.log("cart", cart)


    // to submit shipping info 
    async function onSubmit(data) {
        try {
            const response = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_BASE_URL}/payments/checkout`,
                data: {
                    shippingAddress: {
                        fullName: data.fullName,
                        phone: data.phone,
                        address1: data.address1,
                        address2: data.address2,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode,
                        country: data.country,
                    },
                    paymentMethod: data.paymentMethod
                },
                withCredentials: true
            })
            const { message, success } = response.data;

            // 👉 COD FLOW
            if (data.paymentMethod === "COD") {
                toast("Order placed successfully (COD)");
                navigate("/myorders");
                return;
            }

            // 👉 STRIPE CHECKOUT FLOW
            if (data.paymentMethod === "STRIPE") {
                // Stripe-hosted page
                window.location.href = response.data.url;
            }

        }
        catch (error) {
            console.error('shipping details error', error)
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
            reset();
        }
    };


    return (

        <div>

            <Navbar />

            {/* checkout page */}
            <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)] p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ================= LEFT: ADDRESS FORM ================= */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white rounded-2xl shadow-sm border p-6 space-y-5"
                >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="text-gray-700" /> Shipping Address
                    </h2>

                    {/* input fields */}
                    <div className="space-y-4">
                        <input
                            {...register("fullName", { required: true })}
                            placeholder="Full Name"
                            className="w-full border rounded-lg px-4 py-2"
                        />


                        <input
                            {...register("phone", { required: true })}
                            placeholder="Phone Number"
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <input
                            {...register("address1", { required: true })}
                            placeholder="Address Line 1"
                            className="w-full border rounded-lg px-4 py-2"
                        />


                        <input
                            {...register("address2")}
                            placeholder="Address Line 2 (Optional)"
                            className="w-full border rounded-lg px-4 py-2"
                        />


                        <div className="grid grid-cols-2 gap-4">
                            <input
                                {...register("city", { required: true })}
                                placeholder="City"
                                className="w-full border rounded-lg px-4 py-2"
                            />


                            <input
                                {...register("state", { required: true })}
                                placeholder="State"
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <input
                                {...register("pincode", { required: true })}
                                placeholder="Postal Code"
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                {...register("country", { required: true })}
                                placeholder="Country"
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>

                    {/* ================= PAYMENT METHOD ================= */}
                    <h2 className="text-xl font-semibold flex items-center gap-2 mt-6">
                        <CreditCard className="text-gray-700" /> Payment Method
                    </h2>

                    {/* payment methods */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="COD" {...register("paymentMethod", { required: true })} /> Cash on Delivery
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="STRIPE" {...register("paymentMethod", { required: true })} /> Stripe
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 rounded-xl mt-6"
                    >
                        Continue to Payment
                    </button>
                </form>

                {/* ================= RIGHT: ORDER SUMMARY ================= */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShoppingBag className="text-gray-700" /> Order Summary
                    </h2>


                    <div className="mt-6 space-y-4">
                        {cart?.items.map((item, index) => {
                            return (<div key={index} className="flex justify-between text-sm">
                                <span>{`${item.product.productTitle} × ${item.quantity}`}</span>
                                <span>{`₹${item.priceAtThatTime}`}</span>
                            </div>)
                        })}
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{`₹${cart?.totalPrice}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹100</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>{`₹${cart?.totalPrice + 100}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>

    )
}

export default CheckOut
