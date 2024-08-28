import React from 'react'
import {PiUserCircle} from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({userId, name, imageUrl, width, height}) => {
    // React-Redux hook, extract data from the Redux store state
    const onlineUser = useSelector(state => state?.user?.onlineUser);


    let avatarName="";
    // Priya Ranjan
    if(name){
        let splitName = name.split(" ");
        if(splitName.length>1){
            avatarName = splitName[0][0] + splitName[1][0]
        }
        else{
            avatarName = splitName[0][0];
        }
    }
    const bgColor = [
        "bg-green-200",
        "bg-slate-200",
        "bg-yellow-200",
        "bg-blue-200",
        "bg-teal-200",
        "bg-purple-200"
    ]
    const randomNum = Math.floor(Math.random()*7);

    // checks userId is present in the onlineUser list
    const isOnline = onlineUser.includes(userId);

  return (
    <div className={`text-slate-800 rounded-full font-bold relative`}  style={ {width:width+"px", height:height+"px" } }>
        {
            imageUrl?(
            <img src={imageUrl} width={width} height={height} alt={name}
            className="overflow-hidden rounded-full" />
            ):
            (
                name ? (
                    <div style={ {width:width+"px", height:height+"px" } } className={`overflow-hidden rounded-full flex justify-center items-center text-xl shadow border ${bgColor[randomNum]}` }>
                        {avatarName}
                    </div>
                ):(
                    <PiUserCircle size={width}></PiUserCircle>
                )
            )

        }
        {
            isOnline && <p className='bg-green-600 p-1 absolute bottom-2 -right-1 rounded-full z-10'></p>
        }
    </div>
  )
}

export default Avatar
