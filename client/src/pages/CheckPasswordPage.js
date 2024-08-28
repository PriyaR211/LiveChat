import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import {PiPassword, PiUserCircle} from "react-icons/pi";

// axios for http request like get, post
import axios from "axios";
//toast for pop up messages
import toast from "react-hot-toast";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';


function CheckPasswordPage() {
  const[data, setData] = useState({
    password:""
  })

  const navigate = useNavigate();
  // contains all details of respective api sent by prev api
  const location = useLocation();
  console.log("location details : " , location);

  // 
  const dispatch = useDispatch();

  const handleOnChange = (e)=>{
    const{name, value} = e.target;
    setData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })

  }

  // To avoid direct entry into /password
  useEffect(()=>{
    if(!location.state?.name){
      navigate("/email");
    }
  })


  const handleSubmit = async(e)=>{
    e.preventDefault();
    
    // sending req to backend server 
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
    // const URL = `http://localhost:8080/api/password`    
    try{
      // const response = await axios.post(URL, data);
      const response = await axios({
        method:"post",
        url:URL,
        data:{
          // to get details send these input
          userId:location?.state?._id,
          password:data.password
        },
        withCredentials:true  // send/forward with cookies

      });
      console.log("response from axios req: " , response);
      toast.success(response.data.message);
      if(response.data.success){
        // 
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        console.log("token set in local storage : ", response?.data?.token)

        setData({
          password:""
        })
        navigate('/');
      }
    }
    catch(err){
      toast.error(err?.response?.data?.message);
      console.log("error : " , err);
    }
    
  }


  return (
    <div className="mt-5">
      
      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto ">
      
      <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
        {/* <PiUserCircle size={80}></PiUserCircle> */}
        <Avatar width={70} height={70} name={location?.state?.name} imageUrl={location?.state?.profile_pic} ></Avatar>
        <h2 className="font-semibold text-lg mt-1">{location?.state?.name}</h2>
      </div>
        
      <h3>Welcome to Chat App!</h3>
      
      <form className='mt-3 grid gap-4' onSubmit={handleSubmit}>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" placeholder="enter your name" 
          className="bg-slate-200 px-2 py-1 focus:outline-primary"
          value={data.password} onChange={handleOnChange}  required/>
        </div>
            
        <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary leading-relaxed tracking-wide font-bold text-white">Let's Go</button>    
      
      </form>

      <p className="my-3 text-center"> <Link to={"/forgot-password"} className="hover:text-primary font-semibold">Forgot Password?</Link> </p>
      
      </div>

    </div>
  )
}

export default CheckPasswordPage;
