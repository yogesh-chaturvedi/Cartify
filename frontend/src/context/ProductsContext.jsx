import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const ProductContext = createContext()

export const ProductContextProvider = (props) => {

    const [allProducts, setAllProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const limit = 15;


    // to fetch all products user 
    async function fetchProducts({
        page = 1,
        status = "All",
        sort = "date-new",
        search = ""
    }) {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/product/fetch`,
                params: { page, status, sort, search, limit },
                withCredentials: true
            })

            const { message, success, products, pagination } = resposne.data;
            if (success) {
                console.log(message)
                setAllProducts(products)
                setTotalPages(pagination.totalPages)
                setTotalOrders(pagination.totalOrders)
            }
        }
        catch (error) {
            console.error('fetchProducts error', error)
        }
    }


    useEffect(() => {
        fetchProducts({ page: 1 })
    }, [])

    const value = { fetchProducts, allProducts, setAllProducts, page, setPage, totalPages, totalOrders }

    return (
        <ProductContext.Provider value={value}>
            {props.children}
        </ProductContext.Provider>
    )
}