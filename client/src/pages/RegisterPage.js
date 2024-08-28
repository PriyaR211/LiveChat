import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';

// axios for http request like get, post
import axios from "axios";
//toast for pop up messages
import toast from "react-hot-toast";


function RegisterPage() {
  const[data, setData] = useState({
    name:"",
    email:"",
    password:"",
    profile_pic:""
  })

  const[uploadPhoto, setUploadPhoto] = useState("");
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

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0];

    // Uploading to cloudinary
    const uploadPhoto = await uploadFile(file);
    // console.log("upload photo" , uploadPhoto);

    setUploadPhoto(file);

    setData((prev)=>{
      return{
        ...prev,
        profile_pic:uploadPhoto?.url
        }
      })


  }

  const handleClearUploadPhoto = (e)=>{
    e.preventDefault();
    setUploadPhoto(null);
  }


  const handleSubmit = async(e)=>{
    e.preventDefault();
    
    // sending req to backend server 
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
    // const URL = `http://localhost:8080/api/register`    
    try{
      const response = await axios.post(URL, data);
      console.log("response" , response);
      toast.success(response.data.message);

      if(response.success){
        setData({
          name:"",
          email:"",
          password:"",
          profile_pic:""
        })
      }
      navigate("/email");
    }
    catch(err){
      toast.error(err?.response?.data?.message);
      console.log("error : " , err);
    }
    
    console.log(data);
  }


  return (
    <div className="mt-5">

      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto ">
        <h3>Welcome to Chat App!</h3>
      
      <form className='mt-4 grid gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" name="name" placeholder="enter your name" 
          className="bg-slate-200 px-2 py-1 focus:outline-primary"
          value={data.name} onChange={handleOnChange}  required/>
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" placeholder="enter your email" 
          className="bg-slate-200 px-2 py-1 focus:outline-primary"
          value={data.email} onChange={handleOnChange}  required/>
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" placeholder="enter your name" 
          className="bg-slate-200 px-2 py-1 focus:outline-primary"
          value={data.password} onChange={handleOnChange}  required/>
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="profile_pic">Photo:
            <div  className="bg-slate-200 h-14 flex justify-center items-center
             border rounded hover:border-primary cursor-pointer">

              <p className="text-sm max-w-[300]">
                {uploadPhoto?.name ? uploadPhoto.name : "Upload profile photo"}</p>
              {/* <p className="text-sm">Upload profile photo</p> */}
              
              {
                uploadPhoto?.name && <button className="text-lg ml-1 mt-1
                 hover:text-red-600" onClick={handleClearUploadPhoto}>
                <IoCloseSharp></IoCloseSharp></button>
              }
              
            </div>
          </label>

          <input id="profile_pic" type="file" name="profile_pic"
          className="bg-slate-200 px-2 py-1 focus:outline-primary hidden"
          onChange={handleUploadPhoto}/>

        </div>
            
        <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary leading-relaxed tracking-wide font-bold text-white">Register</button>    
      </form>

      <p className="my-3 text-center">Already have an account? <Link to={"/email"} className="hover:text-primary font-semibold">Login</Link> </p>
      
      </div>

    </div>
  )
}

export default RegisterPage
