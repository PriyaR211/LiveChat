import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import {PiUserCircle} from "react-icons/pi";

// axios for http request like get, post
import axios from "axios";
//toast for pop up messages
import toast from "react-hot-toast";
import Avatar from '../components/Avatar';


function CheckEmailPage() {
  const[data, setData] = useState({
    email:""
  })

  const navigate = useNavigate();

  const handleOnChange = (e)=>{
    const{name, value} = e.target;
    setData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })

  }


  const handleSubmit = async(e)=>{
    e.preventDefault();
    
    // sending req to backend server 
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`
    // const URL = `http://localhost:8080/api/email`    
    try{
      const response = await axios.post(URL, data);
      console.log("response" , response);
      toast.success(response.data.message);
      if(response.data.success){
        setData({
          email:""
        })
        navigate('/password',{
          state:response?.data?.data, // send these data to /password 
        });
      }
    }
    catch(err){
      toast.error(err?.response?.data?.message);
      console.log("error : " , err);
    }
    
    console.log("from data submitted :", data);
  }


  return (
    <div className="mt-5">
      
      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto ">
      
      <div className="w-fit mx-auto mb-2">
        {/* <PiUserCircle size={80}></PiUserCircle> */}
        <Avatar width={70} height={70}></Avatar>
        
      </div>
        
      <h3>Welcome to Chat App!</h3>
      
      <form className='mt-3 grid gap-4' onSubmit={handleSubmit}>

        <div className='flex flex-col gap-1'>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" placeholder="enter your email" 
          className="bg-slate-200 px-2 py-1 focus:outline-primary"
          value={data.email} onChange={handleOnChange}  required/>
        </div>
            
        <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary leading-relaxed tracking-wide font-bold text-white">Login</button>    
      
      </form>

      <p className="my-3 text-center">New user? <Link to={"/register"} className="hover:text-primary font-semibold">Register</Link> </p>
      
      </div>

    </div>
  )
}

export default CheckEmailPage;
