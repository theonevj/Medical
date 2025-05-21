import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

//Importing icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AddNewDoc() {
  const [errors,setErrors] = useState({})
  const [loading,setLoading] = useState(false)
  const [headQuater,setHeadQuater] = useState([])
   
  const [formData,setFormData] = useState({
    drName:'',
    drCode:0,
    className:'',
    speciality:'',
    qualification:'',
    gender:'',
    routeName:'',
    addressLine1:'',
    addressLine2:'',
    pinCode:'',
    doctorArea:'',
    vfreq:'',
    mobileNo:'',
    phone:'',
    dob:'',
    isActive:1,
    createdBy:2,
    headquarter:''
  })


  const handleChange = (e) =>{
    const {name, value} = e.target
    setFormData((prevData)=>({...prevData,[name]:value}))
  }

  const validateData = () =>{
    let newErrors = {}
    
    if(!formData.drName) newErrors.drname = "Dr.name is required."
    if(!formData.className) newErrors.class = "Class is required."
    if(!formData.speciality) newErrors.speciality = 'Speciality is required.'
    if(!formData.qualification) newErrors.qualification = 'Qualification is required.'
    if(!formData.phone) newErrors.phone = "Phone is required."
    if(!formData.mobileNo) newErrors.mobileno = "Mobile number is required."
    else if(formData.mobileNo.length!==10) newErrors.mobileno = "Invalid mobile number."
    if(!formData.gender) newErrors.gender = "Gender is required."
    if(!formData.doctorArea) newErrors.doctorArea="Doctor area is required."
    if(!formData.dob) newErrors.dob = "Date of Birth is required."
    if(!formData.routeName) newErrors.routename = "Routename is required."
    if(!formData.addressLine1) newErrors.addressLine1 = "Address Line 1 is required."
    if(!formData.vfreq) newErrors.vfreq="Visiting freq is required."
    if(!formData.addressLine2) newErrors.addressLine2 = "Address Line 2 is required."
    if(!formData.pinCode) newErrors.pincode = "Pincode is required."
    if(!formData.headquarter) newErrors.headQuater = 'Please select headquater.'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
    
  }

  const handleSubmit = async () =>{
    if(validateData()){
     setLoading(true)
     try{
        console.log(formData)
        const response = await api.post(`/Doctor/AddDoctor`,formData)
        console.log(response.data)
        setFormData(
          {
            drName:'',
            drCode:0,
            className:'',
            speciality:'',
            qualification:'',
            gender:'',
            routeName:'',
            addressLine1:'',
            addressLine2:'',
            pinCode:'',
            doctorArea:'',
            vfreq:'',
            mobileNo:'',
            phone:'',
            dob:'',
            isActive:1,
            createdBy:2,
            headquarter:''
          }
        )
        toast.success("Successfully Added.")
     }catch(err){
        console.log(err)
        toast.error("Something went wrong.")
     }finally{
      setLoading(false)
     }
   }
  }

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
 })

  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
      <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
           <Link to={'/admin/doctors'}><span className='text-gray-600 cursor-pointer'><ArrowBackIosIcon style={{fontSize:'1.4rem'}}></ArrowBackIosIcon></span></Link>
           <h1 className='text-gray-800 text-base md:text-lg font-medium'>Add New Doctor</h1>
        </div>
      </div>
      <div className='md:py-6 md:px-4 bg-white rounded-md custom-shadow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-3 px-3'>
         <div className='flex flex-col gap-2'>
             <label htmlFor='drName' className='font-medium text-gray-700'>Dr. Name <span className='text-red-500'>*</span></label>
             <input name='drName' onChange={handleChange} type='text' value={formData.drName} id='drName' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. jode toe'></input>
             {errors.drname && <span className='text-sm text-red-400'>{errors.drname}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='className' className='font-medium text-gray-700'>Class <span className='text-red-500'>*</span></label>
             <input name='className' onChange={handleChange} type='text' value={formData.className} id='className' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. +A'></input>
             {errors.class && <span className='text-sm text-red-400'>{errors.class}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='speciality' className='font-medium text-gray-700'>Speciality <span className='text-red-500'>*</span></label>
             <input name='speciality' onChange={handleChange} type='text' value={formData.speciality} id='speciality' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Ortho'></input>
             {errors.speciality && <span className='text-sm text-red-400'>{errors.speciality}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='qualification' className='font-medium text-gray-700'>Qualification <span className='text-red-500'>*</span></label>
             <input name='qualification' onChange={handleChange} type='text' value={formData.qualification} id='qualification' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. M.D'></input>
             {errors.qualification && <span className='text-sm text-red-400'>{errors.qualification}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='mobileNo' className='font-medium text-gray-700'>Mobile No <span className='text-red-500'>*</span></label>
             <input name='mobileNo' onChange={handleChange} type='number' value={formData.mobileNo} id='mobileNo' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 9878767676'></input>
             {errors.mobileno && <span className='text-sm text-red-400'>{errors.mobileno}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='dob' className='font-medium text-gray-700'>DOB <span className='text-red-500'>*</span></label>
             <input name='dob' onChange={handleChange} type='date' value={formData.dob} id='dob' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.dob && <span className='text-sm text-red-400'>{errors.dob}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='gender' className='font-medium text-gray-700'>Gender <span className='text-red-500'>*</span></label>
             <select name='gender' onChange={handleChange} id='gender' className='p-2 outline-none border-2 border-gray-200' value={formData.gender}>
               <option value={''}>---- Select Gender ----</option>
               <option value={'M'}>Male</option>
               <option value={'F'}>Female</option>
             </select>
             {errors.gender && <span className='text-sm text-red-400'>{errors.gender}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='phone' className='font-medium text-gray-700'>Phone <span className='text-red-500'>*</span></label>
             <input name='phone' onChange={handleChange} type='text' placeholder='Ex. (101) 76223' value={formData.phone} id='phone' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.phone && <span className='text-sm text-red-400'>{errors.phone}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='routeName' className='font-medium text-gray-700'>Route Name <span className='text-red-500'>*</span></label>
             <input name='routeName' onChange={handleChange} type='text' placeholder='Ex. S.g Highway' value={formData.routeName} id='routeName' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.routeName && <span className='text-sm text-red-400'>{errors.routeName}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='addressLine1' className='font-medium text-gray-700'>Addres Line 1<span className='text-red-500'>*</span></label>
             <input name='addressLine1' onChange={handleChange} type='text' placeholder='Ex. 301 - Sham Apartment' value={formData.addressLine1} id='addressLine1' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.addressLine1 && <span className='text-sm text-red-400'>{errors.addressLine1}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='addressLine2' className='font-medium text-gray-700'>Address Line 2 <span className='text-red-500'>*</span></label>
             <input name='addressLine2' onChange={handleChange} type='text' placeholder='Ex. Home Science Road..' value={formData.addressLine2} id='address' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.addressLine2 && <span className='text-sm text-red-400'>{errors.addressLine2}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='pinCode' className='font-medium text-gray-700'>Pincode <span className='text-red-500'>*</span></label>
             <input name='pinCode' onChange={handleChange} type='text' placeholder='Ex. 534232' value={formData.pinCode} id='pinCode' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.pincode && <span className='text-sm text-red-400'>{errors.pincode}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='doctorArea' className='font-medium text-gray-700'>Doctor Area <span className='text-red-500'>*</span></label>
             <input name='doctorArea' onChange={handleChange} type='text' placeholder='Ex. Nehrunagar' value={formData.doctorArea} id='doctorArea' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.doctorArea && <span className='text-sm text-red-400'>{errors.doctorArea}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='vfreq' className='font-medium text-gray-700'>Visiting Freq <span className='text-red-500'>*</span></label>
             <input name='vfreq' onChange={handleChange} type='text' placeholder='Ex. 2' value={formData.vfreq} id='vfreq' className='p-2 outline-none border-b-2 border-gray-200'></input>
             {errors.vfreq && <span className='text-sm text-red-400'>{errors.vfreq}</span>}
         </div>
         <div className='flex flex-col gap-2'>
             <label htmlFor='headquarter' className='font-medium text-gray-700'>HeadQuater <span className='text-red-500'>*</span></label>
             <select name='headquarter' id='headquarter' value={formData.headquarter} onChange={handleChange} className='border-2 border-gray-200 p-2 outline-none'>
               <option value={''}>--- Select Headquarters ---</option>
               {
                headQuater.map((hd)=>(
                  <option value={hd.hqid}>{hd.hqName}</option>                  
                ))
               }
             </select>
             {errors.headquarter && <span className='text-sm text-red-500'>{errors.headquarter}</span>}
         </div>
      </div>
       <div className='flex place-content-end bg-white custom-shadow rounded-md py-3 px-3 md:py-4 md:px-4'>
            <button 
            disabled={loading}
            onClick={handleSubmit} 
            className={` p-2 w-28 flex justify-center items-center text-white rounded-md  ${loading?"bg-gray-400 cursor-not-allowed":"bg-themeblue hover:bg-blue-800"}`}>
              {loading && (
                <svg
                  className="w-5 h-5 animate-spin mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Loading..." : "Add Doctor"}
            </button>
       </div>
    </div>
  )
}
