import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContextProvider'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAuthRoute() {

    const {admin} = useContext(AuthContext);

  return admin._id ? <Outlet /> : <Navigate to={'/login'}/>
}
