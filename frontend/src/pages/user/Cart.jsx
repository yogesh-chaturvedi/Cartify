import React, { useContext } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CartContext } from '../../context/CartContext'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const { fetchCart, cart, setCart } = useContext(CartContext)

    const navigate = useNavigate()
    // to remove product from cart
    async function handleRemove(productId, itemSize) {
        try {
            const response = await axios({
                method: 'delete',
                url: `${import.meta.env.VITE_BASE_URL}/cart/removeItem/${productId}`,
                data: { itemSize },
                withCredentials: true
            })
            const { message, success, userCart } = response.data;
            if (success) {
                fetchCart();
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
            console.error('handleRemove', error)
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
    }

    async function handleQuantity(productId, itemSize, action) {
        try {
            const response = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_BASE_URL}/cart/handleQuantity/${productId}`,
                data: { itemSize, action },
                withCredentials: true
            })
            const { message, success, userCart } = response.data;
            if (success) {
                setCart(userCart)
            }
        }
        catch (error) {
            console.error('handleQuantity', error)
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
    }

    console.log("cart", cart)
    function handleCheckout() {
        if (cart.items.length === 0) {
            toast("You can not proceed with empty cart", {
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
        else {
            navigate('/checkout')
        }
    }

    return (
        <div>

            {/* <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" /> */}

            <Navbar />

            <div className="max-w-7xl mx-auto p-6">

                {/* ---------- Page Header ---------- */}
                <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

                    {/* ---------- Left Side: Cart Items ---------- */}
                    <div className="lg:col-span-2 space-y-4 h-[calc(100vh-145px)] overflow-y-auto">

                        {/* ---------- Single Cart Item ---------- */}
                        {cart?.items.length === 0 ? (<div className='text-3xl text-black font-bold'>You cart is empty </div>) : (cart?.items?.map((p, idx) => {
                            return (<div key={idx} className="flex gap-4 border rounded-xl p-4 shadow-sm">

                                {/* Thumbnail */}
                                <img
                                    src={p?.product?.mainImage?.url}
                                    alt="product-image"
                                    className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
                                />

                                {/* Product Details & Quantity */}
                                <div className="flex-1 flex flex-col justify-between">

                                    {/* Title & Description */}
                                    <div>
                                        <h2 className="text-lg font-semibold">{p.product.productTitle}</h2>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                            {p.product.productDescription}
                                        </p>
                                    </div>


                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-3">

                                        {/* size */}
                                        <div className="w-16 border rounded-lg overflow-hidden text-center shadow-sm">
                                            <div className="text-white bg-blue-600 font-semibold py-1">
                                                {p.size}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 ">
                                            <button
                                                onClick={() => handleQuantity(p.product._id, p.size, 'decrease')}
                                                className="px-3 py-1 border rounded-lg"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium">{p.quantity}</span>
                                            <button
                                                onClick={() => handleQuantity(p.product._id, p.size, 'increase')}
                                                className="px-3 py-1 border rounded-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                {/* Price & Remove Button */}
                                <div className="flex flex-col justify-between text-right">
                                    <p className="text-lg font-semibold">₹{p.product.productPrice}</p>
                                    <button
                                        onClick={() => handleRemove(p.product._id, p.size)}
                                        className="text-red-600 text-sm mt-2 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>

                            </div>
                            )
                        }))}

                    </div>

                    {/* ---------- Right Side: Summary ---------- */}
                    <div className="border rounded-xl p-6 shadow-sm h-fit sticky top-16">

                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-2 text-gray-700 mb-4">

                            {/* Subtotal */}
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{`₹${cart?.totalPrice || 0}`}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹100</span>
                            </div>

                            {/* Total (Subtotal + Shipping) */}
                            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>{`₹${(cart?.totalPrice || 0) + 100}`}</span>
                            </div>

                        </div>

                        {/* Checkout Button */}
                        <button onClick={() => { handleCheckout() }} className="w-full bg-blue-700 text-white py-3 rounded-xl 
                     hover:bg-blue-800 active:scale-95 transition">
                            Proceed to Checkout
                        </button>

                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Cart
