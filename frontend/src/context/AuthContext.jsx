import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)


    // to verify user 
    async function verifyUser() {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/auth/verify`,
                withCredentials: true
            })

            const { message, success, userData } = resposne.data;
            if (success) {
                setUser(userData)
            }
        }
        catch (error) {
            console.error('getAllUsers error', error)
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        verifyUser()
    }, [])


    const value = { verifyUser, user, setUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}