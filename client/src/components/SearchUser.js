import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import Loader from './Loader';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {

    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // input search box
    const handleSearchUser = async()=>{
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try{
            setLoading(true);
            const response = await axios.post(URL,{
                search : search
            })
            setLoading(false);
            console.log("server response on search:", response);
            setSearchUser(response.data.data);
        }
        catch(err){
            toast.error(err?.response?.data?.message);
        }
    }

    useEffect(()=>{
        handleSearchUser();
    },[search])

    console.log("search user details : ", searchUser);

  return (

    <div className='fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
      <div className='max-w-lg mx-auto mt-10 '>
        {/* input for searching user */}
        <div className='bg-white rounded overflow-hidden h-14 flex'>
            <input type='text' placeholder='Search user by name, email...' className='w-full outline-none py-1 px-4 h-full' onChange={(e)=>setSearch(e.target.value)} value={search} />
        <div className='flex justify-center items-center mr-3'>
            <IoIosSearch size={25}></IoIosSearch>
        </div>
        
        </div>

        {/* Display search user */}
        <div className='bg-white mt-2 w-full p-4 rounded'>
            
            {/* No user found */}
            {
                searchUser.length ==0 && !loading && (
                <p className='text-center text-slate-500'> No user found!</p>
                
            )
            }

            {
                loading && (
                    <Loader></Loader>
                )
            }

            {
                searchUser.length !=0 && !loading && (
                    searchUser.map((user, index)=>{
                        return(
                            <UserSearchCard key={user._id} user={user} onClose={onClose}> </UserSearchCard>
                        )
                    })
                )
            }

        </div>

      </div>
      
      <div >
        <button className='absolute top-0 right-0 text-2xl p-2 hover:text-white lg:text-4xl' onClick={onClose}> 
            <IoClose></IoClose> 
        </button>
      </div>

    </div>
  )
}

export default SearchUser
