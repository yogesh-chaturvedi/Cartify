import React from 'react'
import Sidebar from '../../components/Sidebar'
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { OrdersContext } from '../../context/OrdersContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {

    const { fetchOrders, allOrders, setAllOrders, page, setPage, totalPages, totalOrders } = useContext(OrdersContext)
    console.log("all orders", allOrders)
    const navigate = useNavigate();

    // Status Colors
    const statusColor = {
        Pending: "bg-yellow-100 text-yellow-700",
        Shipped: "bg-blue-100 text-blue-700",
        Delivered: "bg-green-100 text-green-700",
        Cancelled: "bg-red-100 text-red-700",
    };

    // to delete orders 
    async function handleDelete(orderId) {

        const remainingOrders = allOrders.filter((order) => order._id !== orderId)
        setAllOrders(remainingOrders)

        try {
            const resposne = await axios({
                method: 'delete',
                url: `${import.meta.env.VITE_BASE_URL}/orders/delete/${orderId}`,
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
            else {
                fetchOrders();
            }
        }
        catch (error) {
            console.error('handleDelete error', error)
            const message = error.response?.data?.error?.message;
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

    const [Filter, setFilter] = useState('All')
    const [SortBy, setSortBy] = useState('default')
    const [searchedQuery, setSearchedQuery] = useState('')

    function handleChange(e) {
        setFilter(e.target.value)
    }

    function handleSort(e) {
        setSortBy(e.target.value)
    }

    function handleSearch(e) {
        setSearchedQuery(e.target.value)
    }

    useEffect(() => {
        fetchOrders({
            page,
            status: Filter,
            sort: SortBy,
            search: searchedQuery
        })
    }, [Filter, SortBy, page])

    function handlePageChange(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <div className="w-full pt-6 px-6">
                {/* <h1 className="text-2xl font-semibold mb-6">Orders</h1> */}
                {/* FILTERS & SORTING & search bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white shadow rounded-lg">

                    {/* FILTER */}
                    <div className="flex flex-col">
                        <label className="font-medium text-sm mb-1">Filter by Status</label>
                        <select onChange={handleChange} className="border px-3 py-2 rounded-lg w-48">
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* search bar */}
                    <div className="flex w-full max-w-sm mt-5">
                        <input
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-l-xl px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <button
                            onClick={() => fetchOrders({
                                page: 1,
                                status: Filter,
                                sort: SortBy,
                                search: searchedQuery
                            })}
                            className="rounded-r-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                            Search
                        </button>
                    </div>

                    {/* SORT */}
                    <div className="flex flex-col">
                        <label className="font-medium text-sm mb-1">Sort Orders</label>
                        <select
                            onChange={handleSort}
                            className="border px-3 py-2 rounded-lg w-48"
                        >
                            <option value="default">Default</option>
                            <option value="amount-asc">Amount: Low → High</option>
                            <option value="amount-desc">Amount: High → Low</option>
                            <option value="date-new">Date: Newest First</option>
                            <option value="date-old">Date: Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* orders */}
                <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {allOrders.map((order) => (
                        <div
                            key={order._id}
                            className="w-full bg-white shadow rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                        >
                            {/* LEFT SIDE */}
                            <div className="space-y-1">
                                <p className="font-semibold text-lg">Order ID: {order._id}</p>
                                <p className="text-gray-700 text-sm">Customer: {order.user.name}</p>
                                <p className="text-gray-500 text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="font-medium text-blue-800">₹{order.totalAmount}</p>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="flex items-center gap-4">
                                {/* STATUS */}
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.orderStatus]}`}
                                >
                                    {order.orderStatus}
                                </span>

                                {/* ACTION BUTTONS */}
                                <button onClick={() => navigate(`/dashboard/orders/${order._id}`)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    View
                                </button>
                                <button onClick={() => { handleDelete(order._id) }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* buttons */}
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="font-medium">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Orders
