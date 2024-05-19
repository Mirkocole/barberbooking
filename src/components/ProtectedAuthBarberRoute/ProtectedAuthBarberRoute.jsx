import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContextProvider'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAuthBarberRoute() {
    const {admin} = useContext(AuthContext);

  return admin.barber ? <Outlet /> : <Navigate to={'/'}/>
}
