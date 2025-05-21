import React, { useState } from 'react'

import { Link , useNavigate} from 'react-router-dom'

//importing images
import IMG from '../assets/asset2.png'
import LOGO from '../assets/ELVIRA LOGO.png'
import { toast } from 'react-toastify'

export default function ForgetPassword() {
const [email,setEmail] = useState('')
const navigate = useNavigate()

const validateEmail = () =>{
    let valid=true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        valid=false
        toast.error("Please enter email address.")
    }
    else if(!emailRegex.test(email)){
        valid=false
        toast.error("Email address is invalid.")
    } 
    return valid
}

const handleNextAction = async () =>{
  if(validateEmail()){
    try{
     setEmail('')
     navigate('/reset-password')
    }catch(err){
       console.log(err)
       toast.error(err.message)
    }
  }
   
}
  return (
    <div className="relative w-full md:h-screen flex md:flex-row flex-col items-center">
    {/* first section */}
    <div className="md:w-1/2 w-full flex md:absolute top-0 left-0 pentagon h-2/3 md:h-full overflow-hidden py-8 md:py-24 px-4 flex-col bg-white gap-10 md:gap-24">
      <div className="flex flex-col gap-2 md:gap-6 items-center md:items-start md:pl-36">
        <div className="flex items-center gap-2 pl-4">
          <img className="md:w-40 w-12 h-12 md:h-20" src={LOGO} alt="logo" />
        </div>
        <div className="flex flex-col gap-1 md:gap-2 items-center">
          <h1 className="text-purple text-xl md:text-2xl font-medium">Welcome Black</h1>
          <p className="text-sm md:text-base text-gray-600 text-center">
            User Experience & Interface Design <br />
            Strategy SaaS Solutions
          </p>
        </div>
      </div>
      <div className="md:pl-16 flex items-center md:place-content-start place-content-center">
        <img className="w-72 md:w-96" src={IMG} alt="login-image"></img>
      </div>
    </div>

    {/* second section */}
    <div className="w-full flex place-content-center md:place-content-end md:h-screen bg-lightgray">
      <div className="md:w-1/2 w-full py-20 md:h-screen flex justify-center items-center">
        <div className="flex md:w-8/12 w-4/5 flex-col gap-5">
          <h1 className="md:text-3xl text-2xl font-medium mb-2 text-center">
            Reset Password
          </h1>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-600"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e)=>setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="demo@example.com"
              className="outline-none bg-white px-2 py-4 shadow rounded-md"
            ></input>
          </div>
          <button
            onClick={handleNextAction}
            className="bg-blue-500 transition-colors duration-300 hover:bg-themeblue text-white p-3 rounded-md mt-2 text-base font-medium"
          >
            Submit
          </button>
          <div className="flex place-content-end">
             <Link to={'/'}><span className="text-blue-500 cursor-pointer">want to Login?</span></Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
