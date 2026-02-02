import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProductContextProvider } from './context/ProductsContext.jsx'
import { CartContextProvider } from './context/CartContext.jsx'
import { SettingsContextProvider } from './context/SettingsContext.jsx'
import { UsersContextProvider } from './context/UsersContext.jsx'
import { OrdersContextProvider } from './context/OrdersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ProductContextProvider>
          <UsersContextProvider>
            <CartContextProvider>
              <SettingsContextProvider>
                <OrdersContextProvider>
                  <App />
                </OrdersContextProvider>
              </SettingsContextProvider>
            </CartContextProvider>
          </UsersContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode >,
)
