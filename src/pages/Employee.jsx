import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import api from '../api';
import { useSelector } from 'react-redux';

//importing data
import { columns , empColumns, fetchAllUsers } from '../data/EmployeeDataTable';

//Importing icons
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';


export default function Employee() {
  const { user } = useSelector((state) => state.auth);
  const [searchQuery,setSearchQuery] = useState('')
  const [filteredData,setFilteredData] = useState([])
  const navigate = useNavigate()
  const [users,setUsers] = useState([])
  const [loader,setLoader] = useState(false)

  const [openConfirmPopUp,setOpenConfirmPopUp] = useState(false)
  const [selectedId , setSelectedId] = useState(null)

  const fetchData = async ()=>{
    setLoader(true)
    try{
       const users = await fetchAllUsers()
       setUsers(users.map((item,index)=>({...item,srno:index+1})))
    }catch(err){
      console.log(err)
      toast.error("Something went wrong while fetching data.")
    }finally{
      setLoader(false)
    }
  }
  useEffect(()=>{
    if(searchQuery){
      setFilteredData(()=>users.filter((emp)=>(emp.firstName+emp.lastName).toLowerCase().includes(searchQuery.trim().toLowerCase())))
    }else{
      setFilteredData(users)
    }
  },[searchQuery,users])

  const handleNavigateToEdit = (data)=>{
      console.log(data)
      navigate(user.isAdmin?'/admin/employee/edit':'/employee/user/edit',{state:data})
  }

  useEffect(()=>{
    fetchData()
  },[])

  const handleNavigateToPreview = (data) =>{
    navigate(user.isAdmin?'/admin/employee/preview':"/employee/user/preview",{state:data})
  }

  const handleOpenConfirmPopUp = (data) =>{
    setSelectedId(data.id)
    setOpenConfirmPopUp(true)
  }

  const handleCloseConfirmPopUp = () =>{
    setSelectedId(null)
    setOpenConfirmPopUp(false)
  }

  const handleRemoveEmployee = async () =>{
    if(selectedId){
      try{
        await api.post(`/User/DeleteUser?id=${selectedId}`)
        fetchData()
        handleCloseConfirmPopUp()
        toast.success("Employee deleted successfully.")
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }
    }
  }

  let filterColumns = (user.isAdmin)?columns:empColumns


  return (
  <>
     {
      openConfirmPopUp && (
       <div className="fixed z-50 flex justify-center items-center inset-0 bg-black/50">
        <div className="bg-white w-96 rounded-md p-4 flex flex-col">
          <h1 className="font-medium text-lg">Confirmation</h1>
          <span>Are you sure to remove this employee?</span>
          <div className="w-full mt-4 flex place-content-end gap-2">
             <button onClick={handleCloseConfirmPopUp} className="font-medium text-white rounded-md p-1 w-20 bg-blue-500 hover:bg-blue-600">Cancel</button>
             <button onClick={handleRemoveEmployee} className="font-medium text-white rounded-md p-1 w-20 bg-red-500 hover:bg-red-600">Remove</button>
          </div>
         </div>
       </div>
      )
     }
    <div className='flex h-full flex-col gap-3 md:gap-4'>
       <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between'>
         <h1 className='text-gray-600 text-base md:text-lg font-medium'>Employee Details</h1>
         <div className='flex items-center gap-3'>
           <div className='bg-gray-100 p-1.5 md:flex hidden rounded-md gap-1 items-center'>
            <span><SearchIcon></SearchIcon></span>
            <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='outline-none bg-transparent' placeholder='Search Employee...' type='text'></input>
           </div>
           <span onClick={fetchData} className='cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md'><AutorenewIcon></AutorenewIcon></span>
           <Link to={user.isAdmin?'/admin/employee/addnew':'/employee/myteam/addnew'}><button className='md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md'>Add New Employee</button></Link>
         </div>
       </div>
       <div className='h-full py-4 px-3 custom-shadow rounded-md bg-white'>
         <Box sx={{height:"100%",
          '& .super-app-theme--header': {
            backgroundColor: '#edf3fd',
          },}}>
           <DataGrid
            rows={filteredData}
            columns={filterColumns(handleNavigateToEdit,handleOpenConfirmPopUp,handleNavigateToPreview)}
            loading={loader}
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
       </div>
    </div>
  </>
  )
}
