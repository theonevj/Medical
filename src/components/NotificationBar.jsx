import React, { useEffect, useState } from 'react'
import api from '../api'
import {toast} from 'react-toastify'

//importing images
import Notification from '../assets/notification.png'

import { Loader } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';



function formatDate(dateString) {
   const date = new Date(dateString);
   const options = { day: '2-digit', month: 'short', year: 'numeric' };
   return date.toLocaleDateString('en-GB', options);
}
 
function NotificationBar({notificationOpen, ref}) {

   const [notification,setNotification] = useState([])
   const [loader,setLoader] = useState(false)
   const [addLoader,setAddLoader] = useState(false)

   const fetchNotification = async  () =>{
     try{
        setLoader(true)
        const response = await api.get('/Notifications')
        console.log(response.data)
        setNotification(response.data)
     }catch(err){
       console.log(err)
       toast.error("Something went wrong.")
     }finally{
      setLoader(false)
     }
   }

   const addMarkAsRead = async (id) =>{
      try{
        console.log(id)
        setAddLoader(true)
        const response = await api.put(`/Notifications/mark-as-read/${id}`)
        console.log(response)
      }catch(err){
         console.log(err)
         toast.error("Something went wrong.")
      }finally{
         setAddLoader(false)
      }
   }

   useEffect(()=>{
      fetchNotification()
   },[])

  return (
    <div ref={ref} className={`custom-shadow border transition-all duration-300 fixed ${notificationOpen?"right-0":"md:-right-[25%] -right-[80%]"} h-full w-4/5 md:w-1/4 z-50 bg-white`}>
        <div className='p-2 bg-blue-600 text-white flex justify-center items-center border-b'>
            <span>Notification</span>
        </div>
        <div className='flex h-full w-full flex-col'>
            {
               notification.length>0?
               loader?
                <div className='w-full h-full flex justify-center items-center'>
                   <span><Loader className='animate-spin'></Loader></span>
                </div>
               :
               notification.map((noty,index)=>(
                <div key={index} className='flex border-b transition-all duration-300 hover:bg-slate-50 p-3 py-4 items-start gap-2'>
                  <span className='flex bg-blue-500 justify-center items-center text-white font-semibold w-8 h-8 rounded-full'>{noty.title.charAt(0)}</span>
                  <div className='flex flex-col gap-3 w-full'>
                   <div className='flex items-center justify-between'>
                      <div className='flex flex-col'>
                         <h1 className='font-semibold'>{noty.title}</h1>
                         <span className='text-sm text-gray-500'>{formatDate(noty.createdAt)}</span>
                      </div>
                      <button disabled={addLoader} onClick={()=>addMarkAsRead(noty.id)} className='bg-green-500 transition-colors w-28 flex justify-center items-center duration-300 hover:bg-green-600 text-white p-1.5 text-sm cursor-pointer'>
                        {
                           addLoader?
                           <span><LoaderCircle className='animate-spin'></LoaderCircle></span>
                           :<span>Mark As Read</span>
                        }
                      </button>
                   </div>
                   <div className='flex justify-center items-center'>
                     <div className='border p-1 rounded-md bg-gray-100'>
                        <p className='text-sm text-gray-600'>{noty.message}</p>
                     </div>
                   </div>
                 </div>
                </div>
               ))
               : 
            <div className='w-full flex justify-center items-center m-auto'>
               <div className='flex flex-col gap-4 items-center'>
                  <img src={Notification} alt='notification' className='w-28 h-28'></img>
                  <span className='font-sans'>No Notifications</span>
               </div>
            </div>

            } 

           
        </div>
    </div>
  )
}

export default NotificationBar