import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { UsersContext } from '../../context/UsersContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

const User = () => {

    const { fetchUsers, allUsers, setAllUsers, page, setPage, totalPages, totalUsers } = useContext(UsersContext)

    const [searchedUser, setsearchedUser] = useState('')
    const [Sortby, setSortby] = useState('')


    // to remove users 
    async function handleDelete(userId) {

        const remainingUsers = allUsers.filter((user) => user._id !== userId);
        setAllUsers(remainingUsers);

        try {
            const response = await axios({
                method: "delete",
                url: `${import.meta.env.VITE_BASE_URL}/users/deleteUser/${userId}`,
                withCredentials: true
            })
            const { message, success } = response.data;
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
                fetchUsers()
            }
        }
        catch (error) {
            console.error('handleDelete error', error);
        }
    }

    function handleSearch(e) {
        setsearchedUser(e.target.value)
    }
    function handleSortby(e) {
        setSortby(e.target.value)
    }

    function handlePageChange(newPage) {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)
    }


    useEffect(() => {
        setPage(1);
    }, [Sortby]);

    useEffect(() => {
        fetchUsers({
            page,
            status: "user",
            sort: Sortby,
            search: searchedUser
        });
    }, [page, Sortby]);

    return (
        <div className='flex'>
            <Sidebar />
            <div className="pt-6 px-6 w-full">

                {/* ---------- Header ---------- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white shadow rounded-lg">

                    {/* search bar */}
                    <div className="flex w-full max-w-sm mt-5">
                        <input
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-l-xl px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <button
                            onClick={() => fetchUsers({
                                page: 1,
                                status: "user",
                                sort: Sortby,
                                search: searchedUser
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
                            onChange={handleSortby}
                            className="border px-3 py-2 rounded-lg w-48"
                        >
                            <option value="">Sort By</option>
                            <option value="name-asc">Name (A → Z)</option>
                            <option value="name-desc">Name (Z → A)</option>
                            <option value="newest">Newest Users</option>
                            <option value="oldest">Oldest Users</option>
                        </select>
                    </div>

                </div>

                {/* ---------- User List Container ---------- */}
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] no-scrollbar">

                    {/* ---------- User Card ---------- */}
                    {allUsers.map((user) => {
                        return (<div key={user._id} className="w-full p-4 border rounded-xl shadow-sm flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-lg">{user.name}</h2>
                                <p className="text-gray-600 text-sm">Email:{user.email}</p>
                                <p className="text-gray-600 text-sm">Role: {user.role}</p>
                                <p className="text-gray-600 text-sm">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            <button onClick={() => { handleDelete(user._id) }} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 
                                       active:scale-95 transition">
                                Delete
                            </button>
                        </div>)
                    })}

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

export default User
