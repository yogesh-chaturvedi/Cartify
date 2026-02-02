import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const UserProtectedRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (<p className='text-4xl font-extrabold flex items-center justify-center'>Loading...</p>)
    }
    return (user !== null && user.role == "user" ? (<Outlet />) : (<Navigate to='/login' />))

}

export default UserProtectedRoutes