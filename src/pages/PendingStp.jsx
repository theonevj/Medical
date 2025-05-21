import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useSelector } from 'react-redux'

//importing images
import NODATA from '../assets/computer.png'
import Loader from '../assets/loader.svg'

//Importing icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close';

function PendingStp() {
  const { user } = useSelector((state) => state.auth);
  const [stpPlan,setStpPlan] = useState([])
  const [activeState,setActiveState] = useState('approve')
  const [loading,setLoading] = useState(false)
  const [activeCounts, setActiveCounts] = useState(0);
  const [pendingCounts, setPendingCounts] = useState(0);
  const [rejectCounts, setRejectCounts] = useState(0);

  const [approveLoading,setApproveLoading] = useState(false)
  const [rejectLoading,setRejectLoading] = useState(false)
  const [rejectPopUp,setRejectPopUp] = useState(false)
  const [approvePopUp,setApprovePopUp] = useState(false)
  const [comments,setComments] = useState('')

  const [selectedTourId,setSelectedTourId] = useState(null)

  const handleOpenApprovePopUp = (tourId) =>{
    setApprovePopUp(true)
    setSelectedTourId(tourId)
  }

  const handleOpenRejectPopUp = (tourId) =>{
    setRejectPopUp(true)
    setSelectedTourId(tourId)
  }

  const handleCloseApprovePopUp = () =>{
    setSelectedTourId(null)
    setApprovePopUp(false)
    setComments('')
  }

  const handleCloseRejectPopUp = () =>{
    setSelectedTourId(null)
    setRejectPopUp(false)
    setComments('')
  } 

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
       reportingTo:1,
       tourType:0
      })
      console.log(response.data.data)
      if(response.data.data.length>0){
       setStpPlan(response.data.data[0].tours.filter((tour)=> tour.tourType === 0))
      }
    }catch(err){
     toast.error("Something went wrong.")
     console.log(err)
    }finally{
     setLoading(false)
    }
  }

  const approveStpPlan = async () =>{
    try{
       setApproveLoading(true)
       const response = await api.post(`STPMTP/${selectedTourId}/approve`,
       {
        approvedBy:user.id,
        comments
       })
       console.log(response)
       await getAllTourPlan()
       handleCloseApprovePopUp()
       toast.success('successfully stp plan approved.')
    }catch(err){
      console.log(err)
      toast.error("Something went wrong.")
    } finally{
      handleCloseRejectPopUp()
      setApproveLoading(false)
    }
  }

  const handleRejectStpPlan = async () =>{
    try{
      setRejectLoading(true)
      const response = await api.post(`STPMTP/${selectedTourId}/reject`,
      {
       approvedBy:user.id,
       comments
      })
      console.log(response)
      toast.success('successfully stp plan rejected.')
   }catch(err){
     console.log(err)
     toast.error("Something went wrong.")
   } finally{
     handleCloseRejectPopUp()
     setRejectLoading(false)
   }
  }

  useEffect(()=>{
    setActiveCounts(stpPlan.filter((item)=>item.status==="Approved").length)
    setPendingCounts(stpPlan.filter((item)=>item.status==="Pending").length)
    setRejectCounts(stpPlan.filter((item)=>item.status==="Rejected").length)
  },[stpPlan])

  useEffect(()=>{
    getAllTourPlan()
   },[])

   const renderSTP = () =>{
    switch(activeState) {
      case "approve":
        return activeCounts > 0 ? (
          stpPlan.filter((plan) => plan.status === "Approved")
          .map((item,index) => (
          <div key={index} className='rounded-md custom-shadow border-l-4 border-black  bg-white p-4 flex flex-col gap-2'>
          <div className='w-full flex justify-between'>
            <h1 className='text-lg font-bold'>{item.tourName || ""}</h1>
            <div className='flex items-center gap-4'>
              <span className='font-medium'>Approved By : {item.approvedBy || ""}</span>
              <span className='bg-green-200 flex justify-center items-center px-2 p-1 rounded-2xl text-sm text-green-600'>Approved</span>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
           <div className='flex gap-2 items-center'>
             <span className='text-[#71717a]'><CalendarTodayIcon style={{fontSize:'1.1rem'}}></CalendarTodayIcon></span> 
             <span className='text-[#71717a] font-medium'>{getDate(item.addedDate)}</span>
           </div>
           <p className='text-[15px] font-medium text-[#71717a]'>{item.comments || ""}</p>
          </div>
          <div className='flex flex-col mt-2 gap-2'>
           <div className='flex items-center gap-2'>
             <span className='text-[#71717a]'><LocationOnOutlinedIcon></LocationOnOutlinedIcon></span>
             <span className='font-medium'>Tour Locations</span>
           </div>
           <hr></hr>
           <div className='flex flex-col gap-1'>
             {
               item.tourLocations.map((location,index)=> <span key={index}>{location.locationSequence+1} {location.locationName || ""}</span>)
             }
           </div>
          </div>
       </div>
       ))
        ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col gap-1 items-center">
            <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
            <span className="text-gray-600 font-medium">
              No Approved Tour Plans
            </span>
          </div>
        </div>
        )

      case "pending":
        return pendingCounts > 0 ? (
          stpPlan.filter((plan)=> plan.status==="Pending").
          map((item,index) => (
          <div key={index} className='rounded-md custom-shadow border-l-4 border-black  bg-white p-4 flex flex-col gap-2'>
          <div className='w-full flex justify-between'>
            <h1 className='text-lg font-bold'>{item.tourName || ""}</h1>
            <div className='flex items-center gap-2'>
              <button disabled={approveLoading} onClick={()=>handleOpenApprovePopUp(item.tourID)} className='bg-green-600 text-white transition-all duration-300 rounded-md hover:bg-green-800 p-1 px-2'>Give Approve</button>
              <button disabled={rejectLoading} onClick={()=>handleOpenRejectPopUp(item.tourID)} className='bg-red-500 text-white transition-all duration-300 rounded-md hover:bg-red-600 p-1 px-2'>Reject</button>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
           <div className='flex gap-2 items-center'>
             <span className='text-[#71717a]'><CalendarTodayIcon style={{fontSize:'1.1rem'}}></CalendarTodayIcon></span> 
             <span className='text-[#71717a] font-medium'>{getDate(item.addedDate)}</span>
           </div>
           <p className='text-[15px] font-medium text-[#71717a]'>{item.comments || ""}</p>
          </div>
          <div className='flex flex-col mt-2 gap-2'>
           <div className='flex items-center gap-2'>
             <span className='text-[#71717a]'><LocationOnOutlinedIcon></LocationOnOutlinedIcon></span>
             <span className='font-medium'>Tour Locations</span>
           </div>
           <hr></hr>
           <div className='flex flex-col gap-1'>
            {
               item.tourLocations.map((location,index)=> <span key={index}>{location.locationSequence+1} {location.locationName || ""}</span>)
             }
           </div>
          </div>
         </div>
        ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Pending Tour Plans
              </span>
            </div>
          </div>
          )
        
      case "rejected" : 
        return rejectCounts > 0 ? (
          stpPlan.filter((plan)=> plan.status==="Rejected").
          map((item,index)=>(
          <div key={index} className='rounded-md custom-shadow border-l-4 border-black  bg-white p-4 flex flex-col gap-2'>
          <div className='w-full flex justify-between'>
            <h1 className='text-lg font-bold'>{item.tourName || ""}</h1>
            <div className='flex items-center gap-4'>
              <span className='font-medium'>Reject By : {item.approvedBy || ""}</span>
              <span className='bg-red-200 flex justify-center items-center px-2 p-1 rounded-2xl text-sm text-red-600'>Approved</span>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
           <div className='flex gap-2 items-center'>
             <span className='text-[#71717a]'><CalendarTodayIcon style={{fontSize:'1.1rem'}}></CalendarTodayIcon></span> 
             <span className='text-[#71717a] font-medium'>{getDate(item.addedDate)}</span>
           </div>
           <p className='text-[15px] font-medium text-[#71717a]'>{item.comments || ""}</p>
          </div>
          <div className='flex flex-col mt-2 gap-2'>
           <div className='flex items-center gap-2'>
             <span className='text-[#71717a]'><LocationOnOutlinedIcon></LocationOnOutlinedIcon></span>
             <span className='font-medium'>Tour Locations</span>
           </div>
           <hr></hr>
           <div className='flex flex-col gap-1'>
             {
               item.tourLocations.map((location,index)=> <span key={index}>{location.locationSequence+1} {location.locationName || ""}</span>)
             }
           </div>
          </div>
       </div>))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Rejected Tour Plans
              </span>
            </div>
          </div>
        )
         
    }
   }

  return (
    <>
    {
      approvePopUp && 
      <div className="fixed z-50 flex justify-center items-center inset-0 bg-black/50">
      <div className='bg-white relative rounded-md w-1/4 p-4 flex flex-col gap-4'>
        <div className='absolute top-2 right-2'>
           <span onClick={handleCloseApprovePopUp} className='text-red-500 cursor-pointer hover:text-red-600'><CloseIcon style={{fontSize:'1.2rem'}}></CloseIcon></span>
        </div>
        <div className='flex flex-col gap-1'>
         <label>Comments</label>
         <input onChange={(e)=>setComments(e.target.value)} type='text' className='p-2 border outline-none rounded-md' placeholder='enter comments'></input>
        </div>
        <button onClick={approveStpPlan} className='bg-themeblue text-white p-1 rounded-md hover:bg-blue-800 transition-all duration-300 px-2'>Approve</button>
      </div>
    </div>
    }
    {
       rejectPopUp && 
      <div className="fixed z-50 flex justify-center items-center inset-0 bg-black/50">
      <div className='bg-white relative rounded-md w-1/4 p-4 flex flex-col gap-4'>
        <div className='absolute top-2 right-2'>
           <span onClick={handleCloseRejectPopUp} className='text-red-500 cursor-pointer hover:text-red-600'><CloseIcon style={{fontSize:'1.2rem'}}></CloseIcon></span>
        </div>
        <div className='flex flex-col gap-1'>
         <label>Comments</label>
         <input onChange={(e)=>setComments(e.target.value)} type='text' className='p-2 border outline-none rounded-md' placeholder='enter comments'></input>
        </div>
        <button onClick={handleRejectStpPlan} className='bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition-all duration-300 px-2'>Reject</button>
      </div>
    </div>
    }
    <div className='flex h-full flex-col gap-3 md:gap-4'>
    <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-gray-600 text-base md:text-lg font-medium">
          Pending Standard Tour Plan
        </h1>
        <div className="flex items-center gap-2">
          <span
            onClick={() => setActiveState("approve")}
            className={`w-20 ${
              activeState === "approve"
                ? "bg-themeblue text-white"
                : "text-gray-600"
            } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
          >
            Approved
          </span>
          <span
            onClick={() => setActiveState("pending")}
            className={`w-20 ${
              activeState === "pending"
                ? "bg-themeblue text-white"
                : "text-gray-600"
            } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
          >
            Pending
          </span>
          <span
            onClick={() => setActiveState("rejected")}
            className={`w-20 ${
              activeState === "rejected"
                ? "bg-themeblue text-white"
                : "text-gray-600"
            } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
          >
            Rejected
          </span>
        </div>
      </div>
     
    </div>

    <div className='flex h-full flex-col overflow-scroll gap-4'>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img src={Loader} alt="loader" className="w-10 h-10"></img>
        </div>
      ) : (
        renderSTP()
      )}
    </div>
  </div>
  </>
  )
}

export default PendingStp