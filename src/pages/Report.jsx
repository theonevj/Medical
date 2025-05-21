import api from '../api'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


//Importing all columns
import { getDoctorReport } from '../data/doctorsDataTable';
import { getChemistReport } from '../data/chemistDataTable'
import { getUserReport } from '../data/EmployeeDataTable'
import { getProductReport } from '../data/productDataTable';

import { LoaderCircle } from 'lucide-react';

const exportToExcel = (data, fileName = "Data") => {
   const worksheet = XLSX.utils.json_to_sheet(data);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
 
   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
   const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
   saveAs(fileData, `${fileName}.xlsx`);
 };


 const getDataType = (userType) =>{
    switch(userType){
      case "DoctorList":
         return getDoctorReport
      
      case "ChemistList":
         return getChemistReport

      case "EMList":
         return getUserReport

      case "ProductList":
         return getProductReport

      default:
         return []
    }
 }


function Report() {
  const [reportData,setReportData] = useState([])
  const [HeadQuater,setHeadQuater] = useState([])
  const [reportType,setReportType] = useState(null)
  const [fromDate,setFromDate] = useState(null)
  const [toDate,setToDate] = useState(null)
  const [selectedHeadQuater,setSelectedHeadQuater] = useState(null)
  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})
  const [users,setUsers] = useState([])
  const [selectedUser,setSelectedUser] = useState(null)
  
  const fetchHeadQuaterData = async ()=>{
       try{
          const response = await api.get('/Headquarters')
          setHeadQuater(response.data)
       }catch(err){
        console.log(err)
       }
  }

  useEffect(()=>{
      fetchHeadQuaterData()
  },[])


  const validateData = () =>{
     let newErrors = {}

     if(!selectedHeadQuater) newErrors.HeadQuater = 'Please select headquater.'
     if(!fromDate) newErrors.fromDate = 'Please select from date.'
     if(!reportType) newErrors.reportType = 'Please select report type.'

     setErrors(newErrors)

     return Object.keys(newErrors).length===0
  } 

  const fetchReport = async () =>{
   if(validateData()){
      setLoading(true)
     try{
      console.log('selected user----->',selectedUser)
      const response = await api.get(`/Report/Report?ReportType=${reportType}&HQ=${selectedHeadQuater}&fromDate=${fromDate}&userid=${selectedUser}`)
      let data = response.data.data
      setReportData(data.map((item,index) => ({...item,id:index+1})))
     }catch(err){
      console.log(err)
     }finally{
      setLoading(false)
     }
   }
  }

  useEffect(()=>{
   const fetchUser = async () =>{
      try{
         const response =await api.get('/User/GetUserReport')
         setUsers(response.data.data)
      }catch(err){
         console.log(err)
      }
   }

   fetchUser()
  },[])

  useEffect(()=>{
   if(selectedHeadQuater && fromDate){
      fetchReport()
   }
  },[reportType])

  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
     <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between'>
       <h1 className='text-gray-600 text-base md:text-lg font-medium'>Report</h1>
       <button disabled={reportData.length===0} onClick={()=>exportToExcel(reportData,reportType)} className='text-white w-32 disabled:cursor-not-allowed disabled:bg-gray-400 flex justify-center items-center p-2 font-medium rounded-md bg-themeblue'>Download</button>
     </div>
     
     <div className='bg-white p-4 custom-shadow rounded-md flex flex-col gap-4'>
       <h1 className='text-lg font-medium'>Report Details</h1>
       <div className='grid md:grid-cols-2 grid-cols-1 gap-4 items-center'>
          <div className='flex flex-col gap-1'>
             <label>Report Type <span className='text-sm text-red-500'>*</span></label>
             <select value={reportType} onChange={(e)=>setReportType(e.target.value)} className='p-2 outline-none border rounded-md border-neutral-400'>
                <option value={''}>--- Select Report Type ---</option>
                <option value={"DoctorList"}>DoctorList</option>
                <option value={"ChemistList"}>ChemistList</option>
                <option value={"EMList"}>EMPList</option>
                <option value={"ProductList"}>ProductList</option>
                <option value={"DoctorMappingList"}>DoctorMappingList</option>
             </select>
             {errors.reportType && <span className='text-sm text-red-500'>{errors.reportType}</span>}
          </div>
          <div className='flex flex-col gap-1'>
             <label>HeadQuater <span className='text-sm text-red-500'>*</span></label>
             <select value={selectedHeadQuater} onChange={(e)=>setSelectedHeadQuater(e.target.value)} className='p-2 outline-none border rounded-md border-neutral-400'>
                <option value={''}>--- Select HeadQuater ---</option>
                {
                  HeadQuater.map((item,index)=>(
                    <option key={index} value={item.hqid}>{item.hqName}</option>
                  ))
                }
             </select>
             {errors.HeadQuater && <span className='text-sm text-red-500'>{errors.HeadQuater}</span>}
          </div>
          <div className='flex flex-col gap-1'>
             <label>From Date</label>
             <input value={fromDate} onChange={(e)=>setFromDate(e.target.value)} type='date' className='p-2 outline-none border rounded-md border-neutral-400'></input>
             {errors.fromDate && <span className='text-sm text-red-500'>{errors.fromDate}</span>}
          </div>

          <div className='flex flex-col gap-1'>
             <label>To Date</label>
             <input value={toDate} onChange={(e)=>setToDate(e.target.value)} type='date' className='p-2 outline-none border rounded-md border-neutral-400'></input>
          </div>

          <div className='flex flex-col gap-1'>
             <label>User</label>
             <select value={selectedUser} onChange={(e)=>setSelectedUser(e.target.value)} className='p-2 outline-none border rounded-md border-neutral-400'>
               <option value={''}>--- Select User ---</option>
               {
                  users.map((item)=>(
                     <option value={item.codeID}>{item.codeName}</option>
                  ))
               }
             </select>
          </div>
       </div>
       <div className='w-full  flex justify-center items-center'>
         <button onClick={fetchReport} className='text-white w-36 flex justify-center items-center p-2 font-medium rounded-md bg-themeblue'>
         {
            loading ? 
            <LoaderCircle className="animate-spin"></LoaderCircle>
            :<span>Get Report</span>
         }
         </button>
       </div>
     </div>

     <div className=''>
        {
          reportData.length > 0 &&
          (
          <Box sx={{height:"100%",
          '& .super-app-theme--header': {
            backgroundColor: '#edf3fd',
          },}}>
           <DataGrid
            rows={reportData}
            columns={getDataType(reportType)}
            loading={loading}
            initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
           }}
           pageSizeOptions={[5,10]}
           disableRowSelectionOnClick
          />
         </Box>
         )
        }
      </div>
    </div>
  )
}

export default Report