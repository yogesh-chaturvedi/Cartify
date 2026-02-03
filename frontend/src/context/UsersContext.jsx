import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";

export const UsersContext = createContext();

export const UsersContextProvider = (props) => {

    const [allUsers, setAllUsers] = useState([]);
    const { verifyUser, user, setUser, loading } = useContext(AuthContext)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;

    // fetch all users 
    async function fetchUsers({
        page = 1,
        status = "user",
        sort = "date-new",
        search = ""
    }) {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/users/fetch`,
                params: { page, limit, status, sort, search },
                withCredentials: true
            })

            const { message, success, users, pagination } = resposne.data;
            if (success) {
                setAllUsers(users)
                setPage(pagination.currentPage)
                setTotalPages(pagination.totalPages)
                setTotalUsers(pagination.totalUsers)
            }
        }
        catch (error) {
            console.error('fetchUsers error', error)
        }
    }

    useEffect(() => {
        if (loading || !user) return
        if (user.role !== "admin") return
        fetchUsers({ page: 1 })
    }, [user, loading])


    const value = { fetchUsers, allUsers, setAllUsers, page, setPage, totalPages, totalUsers };

    return (
        <UsersContext.Provider value={value}>
            {props.children}
        </UsersContext.Provider>
    )
}