// import React, { useEffect, useState } from 'react'
// import api from '../api'
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useSelector } from 'react-redux';

// //importing images
// import NODATA from '../assets/computer.png'
// import Loader from '../assets/loader.svg'

// //Importing icons
// import { CalendarCheck2 } from 'lucide-react';
// import { toast } from 'react-toastify'

// const FormateDate = (date) => {
//   if (!date) return ''

//   let d = new Date(date)
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const day = d.getDate();
//   const month = monthNames[d.getMonth()];
//   const year = d.getFullYear();

//   // Function to get ordinal suffix
//   function getOrdinal(n) {
//     if (n > 3 && n < 21) return 'th'; // special case for 11th-13th
//     switch (n % 10) {
//       case 1: return "st";
//       case 2: return "nd";
//       case 3: return "rd";
//       default: return "th";
//     }
//   }

//   return `${month}, ${day}${getOrdinal(day)} ${year}`;
// }

// function PendingMtp() {
//   const { user } = useSelector((state) => state.auth);
//   const [mtpPlan, setMtpPlan] = useState([])
//   const [activeState, setActiveState] = useState('approve')
//   const [loading, setLoading] = useState(false)
//   const [activeCounts, setActiveCounts] = useState(1);
//   const [pendingCounts, setPendingCounts] = useState(1);
//   const [rejectCounts, setRejectCounts] = useState(1);
//   const [openDate, setOpenDate] = useState(false)

//   const [approveLoader, setApproveLoader] = useState(false)
//   const [rejectLoader, setRejectLoader] = useState(false)

//   const [date, setDate] = useState(new Date())

//   const getDate = (orgdate) => {
//     if (!orgdate) return "";
//     const dateObj = new Date(orgdate);

//     // Format the date as dd-MM-yyyy
//     const formattedDate = new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     }).format(dateObj);

//     return formattedDate;
//   };

//   const getAllTourPlan = async () => {
//     try {
//       setLoading(true)
//       const response = await api.post(`/STPMTP/getAllMTPAP`)
//       setMtpPlan(response.data.data)
//     } catch (err) {
//       console.log(err)
//       toast.error("Something went wrong.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     setActiveCounts(mtpPlan.filter((item) => item.status === "Approved").length)
//     setPendingCounts(mtpPlan.filter((item) => item.status === "Pending").length)
//     setRejectCounts(mtpPlan.filter((item) => item.status === "Rejected").length)
//   }, [mtpPlan])

//   useEffect(() => {
//     getAllTourPlan()
//   }, [date])

//   const approveMtp = async (id) => {
//     setApproveLoader(true)
//     try {
//       const response = await api.post(`STPMTP/${id}/approve`, {
//         approvedBy: user.id,
//         Description: "string"
//       })
//       getAllTourPlan()
//       toast.success("Mtp approved successfully.")
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setApproveLoader(false)
//     }
//   }


//   const rejectMtp = async (id) => {
//     setRejectLoader(true)
//     try {
//       const response = await api.post(`STPMTP/${id}/reject`, {
//         approvedBy: user.id,
//         Description: "string"
//       })
//       getAllTourPlan()
//       toast.success("Mtp rejected successfully.")
//     } catch (err) {
//       console.log(err)
//     } finally {
//       setRejectLoader(false)
//     }
//   }

//   const renderMTP = () => {
//     switch (activeState) {
//       case "approve":
//         return activeCounts > 0 ? (
//           mtpPlan.filter((plan) => plan.status === "Approved")
//             .map((item, index) => (

