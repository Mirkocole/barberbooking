import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null);
export default function AuthContextProvider({children}) {

    const [admin,setAdmin] = useState({});

    const value = {
        admin,
        setAdmin
    }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
