import { ChangeEvent, useState } from 'react'
import Appbar from '../components/Appbar'
import axios from 'axios';
import { BACKEND_URL } from './config';
import { useNavigate } from 'react-router-dom';

function Publish() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
  return (
    <div>
        <Appbar/>
        <div className='flex justify-center'>
            <div className="mb-4 mt-6 max-w-screen-lg w-full">
                <input onChange={(e) => {
                    setTitle(e.target.value)
                }} placeholder='Title' className=" focus:outline-none block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50" />
                <TextEditor onChange = {(e)=> {
                    setDescription(e.target.value)
                }}/>
                <button onClick = {async () => {
                        const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                            title,
                            content : description
                        }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        navigate(`/blog/${response.data.id}`)
                    }} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800">
                        Publish Blog
                    </button>
            </div>
            
        </div>
        
        
    </div>

  )
}

function TextEditor({onChange}: {onChange : (e: ChangeEvent<HTMLTextAreaElement>) => void}){
    return(
        <div className='flex justify-center'>
            <div className='w-full max-w-screen-lg'>
            <form>
            <div className="w-full mb-4 border border-gray-200 rounded-lg">
                <div className="px-4 py-2 bg-white rounded-t-lg">
                    <textarea onChange={onChange} className="focus:outline-none w-full px-0 text-sm text-gray-900" placeholder="Enter blog here..." required ></textarea>
                </div>
            </div>
            </form>
            </div>
          
        </div>
    )
}

export default Publish