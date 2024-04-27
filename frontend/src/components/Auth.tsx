import { SignupInput } from '@ishhhan/medium-common';
import { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BACKEND_URL } from '../pages/config';
import { NameContext } from './NameContext';

function Auth( {type}: {type: "signup" | "signin"} ) {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>(
    {
      name: "",
      email: "",
      password: "",
    }
  )

  async function sendRequest(){
    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
      const jwt = response.data.jwt;
      const name = response.data.name;
      console.log(name);
      <NameContext.Provider value= {name}/>
      localStorage.setItem("token", jwt);
      navigate("/blogs")
    }catch(e){
      //
      alert(e)
    }
  }
  return (
    <div className='h-screen flex flex-col justify-center'>
      <div className='flex justify-center'>
        <div>
        <div className='px-10'>
          <div className='font-extrabold text-3xl'>
            Create an Account
          </div>
          <div className='text-slate-500'>
            {type === "signup" ? "Already have an account?" : "Don't have an account"}
            <Link className='pl-2 underline' to= {type === "signup" ? "/signin" : "/signup"}> 
             {type === "signup" ? "Sign In" : "Sign Up"} 
            </Link>
          </div>
        </div>
        <div className='pt-3'>
        {type ==="signup" ? <LabelledInput label='Name' placeholder='Enter your name' onChange={(e) => {
        setPostInputs({
          ...postInputs,
          name: e.target.value
        })
       }}/> : null}
       <LabelledInput label='Email' placeholder='matt@example.com' onChange={(e) => {
        setPostInputs({
          ...postInputs,
          email: e.target.value
        })
       }}/>
        <LabelledInput label='Password' type={"password"} placeholder='' onChange={(e) => {
        setPostInputs({
          ...postInputs,
          password: e.target.value
        })
       }}/>
       <button onClick={sendRequest} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4">{type === "signup" ? "Sign Up" : "Sign In"}</button>

        </div>
      
      </div>
     
        </div>
        
    </div>
  )
}

interface LabelledInputType{
  label: string;
  placeholder: string;
  onChange: (e : ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput( {label, placeholder, onChange, type}: LabelledInputType ){
  return <div>
  <label className="block m-2 text-sm font-semibold text-gray-900 ">{label} </label>
  <input onChange = {onChange} type={ type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
</div>
}

export default Auth