//               <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
//                 <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
//                   <span className='text-lg font-semibold'>{item?.stpName}</span>
//                   <span className='text-sm'>STP ID: {item?.stpID || 0} . MTP ID:{item?.mtpID}</span>
//                 </div>
//                 <div className='flex flex-col gap-2'>
//                   <div className='flex gap-2 items-center'>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>MTP Details</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>MTP Date:</span>
//                           <div className='flex items-center gap-2'>
//                             <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
//                             <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
//                           </div>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>is Active:</span>
//                           <span>{item?.isActive ? "Yes" : "No"}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>Creation Information</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created By:</span>
//                           <span className='text-sm'>{item?.insertByName || ""}</span>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created Date:</span>
//                           <span>{FormateDate(item?.insertDate) || "N/A"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className='flex w-full items-center gap-2 rounded-md bg-slate-100 p-2'>
//                     <span className='font-medium'>Reporting To: </span>
//                     <span className='text-neutral-500'>{item?.reportingtoName}</span>
//                   </div>
//                   <div className='flex w-full flex-col gap-1 rounded-md bg-slate-100 p-2'>
//                     <div className='flex items-center gap-2'>
//                       <span>Approved By:</span>
//                       <span className='text-neutral-500'>{item?.approverName}</span>
//                     </div>
//                     <div className='flex items-center gap-1'>
//                       <span>Approved Date:</span>
//                       <span className='text-neutral-500'>{FormateDate(item?.approveDatetime)}</span>
//                     </div>

//                   </div>
//                 </div>
//                 {/* <div className='w-full flex items-center gap-2 justify-center'>
//                  <button className='bg-themeblue w-28 rounded-md p-1.5 text-white'>Approve</button>
//                  <button className='bg-red-500 p-1.5 rounded-md w-28 text-white'>Reject</button>
//               </div> */}
//               </div>

//             ))
//         ) : (
//           <div className="w-full col-span-3  h-full flex justify-center items-center">
//             <div className="flex flex-col gap-1 items-center">
//               <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
//               <span className="text-gray-600 font-medium">
//                 No Approved Tour Plan
//               </span>
//             </div>
//           </div>
//         )

//       case "pending":
//         return pendingCounts > 0 ? (
//           mtpPlan.filter((plan) => plan.status === "Pending").
//             map((item, index) => (

//               <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
//                 <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
//                   <span className='text-lg font-semibold'>{item?.stpName || ""}</span>
//                   <span className='text-sm'>STP ID: {item?.stpID || 0} . MTP ID:{item?.mtpID
//                     || 0}</span>
//                 </div>
//                 <div className='flex flex-col gap-2'>
//                   <div className='flex gap-2 items-center'>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>MTP Details</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>MTP Date:</span>
//                           <div className='flex items-center gap-2'>
//                             <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
//                             <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
//                           </div>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>is Active:</span>
//                           <span>{item?.isActive ? "Yes" : "No"}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>Creation Information</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created By:</span>
//                           <span className='text-sm'>{item?.insertByName || ""}</span>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created Date:</span>
//                           <span>{FormateDate(item?.insertDate) || "N/A"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className='w-full rounded-md bg-slate-100 p-2'>
//                     <span className='font-medium'>Reporting To: </span>
//                     <span className='text-neutral-500'>{item?.reportingtoName}</span>
//                   </div>
//                 </div>
//                 <div className='w-full flex items-center gap-2 justify-center'>
//                   <button disabled={approveLoader} onClick={() => approveMtp(item.mtpID)} className='bg-themeblue disabled:bg-gray-400 w-28 rounded-md p-1.5 text-white'>Approve</button>
//                   <button disabled={rejectLoader} onClick={() => rejectMtp(item.mtpID)} className='bg-red-500 disabled:bg-gray-400 p-1.5 rounded-md w-28 text-white'>Reject</button>
//                 </div>
//               </div>

//             ))
//         ) : (
//           <div className="w-full col-span-3 h-full flex justify-center items-center">
//             <div className="flex flex-col gap-1 items-center">
//               <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
//               <span className="text-gray-600 font-medium">
//                 No Pending Tour Plan
//               </span>
//             </div>
//           </div>
//         )

//       case "rejected":
//         return rejectCounts > 0 ? (
//           mtpPlan.filter((plan) => plan.status === "Rejected").
//             map((item, index) => (

