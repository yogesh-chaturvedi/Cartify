import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";

export const OrdersContext = createContext();

export const OrdersContextProvider = (props) => {

    const [allOrders, setAllOrders] = useState([]);
    const { verifyUser, user, setUser, loading } = useContext(AuthContext)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const limit = 10;

    // to fetch orders 
    async function fetchOrders({
        page = 1,
        status = "All",
        sort = "date-new",
        search = ""
    }) {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/orders/fetch`,
                params: { page, limit, status, sort, search },
                withCredentials: true
            })

            const { message, success, orders, pagination } = resposne.data;
            if (success) {
                console.log(message)
                setAllOrders(orders)
                setPage(pagination.currentPage)
                setTotalPages(pagination.totalPages)
                setTotalOrders(pagination.totalOrders)
            }
        }
        catch (error) {
            console.error('fetchOrders error', error)
        }
    }


    useEffect(() => {
        if (loading || !user) return
        if (user.role !== "admin") return
        fetchOrders({ page: 1 })

    }, [user, loading])


    const value = { fetchOrders, allOrders, setAllOrders, page, setPage, totalPages, totalOrders };

    return (
        <OrdersContext.Provider value={value}>
            {props.children}
        </OrdersContext.Provider>
    )
}