import React, { Children } from 'react'
import logo from "../assets/logo.png"

const AuthLayouts = ({children}) => {
  return (
    <>
      <div className='flex justify-center items-center py-4 h-20 shadow-md bg-white'>
        
        <img src={logo} alt='logo' height={60} width={180}></img>

      </div>
      
      {children}
    
    </>
  )
}

export default AuthLayouts
