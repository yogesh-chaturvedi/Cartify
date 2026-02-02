import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import OrderTimeLine from '../../components/OrderTimeLine'

const MyOrders = () => {

    const { verifyUser, user, setUser, loading } = useContext(AuthContext)
    const [userOrders, setUserOrders] = useState([])

    async function fetchUserOrder(userId) {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/orders/userOrder/${userId}`,
                withCredentials: true
            })
            const { message, success, orders } = response.data;
            if (success) {
                console.log(message);
                setUserOrders(orders)
            }
        }
        catch (error) {
            console.error('fetchUserOrder error', error)
        }
    }

    useEffect(() => {
        fetchUserOrder(user._id)
    }, [])
    console.log("userOrders", userOrders)



    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-6 py-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">My Orders</h2>

                    {loading ? (
                        <p className="text-center text-gray-500">
                            Loading orders...
                        </p>
                    ) : userOrders.length === 0 ? (
                        <p className="text-center text-gray-500">
                            You have not placed any orders yet.
                        </p>
                    ) : (
                        <div className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                            {userOrders?.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl shadow-md p-5 space-y-4"
                                >
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Order ID:{" "}
                                                <span className="font-medium">
                                                    {order._id}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Payment:{" "}
                                                <span className="font-medium text-green-600">
                                                    {order.isPaid === true ? "Done" : "Pending"}
                                                </span>
                                            </p>
                                        </div>

                                        <p className="text-lg font-bold text-gray-800">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    {/* ITEMS */}
                                    <div className="space-y-2">
                                        {order?.orderItems?.map((item) => (
                                            <div
                                                key={item.product._id}
                                                className="flex items-center gap-4 border-b pb-2"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* TIMELINE */}
                                    <OrderTimeLine order={order} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default MyOrders
