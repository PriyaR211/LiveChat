import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user, onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 border lg:p-4 border-transparent border-b-slate-200 hover:border hover:border-primary cursor-pointer rounded'>
      <div>
        <Avatar width={50} height={50} name={user?.name} userId={user?._id} imageUrl={user?.profile_pic} ></Avatar>
      </div>

      <div>
        <div>
          <div className='font-semibold text-ellipsis line-clamp-1'>{user?.name}</div>
        </div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>

    </Link>
  )
}

export default UserSearchCard