//               <div className='bg-white h-80 p-4 flex flex-col gap-3 rounded-md shadow-sm'>
//                 <div className='bg-neutral-300 flex flex-col p-2 rounded-md'>
//                   <span className='text-lg font-semibold'>{item?.stpName || ""}</span>
//                   <span className='text-sm'>STP ID: {item?.stpID} . MTP ID:{item?.mtpID}</span>
//                 </div>
//                 <div className='flex flex-col gap-2'>
//                   <div className='flex gap-2 items-center'>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>MTP Details</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>MTP Date:</span>
//                           <div className='flex items-center gap-2'>
//                             <span><CalendarCheck2 className='w-4 h-4'></CalendarCheck2> </span>
//                             <span className='text-sm'>{FormateDate(item?.mtpDate)}</span>
//                           </div>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>is Active:</span>
//                           <span>{item?.isActive ? "Yes" : "No"}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='flex flex-col gap-1'>
//                       <span className='text-neutral-600 font-medium'>Creation Information</span>
//                       <div className='p-2 bg-slate-100 rounded-md flex flex-col gap-1'>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created By:</span>
//                           <span className='text-sm'>{item?.insertByName || ""}</span>
//                         </div>
//                         <hr></hr>
//                         <div className='flex items-center gap-2'>
//                           <span className='text-sm'>Created Date:</span>
//                           <span>{FormateDate(item?.insertDate) || "N/A"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className='flex w-full items-center gap-2 rounded-md bg-slate-100 p-2'>
//                     <span className='font-medium'>Reporting To: </span>
//                     <span className='text-neutral-500'>{item?.reportingtoName}</span>
//                   </div>
//                   <div className='flex w-full flex-col gap-1 rounded-md bg-slate-100 p-2'>
//                     <div className='flex items-center gap-2'>
//                       <span>Rejected By:</span>
//                       <span className='text-neutral-500'>{item?.approverName}</span>
//                     </div>
//                     <div className='flex items-center gap-1'>
//                       <span>Rejected Date:</span>
//                       <span className='text-neutral-500'>{FormateDate(item?.approveDatetime)}</span>
//                     </div>

//                   </div>
//                 </div>
//                 {/* <div className='w-full flex items-center gap-2 justify-center'>
//                   <button className='bg-themeblue w-28 rounded-md p-1.5 text-white'>Approve</button>
//                   <button className='bg-red-500 p-1.5 rounded-md w-28 text-white'>Reject</button>
//                </div> */}
//               </div>

//             ))
//         ) : (
//           <div className="w-full col-span-3 h-full flex justify-center items-center">
//             <div className="flex flex-col gap-1 items-center">
//               <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
//               <span className="text-gray-600 font-medium">
//                 No Rejected Tour Plan
//               </span>
//             </div>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className='flex h-full flex-col gap-3 md:gap-4'>
//       <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-gray-600 text-base md:text-lg font-medium">
//             Pending Monthly Tour Plan
//           </h1>
//           <div className="flex items-center gap-2">
//             <span
//               onClick={() => setActiveState("approve")}
//               className={`w-20 ${activeState === "approve"
//                 ? "bg-themeblue text-white"
//                 : "text-gray-600"
//                 } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
//             >
//               Approved
//             </span>
//             <span
//               onClick={() => setActiveState("pending")}
//               className={`w-20 ${activeState === "pending"
//                 ? "bg-themeblue text-white"
//                 : "text-gray-600"
//                 } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
//             >
//               Pending
//             </span>
//             <span
//               onClick={() => setActiveState("rejected")}
//               className={`w-20 ${activeState === "rejected"
//                 ? "bg-themeblue text-white"
//                 : "text-gray-600"
//                 } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
//             >
//               Rejected
//             </span>
//           </div>
//         </div>

//         <div className='relative w-44 border md:p-2 p-1.5 rounded-md'>
//           <span onClick={() => setOpenDate((prev) => !prev)} className='text-center cursor-pointer'>Date: {getDate(date)}</span>
//           {
//             openDate &&
//             <div className='absolute right-0 top-12'>
//               <Calendar onChange={setDate} value={date}></Calendar>
//             </div>
//           }
//         </div>

//       </div>

