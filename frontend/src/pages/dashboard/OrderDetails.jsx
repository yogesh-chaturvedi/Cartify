import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Package, User, MapPin, CreditCard, Truck, FileText } from "lucide-react";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import OrderTimeLine from '../../components/OrderTimeLine';


const OrderDetails = () => {

    // colors 
    const statusColor = {
        Pending: "bg-yellow-100 text-yellow-800",
        Confirmed: "bg-blue-100 text-blue-800",
        Shipped: "bg-purple-100 text-purple-800",
        Delivered: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    console.log('order view page', order)

    const [newStatus, setNewStatus] = useState('')

    const statusFlow = {
        Pending: ["Confirmed", "Cancelled"],
        Confirmed: ["Shipped", "Cancelled"],
        Shipped: ["Delivered"],
    };

    async function fetchOrder(orderId) {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/orders/fetchSingleOrder/${orderId}`,
                withCredentials: true
            })

            const { message, success, order } = resposne.data;
            if (success) {
                console.log(message)
                setOrder(order)
            }
        }
        catch (error) {
            console.error('fetchOrder error', error)
        }
    }

    useEffect(() => {
        fetchOrder(orderId);
    }, [orderId])

    // to set new status 
    async function setStatus() {
        try {
            const resposne = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_BASE_URL}/orders/changeOrderStatus/${orderId}`,
                data: { newStatus },
                withCredentials: true
            })

            const { message, success, order } = resposne.data;
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
                setOrder(order)
            }
        }
        catch (error) {
            console.error('setStatus error', error)
            const message = error.resposne?.data?.error?.message
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

    useEffect(() => {
        if (!newStatus || newStatus === order.orderStatus) {
            return
        }
        setStatus();
    }, [newStatus])


    if (!order) return <p className='text-4xl font-bold flex items-center justify-center'>Loading...</p>;

    return (
        <div className='flex'>
            <Sidebar />

            <div className="p-6 w-full space-y-4 max-h-screen overflow-y-auto">

                {/* ================= ORDER HEADER ================= */}
                <div className="bg-white p-5 rounded shadow flex justify-between items-center">

                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Package /> Order #{order._id}
                    </h2>

                    {/* HARD-CODED ORDER STATUS (ADMIN VIEW) */}
                    <span className={`px-4 py-2 rounded font-medium ${statusColor[order.orderStatus]}`}>
                        Status: {order.orderStatus}
                    </span>
                </div>

                {/* ================= ORDER TIMELINE (STATIC) ================= */}
                <OrderTimeLine order={order} />

                {/* ================= CUSTOMER DETAILS ================= */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="font-semibold flex items-center gap-2">
                        <User /> Customer Details
                    </h3>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p className="flex items-center gap-1">
                        <MapPin size={16} />
                        {order.shippingAddress.address1}, {order.shippingAddress.city}
                    </p>
                </div>

                {/* ================= ORDER ITEMS ================= */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="font-semibold mb-4">Order Items</h3>

                    {order.orderItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 border-b py-3"
                        >
                            <img
                                src={item.image}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p>₹{item.subtotal}</p>
                        </div>
                    ))}
                </div>

                {/* ================= PAYMENT SUMMARY ================= */}
                <div className="bg-white p-5 rounded shadow">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard /> Payment Summary
                    </h3>
                    <p>Items: ₹{order.itemsPrice}</p>
                    <p>Shipping: ₹{order.shippingPrice}</p>
                    <p className="font-bold">
                        Total: ₹{order.totalAmount}
                    </p>
                    <p>Payment Method: {order.paymentMethod}</p>

                    {/* HARD-CODED PAYMENT STATUS */}
                    <p className="mt-2 text-green-600 font-medium">Payment Status: {order.paymentMethod === 'COD' ? 'Payment pending' : 'Paid'}</p>

                </div>

                <div className="bg-white p-5 rounded shadow">
                    {/* dropdown */}
                    <select
                        value={order.orderStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full max-w-xs px-4 py-2
    rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                    >
                        <option value={order.orderStatus} disabled>
                            Current: {order.orderStatus}
                        </option>

                        {statusFlow[order.orderStatus]?.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    {/* order history */}
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Status History
                        </h3>

                        <ul className="space-y-2">
                            {order.orderHistory.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="text-xs text-gray-600 flex justify-between"
                                    >
                                        <span>
                                            {item.from} → <strong>{item.to}</strong>
                                        </span>
                                        <span>
                                            {new Date(item.changedAt).toLocaleString()}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderDetails