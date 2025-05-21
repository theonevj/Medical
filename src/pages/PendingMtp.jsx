import React , {useEffect, useState} from 'react'
import api from '../api'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';

//importing images
import NODATA from '../assets/computer.png'
import Loader from '../assets/loader.svg'

//Importing icons
import { CalendarCheck2 } from 'lucide-react';
import { toast } from 'react-toastify'

const FormateDate = (date) =>{
  if(!date) return ''

  let d = new Date(date)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  // Function to get ordinal suffix
  function getOrdinal(n) {
    if (n > 3 && n < 21) return 'th'; // special case for 11th-13th
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  return `${month}, ${day}${getOrdinal(day)} ${year}`;
}

function PendingMtp() {
  const { user } = useSelector((state) => state.auth);
  const [mtpPlan,setMtpPlan] = useState([])
  const [activeState,setActiveState] = useState('approve')
  const [loading,setLoading] = useState(false)
  const [activeCounts, setActiveCounts] = useState(1);
  const [pendingCounts, setPendingCounts] = useState(1);
  const [rejectCounts, setRejectCounts] = useState(1);
  const [openDate,setOpenDate] = useState(false)

  const [approveLoader,setApproveLoader] = useState(false)
  const [rejectLoader,setRejectLoader] = useState(false)

  const [date,setDate] = useState(new Date())

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
      const response = await api.post(`/STPMTP/getAllMTPAP`)
      setMtpPlan(response.data.data)
    }catch(err){
     console.log(err)
     toast.error("Something went wrong.")
    }finally{
     setLoading(false)
    }
  }

  useEffect(()=>{
    setActiveCounts(mtpPlan.filter((item)=>item.status==="Approved").length)
    setPendingCounts(mtpPlan.filter((item)=>item.status==="Pending").length)
    setRejectCounts(mtpPlan.filter((item)=>item.status==="Rejected").length)
  },[mtpPlan])

  useEffect(()=>{
    getAllTourPlan()
  },[date])

  const approveMtp = async (id) =>{
    setApproveLoader(true)
     try{
       const response = await api.post(`STPMTP/${id}/approve`,{
        approvedBy: user.id,
        Description: "string"
      })
      getAllTourPlan()
       toast.success("Mtp approved successfully.")
     }catch(err){
      console.log(err)
     }finally{
      setApproveLoader(false)
     }
  } 


  const rejectMtp = async (id) =>{
    setRejectLoader(true)
    try{
      const response = await api.post(`STPMTP/${id}/reject`,{
        approvedBy: user.id,
        Description: "string"
      })
      getAllTourPlan()
      toast.success("Mtp rejected successfully.")
    }catch(err){
      console.log(err)
    }finally{
      setRejectLoader(false)
    }
  }

  const renderMTP = () =>{
    switch(activeState) {
      case "approve":
        return activeCounts > 0 ? (
          mtpPlan.filter((plan) => plan.status === "Approved")
          .map((item,index) => (
          
           <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
              <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
                 <span className='text-lg font-semibold'>{item?.stpName}</span>
                 <span className='text-sm'>STP ID: {item?.stpID || 0} . MTP ID:{item?.mtpID}</span>
              </div>
              <div className='flex flex-col gap-2'>
              <div className='flex gap-2 items-center'>
                 <div className='flex flex-col gap-1'>
                   <span className='text-neutral-600 font-medium'>MTP Details</span>
                   <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                       <div className='flex items-center gap-2'>
                          <span className='text-sm'>MTP Date:</span>
                          <div className='flex items-center gap-2'>
                             <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
                             <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
                          </div>
                       </div>
                       <hr></hr>
                       <div className='flex items-center gap-2'>
                         <span className='text-sm'>is Active:</span>
                         <span>{item?.isActive ? "Yes" : "No"}</span>
                       </div>
                   </div>
                 </div>
                 <div className='flex flex-col gap-1'>
                   <span className='text-neutral-600 font-medium'>Creation Information</span>
                   <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                       <div className='flex items-center gap-2'>
                             <span className='text-sm'>Created By:</span>
                             <span className='text-sm'>{item?.insertByName || ""}</span>
                       </div>
                       <hr></hr>
                       <div className='flex items-center gap-2'>
                         <span className='text-sm'>Created Date:</span>
                         <span>{FormateDate(item?.insertDate) || "N/A"}</span>
                       </div>
                   </div>
                 </div>
              </div>
              
                <div className='flex w-full items-center gap-2 rounded-md bg-slate-100 p-2'>
                   <span className='font-medium'>Reporting To: </span>
                   <span className='text-neutral-500'>{item?.reportingtoName}</span>
                </div>
                <div className='flex w-full flex-col gap-1 rounded-md bg-slate-100 p-2'>
                  <div className='flex items-center gap-2'>
                     <span>Approved By:</span>
                     <span className='text-neutral-500'>{item?.approverName}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                     <span>Approved Date:</span>
                     <span className='text-neutral-500'>{FormateDate(item?.approveDatetime)}</span>
                  </div>
                
              </div>
              </div>
              {/* <div className='w-full flex items-center gap-2 justify-center'>
                 <button className='bg-themeblue w-28 rounded-md p-1.5 text-white'>Approve</button>
                 <button className='bg-red-500 p-1.5 rounded-md w-28 text-white'>Reject</button>
              </div> */}
           </div>
        
       ))
        ) : (
        <div className="w-full col-span-3  h-full flex justify-center items-center">
          <div className="flex flex-col gap-1 items-center">
            <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
            <span className="text-gray-600 font-medium">
              No Approved Tour Plan
            </span>
          </div>
        </div>
        )

      case "pending":
        return pendingCounts > 0 ? (
          mtpPlan.filter((plan)=> plan.status==="Pending").
          map((item,index) => (
            
            <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
               <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
                  <span className='text-lg font-semibold'>{item?.stpName || ""}</span>
                  <span className='text-sm'>STP ID: {item?.stpID || 0} . MTP ID:{item?.mtpID
|| 0}</span>
               </div>
               <div className='flex flex-col gap-2'>
               <div className='flex gap-2 items-center'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-neutral-600 font-medium'>MTP Details</span>
                    <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                           <span className='text-sm'>MTP Date:</span>
                           <div className='flex items-center gap-2'>
                              <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
                              <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
                           </div>
                        </div>
                        <hr></hr>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>is Active:</span>
                          <span>{item?.isActive ? "Yes":"No"}</span>
                        </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-neutral-600 font-medium'>Creation Information</span>
                    <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                              <span className='text-sm'>Created By:</span>
                              <span className='text-sm'>{item?.insertByName || ""}</span>
                        </div>
                        <hr></hr>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>Created Date:</span>
                          <span>{FormateDate(item?.insertDate) || "N/A"}</span>
                        </div>
                    </div>
                  </div>
               </div>
               <div className='w-full rounded-md bg-slate-100 p-2'>
                  <span className='font-medium'>Reporting To: </span>
                  <span className='text-neutral-500'>{item?.reportingtoName}</span>
               </div>
               </div>
               <div className='w-full flex items-center gap-2 justify-center'>
                  <button disabled={approveLoader} onClick={()=>approveMtp(item.mtpID)} className='bg-themeblue disabled:bg-gray-400 w-28 rounded-md p-1.5 text-white'>Approve</button>
                  <button disabled={rejectLoader} onClick={()=>rejectMtp(item.mtpID)} className='bg-red-500 disabled:bg-gray-400 p-1.5 rounded-md w-28 text-white'>Reject</button>
               </div>
            </div>
         
        ))
        ) : (
          <div className="w-full col-span-3 h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Pending Tour Plan
              </span>
            </div>
          </div>
          )
        
      case "rejected" : 
        return rejectCounts > 0 ? (
          mtpPlan.filter((plan)=> plan.status==="Rejected").
          map((item,index)=>(
            
            <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
               <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
                  <span className='text-lg font-semibold'>{item?.stpName || ""}</span>
                  <span className='text-sm'>STP ID: {item?.stpID} . MTP ID:{item?.mtpID}</span>
               </div>
               <div className='flex flex-col gap-2'>
               <div className='flex gap-2 items-center'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-neutral-600 font-medium'>MTP Details</span>
                    <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                           <span className='text-sm'>MTP Date:</span>
                           <div className='flex items-center gap-2'>
                              <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
                              <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
                           </div>
                        </div>
                        <hr></hr>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>is Active:</span>
                          <span>{item?.isActive ? "Yes":"No"}</span>
                        </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-neutral-600 font-medium'>Creation Information</span>
                    <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                              <span className='text-sm'>Created By:</span>
                              <span className='text-sm'>{item?.insertByName || ""}</span>
                        </div>
                        <hr></hr>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm'>Created Date:</span>
                          <span>{FormateDate(item?.insertDate) || "N/A"}</span>
                        </div>
                    </div>
                  </div>
               </div>
               
                 <div className='flex w-full items-center gap-2 rounded-md bg-slate-100 p-2'>
                    <span className='font-medium'>Reporting To: </span>
                    <span className='text-neutral-500'>{item?.reportingtoName}</span>
                 </div>
                 <div className='flex w-full flex-col gap-1 rounded-md bg-slate-100 p-2'>
                   <div className='flex items-center gap-2'>
                      <span>Rejected By:</span>
                      <span className='text-neutral-500'>{item?.approverName}</span>
                   </div>
                   <div className='flex items-center gap-1'>
                      <span>Rejected Date:</span>
                      <span className='text-neutral-500'>{FormateDate(item?.approveDatetime)}</span>
                   </div>
                 
               </div>
               </div>
               {/* <div className='w-full flex items-center gap-2 justify-center'>
                  <button className='bg-themeblue w-28 rounded-md p-1.5 text-white'>Approve</button>
                  <button className='bg-red-500 p-1.5 rounded-md w-28 text-white'>Reject</button>
               </div> */}
            </div>
         
          ))
        ) : (
          <div className="w-full col-span-3 h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Rejected Tour Plan
              </span>
            </div>
          </div>
        )  
    }
   }

  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
    <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-gray-600 text-base md:text-lg font-medium">
         Pending Monthly Tour Plan
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

      <div className='relative w-44 border md:p-2 p-1.5 rounded-md'>
             <span onClick={()=>setOpenDate((prev)=>!prev)} className='text-center cursor-pointer'>Date: {getDate(date)}</span>
            {
              openDate && 
              <div className='absolute right-0 top-12'>
                <Calendar onChange={setDate} value={date}></Calendar>
              </div>
            }
       </div>
     
    </div>

    <div className='flex h-full flex-col overflow-scroll gap-4'>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img src={Loader} alt="loader" className="w-10 h-10"></img>
        </div>
      ) : (
        <div className='grid gap-4 grid-cols-1 w-full h-full md:grid-cols-3'>
          { renderMTP() }
        </div>
      )}
    </div>
  </div>
  )
}

export default PendingMtp