//       <div className='flex h-full flex-col overflow-scroll gap-4'>
//         {loading ? (
//           <div className="w-full h-full flex justify-center items-center">
//             <img src={Loader} alt="loader" className="w-10 h-10"></img>
//           </div>
//         ) : (
//           <div className='grid gap-4 grid-cols-1 w-full h-full md:grid-cols-3'>
//             {renderMTP()}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default PendingMtp





import React, { useEffect, useState } from "react";
import api from "../api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import { CalendarCheck } from "lucide-react";
import { toast } from "react-toastify";

import NODATA from "../assets/computer.png";
import Loader from "../assets/loader.svg";

/* ---------------- DATE FORMAT ---------------- */
const formatLongDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return "-";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const shortDate = (date) => {
  if (!date) return "--/--/----";
  return new Intl.DateTimeFormat("en-GB").format(new Date(date));
};

const PendingMtp = () => {
  const user = useSelector((state) => state?.auth?.user);

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [view, setView] = useState("card"); // card | table
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMtp, setSelectedMtp] = useState(null);

  /* ---------------- API ---------------- */
  const fetchMtp = async () => {
    try {
      setLoading(true);
      const res = await api.post("/STPMTP/getAllMTPAP");
      setData(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      toast.error("Failed to load MTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMtp();
  }, [date]);

  /* ---------------- ACTIONS ---------------- */
  const approveMtp = async (id) => {
    try {
      setLoading(true);
      await api.post(`/STPMTP/${id}/approve`, {
        approvedBy: user?.id,
        Description: "Approved",
      });
      toast.success("Approved");
      setOpenModal(false);
      fetchMtp();
    } catch {
      toast.error("Failed to approve MTP");
    } finally {
      setLoading(false);
    }

  };

  const rejectMtp = async (id) => {
    try {
      setLoading(true);
      await api.post(`/STPMTP/${id}/reject`, {
        approvedBy: user?.id,
        Description: "Rejected",
      });
      toast.success("Rejected");
      setOpenModal(false);
      fetchMtp();
    }
    catch {
      toast.error("Failed to reject MTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredData = data.filter(
    (item) => item?.status?.toLowerCase() === status.toLowerCase()
  );


  const MtpViewModal = ({ open, onClose, data }) => {
    console.log("Modal Data:", data);
    if (!open || !data) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-[420px] rounded-md shadow-lg relative p-4">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">
              Details for STP ID: {data?.stpID}
            </h3>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm border">
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Date</td>
                <td className="border p-2">{formatLongDate(data?.insertDate)}</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">TOUR</td>
                <td className="border p-2">{data?.stpName}</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Reporting Name</td>
                <td className="border p-2">{data?.reportingtoName}</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Status</td>
                <td className="border p-2">{data?.status || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => approveMtp(data?.mtpID)} className="bg-themeblue text-white px-4 py-1.5 rounded">
              Approved
            </button>
            <button onClick={() => rejectMtp(data?.mtpID)} className="bg-red-500 text-white px-4 py-1.5 rounded">
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  };


  /* ---------------- OLD STYLE CARD ---------------- */
  const MtpCard = ({ item }) => (
    <div className="bg-white p-4 rounded-md shadow-sm flex flex-col gap-3">
      <div className="bg-neutral-300 p-2 rounded-md">
        <p className="font-bold text-sm text-lg line-clamp-1">{item?.stpName}</p>
        <p className="text-sm">
          STP ID: {item?.stpID} · MTP ID: {item?.mtpID}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-100 p-2 rounded-md">
          <p className="font-medium text-sm mb-1">MTP Details</p>
          <p className="text-sm flex items-center gap-1">
            <CalendarCheck size={14} />
            {formatLongDate(item?.mtpDate)}
          </p>
          <p className="text-sm">Active: {item?.isActive ? "Yes" : "No"}</p>
        </div>

        <div className="bg-slate-100 p-2 rounded-md">
          <p className="font-medium text-sm mb-1">Creation Info</p>
          <p className="text-sm">{item?.insertByName}</p>
          <p className="text-sm">{formatLongDate(item?.insertDate)}</p>
        </div>
      </div>

      <div className="bg-slate-100 p-2 rounded-md text-sm">
        Reporting To: {item?.reportingtoName}
      </div>

      {
        status === "Pending" && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => approveMtp(item?.mtpID)}
              className="bg-themeblue w-28 text-white p-1.5 rounded-md"
            >
              Approve
            </button>
            <button
              onClick={() => rejectMtp(item?.mtpID)}
              className="bg-red-500 w-28 text-white p-1.5 rounded-md"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setSelectedMtp(item);
                setOpenModal(true);
              }}
              className="bg-gray-600 w-24 text-white p-1.5 rounded-md"
            >
              View
            </button>
            <button
              disabled
              className="bg-gray-300 w-24 text-gray-500 p-1.5 rounded-md cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        )
      }
    </div >
  );

  /* ---------------- TABLE ---------------- */
  const Table = () => (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">STP</th>
          <th className="border p-2">MTP Date</th>
          <th className="border p-2">Reporting</th>
          <th className="border p-2">Status</th>
          {status === "Pending" && <th className="border p-2">Action</th>}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item) => (
          <tr key={item?.mtpID}>
            <td className="border p-2">{item?.stpName}</td>
            <td className="border p-2">{formatLongDate(item?.mtpDate)}</td>
            <td className="border p-2">{item?.reportingtoName}</td>
            <td className="border p-2">{item?.status}</td>
            {status === "Pending" && (
              <td className="border p-2">
                <div className="flex items-center gap-3">
                  {/* APPROVE */}
                  <button
                    onClick={() => approveMtp(item?.mtpID)}
                    className="border px-3 py-1 rounded hover:bg-green-100"
                    title="Approve"
                  >
                    ✔
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => rejectMtp(item?.mtpID)}
                    className="border px-3 py-1 rounded hover:bg-red-100"
                    title="Reject"
                  >
                    ✖
                  </button>

                  {/* VIEW */}
                  <button
                    onClick={() => {
                      setSelectedMtp(item);
                      setOpenModal(true);
                    }}
                    className="border px-3 py-1 rounded hover:bg-blue-100"
                    title="View"
                  >
                    👁
                  </button>

                  {/* DELETE (DISABLED) */}
                  <button
                    disabled
                    title="Delete disabled"
                    className="border px-3 py-1 rounded text-gray-400 cursor-not-allowed bg-gray-100"
                  >
                    🗑
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-md flex justify-between">
        <div>
          <h2 className="font-semibold">Monthly Tour Plan</h2>

          <div className="flex gap-2 mt-2">
            {["Approved", "Pending", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 border rounded ${status === s ? "bg-themeblue text-white" : ""
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* RADIO BUTTON VIEW SWITCH */}
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={view === "card"}
              onChange={() => setView("card")}
            />
            Card
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={view === "table"}
              onChange={() => setView("table")}
            />
            Table
          </label>

          {/* <div className="relative">
            <span
              onClick={() => setOpenDate(!openDate)}
              className="border px-2 py-1 cursor-pointer"
            >
              {shortDate(date)}
            </span>
            {openDate && (
              <div className="absolute right-0 top-10 z-10 bg-white shadow">
                <Calendar onChange={setDate} value={date} />
              </div>
            )}
          </div> */}
          <div className="relative">
            <span
              onClick={() => setOpenDate((prev) => !prev)}
              className="border px-2 py-1 cursor-pointer"
            >
              {shortDate(date)}
            </span>
            {openDate && (
              <div className="absolute right-0 top-10 z-10 bg-white shadow">
                <Calendar onChange={(d) => { setDate(d); setOpenDate(false); }} value={date} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      {loading ? (
        <div className="flex justify-center">
          <img src={Loader} className="w-8" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center">
          <img src={NODATA} className="w-24" />
          <p>No {status} MTP found</p>
        </div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredData?.map((item) => (
            <MtpCard key={item?.mtpID} item={item} />
          ))}
        </div>
      ) : (
        <Table />
      )}
      <MtpViewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedMtp}
      />
    </div>
  );
};

export default PendingMtp;
