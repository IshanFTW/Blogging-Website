import { Avatar } from './BlogCard'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { NameContext } from './NameContext';

function Appbar() {
  const name = useContext(NameContext);
  return (
    <div className='flex justify-between px-10 py-3 border-b'>
      <Link to={'/blogs'}>
      <div className='flex flex-col justify-center'>
            Medium
        </div>
      </Link>
        
        <div>
          <Link to={'/publish'}>
          <button type="button" className="mr-4 text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">New</button>
          </Link>
        
            <Avatar size = {"big"} name ={name}/>
        </div>
    </div>
  )
}

export default Appbar