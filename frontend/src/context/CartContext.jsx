import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";


export const CartContext = createContext()

export const CartContextProvider = (props) => {

    const [cart, setCart] = useState(null);
    const { loading, user } = useContext(AuthContext)

    // to fetch user's cart 
    async function fetchCart() {
        try {
            const resposne = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/cart/fetch`,
                withCredentials: true
            })

            const { message, success, userCart } = resposne.data;
            if (success) {
                setCart(userCart)
            }
        }
        catch (error) {
            console.error('fetchCart error', error)
        }
    }

    useEffect(() => {
        if (loading || !user || user.role !== "user") return
        fetchCart()
    }, [user, loading])

    const value = { fetchCart, cart, setCart };
    return (
        <CartContext.Provider value={value}>
            {props.children}
        </CartContext.Provider>
    )
}
