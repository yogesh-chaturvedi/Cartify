import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/user/Home'
import About from './pages/user/AboutUs'
import Contact from './pages/user/Contact'
import Collections from './pages/user/Collections'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Reset from './pages/Auth/Reset'
import Product from './pages/user/Product'
import DashboardHome from './pages/dashboard/DashboardHome'
import AllProducts from './pages/dashboard/AllProducts'
import Orders from './pages/dashboard/Orders'
import User from './pages/dashboard/User'
import Cart from './pages/user/Cart'
import AddProducts from './pages/dashboard/AddProducts'
import AdminProtectedRoutes from './components/protectedRoutes/AdminProtectedRoutes'
import UserProtectedRoutes from './components/protectedRoutes/UserProtectedRoutes'
import Profile from './pages/user/Profile'
import Settings from './pages/dashboard/Settings'
import CheckOut from './pages/user/CheckOut'
import OrderDetails from './pages/dashboard/OrderDetails'
import MyOrders from './pages/user/MyOrders'
import PaymentSuccess from './pages/user/PaymentSuccess'
import Cancel from './pages/user/Cancel'


function App() {

  return (
    <Routes>

      {/* globall routes */}
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/collection' element={<Collections />} />
      <Route path='/product/:id' element={<Product />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/password-reset' element={<Reset />} />
      <Route path='/profile' element={<Profile />} />

      {/* Amdin protected routes */}
      <Route element={<AdminProtectedRoutes />}>
        <Route path='/dashboard' element={<DashboardHome />} />
        <Route path='/dashboard/products' element={<AllProducts />} />
        <Route path='/dashboard/products/new' element={<AddProducts />} />
        <Route path='/dashboard/edit-products/:productId' element={<AddProducts />} />
        <Route path='/dashboard/orders' element={<Orders />} />
        <Route path='/dashboard/orders/:orderId' element={<OrderDetails />} />
        <Route path='/dashboard/users' element={<User />} />
        <Route path='/dashboard/settings' element={<Settings />} />
      </Route>

      {/* user's protected routes */}
      <Route element={<UserProtectedRoutes />}>
        <Route path='/cart' element={<Cart />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/checkout' element={<CheckOut />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/cancel' element={<Cancel />} />
      </Route>

    </Routes>
  )
}

export default App
