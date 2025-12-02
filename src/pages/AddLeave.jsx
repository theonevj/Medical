import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import api from '../api';
import { toast } from 'react-toastify';

function AddLeave() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    comments: "",
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = async () => {
    if (handleValidate()) {
      console.log("data validated")
      try {
        setLoading(true)
        const response = await api.post(`/Leave`, formData)
        if (response.data.statusCode === "500") {
          toast.error("Leave already added for this date.")
          return
        }
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          comments: "",
        })
        toast.success("Leave added successfully.")
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleValidate = () => {
    let newErrors = {}
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required."
    if (!formData.startDate) newErrors.startDate = "Leave start date is required."
    if (!formData.endDate) newErrors.endDate = "Leave end date is required."
    if (!formData.comments) newErrors.comments = "Comments is required."

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }


  return (
    <div className='flex h-full flex-col gap-3 md:gap-4'>
      <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link to={user.isAdmin ? '/admin/myleaves' : '/employee/myleaves'}><span className='text-gray-600 cursor-pointer'><ArrowBackIosIcon style={{ fontSize: '1.4rem' }}></ArrowBackIosIcon></span></Link>
          <h1 className='text-gray-800 text-base md:text-lg font-medium'>Apply For Leave</h1>
        </div>
      </div>
      <div className='bg-white grid grid-cols-2 gap-x-6 gap-y-6 custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4'>
        <div className='col-span-2 pr-6'>
          <div className='w-1/2 flex flex-col gap-2'>
            <label htmlFor='leaveType' className='font-medium text-gray-600'>Leave Type</label>
            <select value={formData.leaveType} onChange={handleChange} name='leaveType' id='leaveType' className='border outline-none p-2 rounded-md'>
              <option value={''}>--- Select Leave Type ----</option>
              <option value={'Previlage'}>Previlage</option>
              <option value={'Sick'}>Sick</option>
            </select>
            {errors.leaveType && <span className='text-sm text-red-500'>{errors.leaveType}</span>}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='startDate' className='font-medium text-gray-600'>From</label>
          <div className='flex flex-col gap-1'>
            <input value={formData.startDate} onChange={handleChange} name='startDate' id='startDate' type='date' className='p-2 rounded-md border outline-none'></input>
            {errors.startDate && <span className='text-sm text-red-500'>{errors.startDate}</span>}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='endDate' className='font-medium text-gray-600'>To</label>
          <div className='flex flex-col gap-1'>
            <input value={formData.endDate} onChange={handleChange} name='endDate' id='endDate' type='date' className='p-2 rounded-md border outline-none'></input>
            {errors.endDate && <span className='text-red-500 text-sm'>{errors.endDate}</span>}
          </div>
        </div>
        <div className='col-span-2 flex flex-col gap-2'>
          <label htmlFor='comments' className='font-medium text-gray-600'>Comments</label>
          <div className='flex flex-col gap-1'>
            <textarea value={formData.comments} onChange={handleChange} name='comments' id='comments' rows={8} placeholder='Type here leave reason...' className='resize-none p-2 outline-none rounded-md border'></textarea>
            {errors.comments && <span className='text-red-500 text-sm'>{errors.comments}</span>}
          </div>
        </div>
        <div className='col-span-2 flex place-content-end'>
          <div className='flex items-center gap-3'>
            <button disabled={loading} onClick={handleSubmit} className='p-2 w-28 rounded-md bg-themeblue text-white hover:bg-blue-800'>Submit</button>
            <button className='p-2 rounded-md border w-28'>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLeave