import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import toast from 'react-hot-toast';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; 

const EditUserDetails = ({onClose, user}) => {
  
  const [data, setData] = useState({
    name:user?.name,
    profile_pic:user?.profile_pic
  });
  
  // to create a reference to a DOM element that doesn't cause re-renders
  const uploadPhotoRef = useRef();

  const dispatch = useDispatch();

  // pri talks
  useEffect(()=>{
    setData((prev)=>{
      return{
        ...prev,
        ...user
      }
    })
  },[user])

  const handleOnChange = (e)=>{
    const{name, value} = e.target;
    setData((prev)=>{
      return{
        ...prev,  
        [name]:value
      }
    })
  }

  const handleOpenUploadPhoto = (e)=>{
    e.preventDefault();
    // e.stopPropagation();
    uploadPhotoRef.current.click();
  }

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0];

    // Uploading to cloudinary
    const uploadPhoto = await uploadFile(file);

    setData((prev)=>{
      return{
        ...prev,
        profile_pic:uploadPhoto?.url
        }
      })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    e.stopPropagation();

    try{
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method:"post",
        url:URL,
        data:data,
        withCredentials:true
      });
      
      toast.success(response.data.message);
      console.log("res of user details :" , response);

      if(response.data.success){
        dispatch(setUser(response.data.data));
        onClose();
      }

    }
    catch(err){
      toast.error(err?.response?.data?.message);
    }

  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      
      <div className="bg-white p-5 py-6 rounded m-1 w-full max-w-sm">
        
        <h2 className="font-semibold">Profile Details</h2>
        
        <p className="text-sm">Edit User Details</p>
        
        <form className="mt-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input type="text" name="name" id="name" value={data.name} 
            onChange={handleOnChange} className="w-full py-1 px-2 focus:outline-primary border-1 "></input>
          </div>

          <div>
            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avatar width={40} height={40} imageUrl={data.profile_pic} ></Avatar>
              
              <label htmlFor='profile_pic'>
              <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
              <input type="file" id="profile_pic" className='hidden' ref={uploadPhotoRef} onChange={handleUploadPhoto}></input>
              </label>
            </div>

          </div>
          
          <Divider></Divider>
          <div className='w-fit ml-auto flex gap-2 mt-2'>
            <button onClick={onClose} className='border border-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
            <button onClick={handleSubmit} className='border border-primary bg-primary text-white px-4 py-1 rounded hover:bg-secondary'>Save</button>
          </div>

        </form>

      </div>

    </div>
  )
}

// export default React.memo(EditUserDetails)
export default EditUserDetails
