import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CollectionsComp from '../../components/CollectionsComp'
import { ProductContext } from '../../context/ProductsContext'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Collections = () => {

    const { fetchProducts, allProducts, setAllProducts, page, setPage, totalPages, totalOrders } = useContext(ProductContext)

    const [topFeatures, settopFeatures] = useState(false)

    const debounceRef = useRef();

    // to scroll at top when component mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [Filter, setFilter] = useState('')

    const [SortBy, setSortBy] = useState('');

    const [searchedProduct, setSearchedProduct] = useState('');

    function handleSort(e) {
        setSortBy(e.target.value)
    }

    function handleFilter(e) {
        setFilter(e.target.value)
    }

    function handleSearch(e) {
        setSearchedProduct(e.target.value)
    }

    function handlePageChange(newPage) {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)
    }

    useEffect(() => {
        setPage(1);
    }, [Filter, SortBy])


    //  debounce to prevent multiple api calls
    useEffect(() => {

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchProducts({
                page,
                status: Filter,
                sort: SortBy,
                search: searchedProduct
            })
        }, 500);

    }, [page, Filter, SortBy])


    return (
        <div>
            <Navbar />

            <section className="w-full flex relative flex-col min-h-[calc(100vh-64px)] bg-white py-2 mb:py-12 px-6 md:px-12 lg:px-20">

                {/* FILTER, SEARCH-BAR, SORTING */}
                <div className="flex flex-col sticky top-16 z-30 md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white shadow rounded-lg">

                    {/* FILTER */}
                    <div className={`flex flex-col ${topFeatures ? 'block' : 'hidden'} md:block`}>
                        <label className="font-medium text-sm mb-1">Filter by category</label>
                        <select onChange={handleFilter} className="border px-3 py-2 rounded-lg w-48">
                            <option value="All">All</option>
                            <option value='Men'>Men</option>
                            <option value="Women">Women</option>
                            <option value="Kid">Kid</option>
                        </select>
                    </div>

                    {/* SORT */}
                    <div className={`flex flex-col ${topFeatures ? 'block' : 'hidden'} md:block`}>
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

                    {/* Search Bar and dropdown button*/}
                    <div className='flex'>
                        {/* Search Bar */}
                        <div className="flex w-full max-w-sm mt-5 mr-10">
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

                        {/* dropdown button  */}
                        <button
                            onClick={() => { settopFeatures(prev => !prev) }}
                            className="absolute bottom-4 right-0 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition md:hidden flex" >
                            {topFeatures ? < ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                </div>

                {/* ---------------- RIGHT SIDE – COLLECTION GRID ---------------- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 text-blue-900">
                        Our Collection
                    </h2>

                    <CollectionsComp products={allProducts} />

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

            </section >

            <Footer />
        </div >
    )
}

export default Collections
