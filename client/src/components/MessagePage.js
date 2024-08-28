import React, { Profiler, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import Avatar from "./Avatar"
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loader from './Loader';
import bgImage from "../assets/wallpaper.jpeg"
import { MdSend } from "react-icons/md";

// for time display
import moment from "moment";

const MessagePage = () => {
  // retrieves the parameters from the current route
  const params = useParams();
  console.log("current user id : " + params.userId);

  // hook provided by react-redux that allows you to extract data from the Redux store state
  const socketConnection  = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);

  const[dataUser, setDataUser] = useState({
    name:"",
    email:"",
    profile_pic:"",
    online:false,
    _id:""
  })

  const[openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const[message, setMessage] = useState({
    text:"",
    imageUrl:"",
    videoUrl:""
  })

  const[loading, setLoading] = useState(false);
  const[allMessage, setAllMessage] = useState([]);
  // for displaying view just from msg
  const currentMessage = useRef();

  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page", params.userId);
      
      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data)=>{
        // console.log("user details for message page : " , data);
        setDataUser(data);
      })

      socketConnection.on("message", (data)=>{
        console.log("data received : " , data);
        setAllMessage(data);
      })

    }
  },[socketConnection, params?.userId, user])

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behaviour:'smooth', block:'end' });
    }
  },[allMessage])

  const handleOpenImageVideoUpload = ()=>{
    setOpenImageVideoUpload(prev=>{
      return !prev;
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0];

    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);

    setMessage((prev)=>{
      return{
        ...prev,
        imageUrl:uploadPhoto.url
      }
    })

  }

  const handleClearUploadImage = ()=>{
    setMessage((prev)=>{
      return{
        ...prev,
        imageUrl:""
      }
    })

  }

  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0];
    
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);

    setMessage((prev)=>{
      return{
        ...prev,
        videoUrl:uploadVideo.url
      }
    })

  }

  const handleClearUploadVideo = ()=>{
    setMessage((prev)=>{
      return{
        ...prev,
        videoUrl:""
      }
    })

  }

  // input message box
  const handleOnChange = (e)=>{
    const{name, value} = e.target;
    
    setMessage((prev)=>{
      return{
        ...prev,
        text:value
      }
    })
  }

  const handleSendMessage = (e)=>{
    e.preventDefault();

    // send message to server using socket
    if(message.text || message.videoUrl || message.imageUrl){
      if(socketConnection){
        socketConnection.emit("new message",{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          videoUrl : message.videoUrl,
          imageUrl : message.imageUrl,
          msgByUserId : user._id
        })

      

        setMessage({
          text:"",
          imageUrl:"",
          videoUrl:""
        })

      }
    }


  }

  return (
    <div style={ {backgroundImage:`url(${bgImage})`} } className="bg-cover bg-no-repeat" >
     <header className='h-16 bg-white sticky top-0 flex justify-between items-center px-4 '>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className="lg:hidden" ><FaAngleLeft size={23}></FaAngleLeft></Link>
          
          <div><Avatar width={50} height={50} name={dataUser.name} imageUrl={dataUser.profile_pic} userId={dataUser._id} ></Avatar></div>
          <div>
            <h3 className='text-lg font-semibold my-0 '>{dataUser.name}</h3>
            <p className='text-sm -my-2'>
              {dataUser.online? <span className='text-primary'>online</span> : <span className='text-slate-400 '>offline</span>}
            </p>
            </div>
        </div>
        
        <div>
          <button className='cursor-pointer hover:text-primary text-ellipsis line-clamp-1'>
            <HiDotsVertical></HiDotsVertical>
          </button>
        </div>

    </header>

     {/* Show different messages */}
    <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-300 bg-opacity-50' >
      
        {/* Show all messages */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage?.map((msg, indx)=>{
              return(
                <div  className={` p-1 w-fit rounded lg:max-w-md md:max-wd-sm max-w-[280px] ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}` }>
                  <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <img src={msg.imageUrl} className='w-full h-full object-scale-down' />
                      )
                    }
                  {/* </div> */}
                  {/* <div className='w-full'> */}
                    {
                      msg?.videoUrl && ( 
                        <video src={msg.videoUrl} className='w-full h-full object-scale-down' controls/>
                      )
                    }
                  </div>

                  <p className='px-2'>{msg.text}</p>
                  <p className='w-fit ml-auto text-xs'>{moment(msg.createdAt).format("hh:mm")}</p>
                </div>
              )
            })          
          }
        </div>

        
        {/* Uploaded image display */}
        {
          message.imageUrl && (
            <div className='sticky bottom-0 w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center'>
              <div className='absolute right-0 top-0 w-fit p-2 cursor-pointer hover:text-red-700' onClick={handleClearUploadImage }> <IoClose size={30}></IoClose> </div>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} width={300} height={300} alt="upload image" className="aspect-square h-full w-full max-w-sm m-2 object-scale-down" />
              </div>
            </div>
          )
        }

        {/* Uploaded video display */}
        {
          message.videoUrl && (
            <div className='sticky bottom-0 w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center'>
              <div className='absolute right-0 top-0 w-fit p-2 cursor-pointer hover:text-red-700' onClick={handleClearUploadVideo }> <IoClose size={30}></IoClose> </div>
              <div className='bg-white p-3'>
                <video src={message.videoUrl} height={300} width={300} className="aspect-square h-full w-full max-w-sm m-2 object-scale-down" controls muted autoPlay />
              </div>
            </div>
          )
        }

        {/* Loading icon display */}
        {
          loading && (
            <div className='sticky bottom-0 w-full h-full flex justify-center items-center' >
              <Loader></Loader>
            </div>
          )
        }


    </section>


    {/* send message */}
    <section className='h-16 bg-white px-4 flex items-center  '>
      
      <div className='relative'>
        <button onClick={handleOpenImageVideoUpload} className=" flex justify-center items-center hover:bg-primary hover:text-white rounded-full w-11 h-11" >
          <FaPlus size={25}></FaPlus>
        </button>

         {/* Video and image */}
        {
          openImageVideoUpload && (
            <div className='bg-white shadow absolute bottom-14 w-36 rounded p-2'>
              <form>

                <label htmlFor='uploadImage' className='flex items-center gap-3 p-2 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-primary'> <FaImage size={18}></FaImage> </div>
                  <p>Image</p>
                </label>

                <label htmlFor='uploadVideo' className='flex items-center gap-3 p-2 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-purple-500'> <FaVideo  size={18}></FaVideo> </div>
                  <p>Video</p>
                </label>    

                <input type='file' id='uploadImage' onChange={handleUploadImage} className='hidden' />
                <input type='file' id='uploadVideo' onChange={handleUploadVideo} className='hidden' />

              </form>
          </div>
          )

         }   
      </div>
      
      {/* Input message box */}
      <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
        <input type='text' placeholder='Type message here...' className='py-1 px-4 outline-none h-full w-full' 
          value={message.text} onChange={handleOnChange}
        />
        <button className='text-primary hover:text-secondary'><MdSend size={28}></MdSend></button>
      </form>


    </section>


    </div>
  )

}

export default MessagePage
