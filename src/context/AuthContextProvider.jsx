import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null);
export default function AuthContextProvider({children}) {

    const [admin,setAdmin] = useState({});
    const token = localStorage.getItem('token');


    async function getProfile(){
      try {
        let res = await fetch(process.env.REACT_APP_URL_AUTH+'profile',{
          headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token}
        });
        if (res.ok) {
          let json = await res.json();
          
          if (json.feedback) {
            
            let countFeed = 0;
            json.feedback.forEach(el => {
              // console.log(el.value)
              countFeed += el.value;
            });
            let mediaFeed = countFeed / json.feedback.length;
            // console.log(mediaFeed)
            setAdmin({...json,valutation: mediaFeed});
            // console.log(admin)
          }else{

            setAdmin(json);
          }
          
        }
      } catch (error) {
        
      }
    }

    useEffect(()=>{
      
      if (token) {
        getProfile();
      }

    },[token])

    const value = {
        admin,
        setAdmin,
        getProfile
    }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
