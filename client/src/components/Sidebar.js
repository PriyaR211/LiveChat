import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar"
import {useDispatch, useSelector} from "react-redux"
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';


const Sidebar = () => {
  //extract data from the Redux store's state.
  const user = useSelector(state=>state?.user)
  console.log("sidebar user details: ", user);

  const[editUserOpen, setEditUserOpen] = useState(false);  
  // array of users containg each user different properties
  const[allUser, setAllUser] = useState([]);
  const[openSearchUser, setOpenSearchUser] = useState(false);

  const socketConnection  = useSelector(state => state?.user?.socketConnection);
  // logout
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data)=>{
        console.log("all converation in sidebar message: ", data);

        const conversationUserData = data?.map((conversationUser, index)=>{
          // same ko
          if(conversationUser?.sender?._id == conversationUser?.receiver?._id){
            return{
              ...conversationUser,
              userDetails : conversationUser.sender
            }
          }
          else if (user?._id != conversationUser?.receiver?._id){
            return{
              ...conversationUser,
              userDetails : conversationUser.receiver
            }
          }
          else{
            return{
              ...conversationUser,
              userDetails : conversationUser.sender
            }
          }

        })
        
        // setAllUser(data);
        setAllUser(conversationUserData);

      })
    }
  },[socketConnection, user])


  const handleLogout = ()=>{
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  }


  return (
    <div className="w-full h-full border grid grid-cols-[48px,1fr] bg-white">
        <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg text-slate-600 py-5 flex flex-col justify-between'> 
          <div>
            <NavLink className={ ({isActive})=>`bg-slate-100 w-12 h-12 flex justify-center items-center rounded cursor-pointer hover:bg-slate-200 ${isActive && "bg-slate-200"}`} title="Chat">
                <IoChatbubbleEllipses size={23}></IoChatbubbleEllipses> 
            </NavLink>
            
            <div className='bg-slate-100 w-12 h-12 flex justify-center items-center rounded cursor-pointer hover:bg-slate-200' title="Add Friends" onClick={()=>setOpenSearchUser(true)}>
                <FaUserPlus size={23}></FaUserPlus>
            </div>
          </div>

          <div  >
            <button title={user.name} onClick={ ()=>setEditUserOpen(true) }> 
              <Avatar width={40} height={40} name={user?.name} imageUrl={user?.profile_pic} userId={user?._id}  ></Avatar> 
            </button>
            <button className="pr-3 bg-slate-100 w-12 h-12 flex justify-center items-center rounded cursor-pointer hover:bg-slate-200"
             title="Logout" onClick={handleLogout}> <BiLogOut size={25}></BiLogOut> 
            </button>
          </div>
        
        </div>

        <div className='w-full'> 
          <div className='h-16 flex items-center'>
            <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
          </div>
          <div className='bg-slate-200  p-[0.5px]'></div>
          <div className='h-[calc(100vh-64px-2.5px)] overflow-x-hidden overflow-y-auto scrollbar'>
            
            {
              allUser.length==0 && (
                <div className='mt-12'>
                  <div className='flex justify-center items-center my-4 text-slate-500'><FiArrowUpLeft size={50}></FiArrowUpLeft></div>
                  <p className="text-center text-lg text-slate-400">Explore users to start a conversation with.</p>
                </div>
              )
            }

            {/* show users on sidebar  */}
            {
              allUser.map((conv, index)=>{
                return(
                  <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 p-2 py-3 border-[1.5px] border-transparent hover:border-primary rounded hover:bg-slate-50 cursor-pointer'>
                    <div>
                      <Avatar
                        imageUrl={conv?.userDetails?.profile_pic}
                        name={conv?.userDetails?.name}
                        width={40}
                        height={40}
                      />
                    </div>

                    <div> 
                      <h3 className='line-clamp-1 text-ellipsis font-semibold'>{conv?.userDetails?.name}</h3>
                      <div className='text-xs text-slate-500 flex items-center gap-1'>
                        <div>
                          {
                            conv?.lastMsg?.imageUrl && (
                              <div className='flex items-center gap-1'>
                                <span><FaImage></FaImage></span>
                                {!conv?.lastMsg?.text && <span>Image</span>}
                              </div>
                            )
                          }
                          {
                            conv?.lastMsg?.videoUrl && (
                              <div className='flex items-center gap-1'>
                                <span><FaVideo></FaVideo></span>
                                {!conv?.lastMsg?.text && <span>Video</span>}
                              </div>
                            )
                          }
                        </div>
                        <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                      </div>
                    </div>
                    { // not 0, then visible
                      Boolean(conv?.unseenMsg) && (
                        <p className=' flex justify-center items-center ml-auto w-6 h-6 text-sm p-1 bg-primary rounded-full text-white'>{conv?.unseenMsg}</p>
                      )
                    }
                  </NavLink>
                )
              })
            }

          </div>
        </div>
        
        {/* Edit user details */}
        {
          editUserOpen && (
            <EditUserDetails onClose={()=>setEditUserOpen(false)} user={user} ></EditUserDetails>
          )
        }

        {/* Search User */}
        {
          openSearchUser && (
            <SearchUser onClose={()=>setOpenSearchUser(false)}> </SearchUser>
          )
        }

    </div>


  )
}

export default Sidebar

