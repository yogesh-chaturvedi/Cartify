import React from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react';

const AdminProtectedRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Loading...</p>;

    return (user !== null && user?.role === "admin" ? (<Outlet />) : (<Navigate to="/login" />));
}

export default AdminProtectedRoutes