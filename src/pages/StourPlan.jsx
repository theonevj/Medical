import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useSelector } from 'react-redux'

//importing images
import NODATA from '../assets/computer.png'
import Loader from '../assets/loader.svg'

//Importing icons
import { Rows2 } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search';


function StourPlan() {
   const { user } = useSelector((state) => state.auth);
   const [stpPlan,setStpPlan] = useState([])
   const [loading,setLoading] = useState(false)
   const [searchQuery,setSearchQuery] = useState(0)
   const [headQuater,setHeadQuater] = useState([])
  

   const getDate = (orgdate) => {
    if (!orgdate) return "";
    const dateObj = new Date(orgdate);

    // Format the date as dd-MM-yyyy
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);

    return formattedDate;
  };

   const getAllTourPlan = async () =>{
     try{
       setLoading(true)
       const response = await api.post(`/STPMTP/GetAll`,
       {
        pageNumber:0,
        pageSize:0,
        criteria:'string',
        headquarter:Number(searchQuery),
        reportingTo:0,
        tourType:0
       })
       setStpPlan(response.data.data)
     }catch(err){
      toast.error("Something went wrong.")
      console.log(err)
     }finally{
      setLoading(false)
     }
   }


   useEffect(()=>{
    getAllTourPlan()
   },[searchQuery])

   const fetchHeadquater = async () =>{
    try{
      const response = await api.get('/Headquarters')
      setHeadQuater(response.data)
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
}

  useEffect(()=>{
    fetchHeadquater()
  },[])


  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-600 text-base md:text-lg font-medium">
            Standard Tour Plan
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className='bg-gray-100 md:flex  p-1.5 rounded-md hidden gap-1 items-center'>
              <label className='text-neutral-600'>Search By Headquarters: </label>
              <select className='outline-none p-1.5 ' onChange={(e)=>setSearchQuery(e.target.value)}>
                <option value={0}>--- Select Headquarters ---</option>
                {
                  headQuater.map((hd)=>(
                    <option value={hd.hqid}>{hd.hqName}</option>
                  ))
                }
              </select>
           </div>
          <Link
            to={user.isAdmin?"/admin/stpplan/add":"/employee/stpplan/add"}
          >
            <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
              Add Tour Plan
            </button>
          </Link>
        </div>
      </div>

      <div className='h-full w-full overflow-scroll gap-4'>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <img src={Loader} alt="loader" className="w-10 h-10"></img>
          </div>
        ) : (
            stpPlan.length===0 ?
              <div className='flex w-full h-full justify-center items-center'>
                No Stp Found
              </div>
              :
            <div className='h-full gap-4 w-full grid md:grid-cols-3 grid-cols-1 items-start'>
              {stpPlan.map((stp,index)=>(
                  <div key={index} className='flex rounded-md shadow  flex-col'>
                    <div className='flex bg-neutral-300 items-center text-black justify-between p-3'>
                       <h1>{stp.tourName}</h1>
                       <span className='bg-green-500 rounded-md text-white font-medium px-2 py-1'>{stp.tourType===0?"Local":stp.tourType===1?"Out Station":"Ex-Station"}</span>
                    </div>
                    <div className='flex gap-3 flex-col p-3 bg-neutral-100'>
                      {
                        stp?.tourLocation && 
                        <div className='flex items-center gap-2'>
                          <MapPin className='text-violet-500 w-5 h-5'></MapPin>
                          <span className='text-violet-500 text-sm'>{stp?.tourLocation?.split(',')}</span>
                         </div>
                      }
                      <div className='flex items-center gap-2'>
                         <Calendar className='text-blue-500 w-5 h-5'></Calendar>
                         <span className='text-blue-500 text-sm font-medium'>Added On {getDate(stp.addedDate)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                         <MapPin className='text-indigo-500 w-5 h-5'></MapPin>
                         <span className='text-sm text-indigo-500'>{stp.perKm} KM</span>
                      </div>
                      {
                        stp?.tourAllowance && 
                        <div className='flex items-center gap-2'>
                          <Rows2 className='text-sky-500 w-5 h-5'></Rows2>
                          <span className='text-sky-500 text-sm'>{stp?.tourAllowance?.split(',')}</span>
                       </div>
                      }
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default StourPlan