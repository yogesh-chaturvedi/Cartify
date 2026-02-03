import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar'
import { ProductContext } from '../../context/ProductsContext'
import { UsersContext } from '../../context/UsersContext'
import { OrdersContext } from '../../context/OrdersContext'


const DashboardHome = () => {

    const { allProducts } = useContext(ProductContext)
    const { allUsers } = useContext(UsersContext)
    const { allOrders } = useContext(OrdersContext)

    const topTwoOrders = allOrders.slice(0, 2);

    const usersOnly = allUsers.filter((user) => user.role !== "admin")
    const topTwoUsers = usersOnly.slice(0, 2);

    const PaidOrders = allOrders.filter((order) => order.paymentStatus === "PAID")

    // calculate total price for only paid products 
    const totalRevenue = PaidOrders.reduce(
        (total, item) => total + item.totalAmount,
        0
    );

    return (

        <div className='flex '>
            <Sidebar />
            <div className=' w-full'>
                <div className="p-6 space-y-8">

                    {/* PAGE TITLE */}
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h1>

                    {/* ---- TOP CARDS ---- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="bg-white p-6 rounded-xl shadow border">
                            <h2 className="text-gray-600">Total Products</h2>
                            <p className="text-3xl font-bold mt-2">{allProducts.length}</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow border">
                            <h2 className="text-gray-600">Total Orders</h2>
                            <p className="text-3xl font-bold mt-2">{allOrders.length}</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow border">
                            <h2 className="text-gray-600">Total Users</h2>
                            <p className="text-3xl font-bold mt-2">{allUsers?.length}</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow border">
                            <h2 className="text-gray-600">Revenue</h2>
                            <p className="text-3xl font-bold mt-2">{`₹${totalRevenue}`}</p>
                        </div>

                    </div>

                    {/* ---- RECENT ORDERS ---- */}
                    <div className="bg-white p-6 rounded-xl shadow border">
                        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Order ID</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {topTwoOrders.map((orders, index) => {
                                    return (<tr key={index} className="border-b">
                                        <td className="py-2">{orders._id}</td>
                                        <td>{orders.user.name}</td>
                                        <td>{`₹${orders.totalAmount}`}</td>
                                        <td>{orders.orderStatus}</td>
                                        <td>{new Date(orders.createdAt).toLocaleDateString()}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ---- RECENT USERS ---- */}
                    <div className="bg-white p-6 rounded-xl shadow border">
                        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>

                        <div className="space-y-3 text-gray-700">
                            {topTwoUsers.map((user, index) => {
                                return (<p key={index}>{`${user.name} — ${user.email}`}</p>)
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default DashboardHome
