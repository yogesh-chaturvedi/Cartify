import React, { useContext, useEffect, useState } from 'react'
// import Navbar from '../../components/Navbar'
// import Footer from '../../components/Footer'
import Sidebar from '../../components/Sidebar'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ProductContext } from '../../context/ProductsContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


const AllProducts = () => {

    const { fetchProducts, allProducts, setAllProducts, page, setPage, totalPages, totalOrders } = useContext(ProductContext);
    console.log("allProducts", allProducts)


    const [Filter, setFilter] = useState('All')
    const [SortBy, setSortBy] = useState('')
    const [searchedProduct, setSearchedProduct] = useState('')

    function handleFilter(e) {
        setFilter(e.target.value)
    }
    function handleSort(e) {
        setSortBy(e.target.value)
    }
    function handleSearch(e) {
        setSearchedProduct(e.target.value)
    }


    // to delete products 
    async function handleDelete(productId) {

        const remainingProducts = allProducts.filter((product) => product._id !== productId)
        setAllProducts(remainingProducts);

        try {
            const response = await axios({
                method: "delete",
                url: `${import.meta.env.VITE_BASE_URL}/product/deleteProduct/${productId}`,
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
                fetchProducts()
            }
        }
        catch (error) {
            console.error('handleDelete error', error);
        }
    }

    // to change page
    function handlePageChange(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage)
    }

    useEffect(() => {
        setPage(1);
    }, [Filter, SortBy]);

    useEffect(() => {
        fetchProducts({
            page,
            status: Filter,
            sort: SortBy,
            search: searchedProduct
        });
    }, [page, Filter, SortBy]);

    return (

        <div className='flex max-h-screen'>
            <Sidebar />
            <div className="w-full pt-6 px-6 ">
                {/* <h1 className="text-2xl font-semibold mb-6">Products</h1> */}

                {/* FILTERS & SORTING */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white shadow rounded-lg">

                    {/* FILTER */}
                    <div className="flex flex-col">
                        <label className="font-medium text-sm mb-1">Filter by category</label>
                        <select onChange={handleFilter} className="border px-3 py-2 rounded-lg w-48">
                            <option value="All">All</option>
                            <option value='Men'>Men</option>
                            <option value="Women">Women</option>
                            <option value="Kid">Kid</option>
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
                            onClick={() => fetchProducts({
                                page: 1,
                                status: Filter,
                                sort: SortBy,
                                search: searchedProduct
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

                <Link
                    to="/dashboard/products/new"
                    className="inline-block bg-blue-600 hover:bg-blue-700 mb-1 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
                >
                    Add Product
                </Link>

                {/* products  */}
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-265px)]">
                    {allProducts.map((product) => (
                        <div
                            key={product._id}
                            className="w-full flex items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                            {/* LEFT — IMAGE + DETAILS */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.mainImage.url}
                                    alt="product-Image"
                                    className="w-16 h-16 rounded object-cover border"
                                />

                                <div>
                                    <p className="font-semibold text-lg">{product.productTitle}</p>
                                    <p className="text-sm text-gray-600">₹{product.productPrice}</p>
                                    <p className="text-sm text-gray-500">{product.productMaterial}</p>
                                </div>
                            </div>

                            {/* RIGHT — ACTION BUTTONS */}
                            <div className="flex gap-3">
                                <Link to={`/dashboard/edit-products/${product._id}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    Edit
                                </Link>

                                <button onClick={() => { handleDelete(product._id) }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
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

export default AllProducts
