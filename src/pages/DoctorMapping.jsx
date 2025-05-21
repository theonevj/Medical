import React, {useState, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

//importing icons
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { LoaderCircle } from 'lucide-react';

import { docMapColumn, getDoctors } from '../data/doctorsDataTable';
import { empMapColumns, fetchAllUsers } from '../data/EmployeeDataTable';
import api from '../api';

const prepareObj = (doctorList, employee) => 
    doctorList.map(doctor => ({ doctorCode:doctor.drCode, employeeCode:employee.id }))
  


function DoctorMapping() {
  const { user } = useSelector((state) => state.auth);

  const [loading,setLoading] = useState(false)
  const [saveLoader,setSaveLoader] = useState(false)
  const [users,setUsers] = useState([])
  const [filterUsers,setFilterUsers] = useState([])
  const [doctor,setDoctor] = useState([])
  const [filterDoctor,setFilterDoctor] = useState([])
  const [selectedDoctor,setSelectedDoctor] = useState([])
  const [selectedEmployee,setSelectedEmployee] = useState(null)
  const [selectedEmpIdx,setSelectedEmpIdx] = useState([])
  const [selctedDocIdx,setSelectedDocIdx] = useState([])

  const [headQuater,setHeadQuater] = useState([])
  const [selectedHeadQuater,setSelectedHeadQuater] = useState('')


  const fetchHeadQuater = async () =>{
      try{
        const response = await api.get('Headquarters')
        setHeadQuater(response.data)
      }catch(err){
        console.log(err)
      }
  }
  
  //Get employee mapping data with doctor
  const getEmpDoctorChemistMapping = async () =>{
    try{
      const response = await api.get(`/DoctorMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`)
      let data = response.data.data.result
      setSelectedDocIdx(data.map((item)=> item.drCode))
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(selectedEmpIdx.length > 0){
      getEmpDoctorChemistMapping()
    }
  },[selectedEmpIdx])

  //Fetch data for get all employees 
 const fetchData = async ()=>{
  setLoading(true)
  try{
     const users = await fetchAllUsers()
     setUsers(users)
  }catch(err){
    console.log(err)
    toast.error("Something went wrong while fetching data.")
  }finally{
    setLoading(false)
  }
}

//Fetch data for get all doctors 
const fetchAllDoctors = async ()=>{
  setLoading(true)
  try{
    const data = await getDoctors()
    if(data){
      setDoctor(data.map((item)=>({...item,id:item.drCode})))
    }
  }catch(err){
    console.log(err)
    toast.error("Something went wrong while fetchig doctor data.")
  }finally{
    setLoading(false)
  }
}


useEffect(()=>{
  if(selectedHeadQuater){
      setFilterDoctor(doctor.filter((item)=>Number(item.headquarter) == selectedHeadQuater))
      setFilterUsers(users.filter((item)=>Number(item.headQuater) == selectedHeadQuater))
  }else{
    setFilterDoctor(doctor)
    setFilterUsers(users)
  }
},[selectedHeadQuater,doctor,users])



const fetchAllData = () =>{
   fetchAllDoctors()
   fetchData()
   fetchHeadQuater()
}

useEffect(()=>{
  fetchAllData()
},[])

const handleSelectDoctors = (newDoctor) =>{
  setSelectedDocIdx(newDoctor)
  setSelectedDoctor(doctor.filter((item,index)=> newDoctor.includes(index+1)))
}  

 
const handleSelectEmployee = (newEmployee) => {
  setSelectedEmpIdx(newEmployee)
  setSelectedEmployee(users.find((item, index) => item.id === newEmployee[0]));
};


const handleSave = async () =>{
  let mappingObj ={
   doctorMappingList:prepareObj(selectedDoctor,selectedEmployee),
   employeeCode:user.id,
   drCode:0,
   isActive:1,
   createdBy:0
  }
  console.log(mappingObj)
  try{
    setSaveLoader(true)
    await api.post('/DoctorMapping/AddDoctorMapping',mappingObj)
    setSelectedDoctor([])
    setSelectedEmployee([])
    setSelectedEmpIdx([])
    setSelectedDocIdx([])
    toast.success("New Doctors mapping created successfully.")
  }catch(err){
   console.log(err)
   toast.error("Something went wrong.")
  } finally{
   setSaveLoader(false)
  }
}

  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
    <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
     <h1 className="text-gray-600 text-base md:text-lg font-medium">
       Doctor Mapping
     </h1>
     <div className="flex items-center gap-3">
         <div className='flex items-center gap-2'>
             <span>HeadQuater:</span>
             <select onChange={(e)=>setSelectedHeadQuater(e.target.value)} className='rounded-md border-neutral-200 border p-1 outline-none'>
                <option value=''>All Headquater</option>
                {
                  headQuater.map((item)=>(
                    <option value={item.hqid}>{item.hqName}</option>
                  ))
                }
             </select>
          </div>
       <span onClick={()=>fetchAllData} className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md">
         <AutorenewIcon></AutorenewIcon>
       </span>
     </div>
   </div>
   <div className='h-auto grid md:grid-cols-2 grid-cols-1 items-center gap-2'>
      
      <div className='h-full py-4 px-3 custom-shadow rounded-md bg-white'>
      <h1 className='mb-2 font-medium text-lg'>Employee</h1>
      <Box
       sx={{
         height: "95%",
       }}
     >
       <DataGrid
         rows={filterUsers}
         columns={empMapColumns}
         loading={loading}
         initialState={{
           pagination: {
             paginationModel: {
               pageSize: 5,
             },
           },
         }}
         pageSizeOptions={[5,10]}
         sx={{
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#c8e6c9', // light green
            color: '#2e7d32', // darker green text
          },
        }}
        //  checkboxSelection
         rowSelectionModel={selectedEmpIdx}
         onRowSelectionModelChange={(newSelected) => {
          // Allow only one selection
          const selected = Array.isArray(newSelected) ? newSelected[0] : newSelected;
          handleSelectEmployee(selected ? [selected] : []);
        }}
       />
      </Box>
      </div>
      <div className='h-full py-4 px-3 custom-shadow rounded-md bg-white'>
      <h1 className='mb-2 font-medium text-lg'>Doctors</h1>
      <Box
       sx={{
         height: "95%",
       }}
     >
       <DataGrid
         rows={filterDoctor}
         columns={docMapColumn}
         loading={loading}
         initialState={{
           pagination: {
             paginationModel: {
               pageSize: 5,
             },
           },
         }}
         pageSizeOptions={[5,10]}
         checkboxSelection
         rowSelectionModel={selctedDocIdx}
         onRowSelectionModelChange={(newSelected)=>handleSelectDoctors(newSelected)}
       />
      </Box>
      </div>
   </div>
   <div className='flex place-content-center  items-center rounded-md custom-shadow p-2 bg-white'>
         <button disabled={selectedDoctor.length===0 || selectedEmployee.length===0} onClick={handleSave} className={`bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-24 p-1`}>
           {
             saveLoader ? (
               <div className='flex items-center gap-2'>
                 <LoaderCircle className='animate-spin'></LoaderCircle>
                 Loading..
               </div>
             ) : (
               <span>Save</span>
             )
           }
         </button>
      </div>
 </div>
  )
}

export default DoctorMapping