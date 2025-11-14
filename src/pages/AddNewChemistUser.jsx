import React, { useEffect, useState } from 'react'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import api from '../api';

export default function AddNewChemistUser() {
    const { user } = useSelector((state) => state.auth);
    const [errors, setErrors] = useState({})
    const [headquarterName, setHeadquarterName] = useState('');

    const [formData, setFormData] = useState({
        chemistCode: 0,
        chemistName: '',
        gender: '',
        email: '',
        mobileNo: '',
        addressLine1: '',
        addressLine2: '',
        pinCode: '',
        routeName: '',
        chemistArea: '',
        phone: '',
        contactPerson: '',
        vfreq: '',
        dob: '',
        chemistType: '',
        isActive: 1,
        createdBy: 0,
        headquarter: ''
    })
    const [headQuater, setHeadQuater] = useState([])

    const validateData = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let newErrors = {}

        if (!formData.chemistName) newErrors.chemistName = 'Pleaes enter chemist name.'
        if (!formData.gender) newErrors.gender = "Please select gender."
        if (!formData.email) newErrors.email = "Please enter email address."
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address."
        if (!formData.mobileNo) newErrors.mobileNo = 'Please enter mobile no.'
        else if (formData.mobileNo.length !== 10) newErrors.mobileNo = "Invlalid mobile no."
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required.'
        if (!formData.addressLine2) newErrors.addressLine2 = 'Address Line 2 is required.'
        if (!formData.pinCode) newErrors.pinCode = 'Please enter pincode.'
        if (!formData.routeName) newErrors.routeName = 'Please enter route name.'
        if (!formData.chemistArea) newErrors.chemistArea = 'Please enter chemist area.'
        if (!formData.contactPerson) newErrors.contactPerson = 'Please enter contact person name.'
        if (!formData.vfreq) newErrors.vfreq = 'Pleaes enter visit frequency.'
        if (!formData.dob) newErrors.dob = 'Please enter dob.'
        if (!formData.chemistType) newErrors.chemistType = "Please enter chemist type."
        if (!formData.headquarter) newErrors.headQuater = "Please select headquater."

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    useEffect(() => {
        if (user?.headQuater && !formData.headquarter) {
            setFormData((prev) => ({
                ...prev,
                headquarter: user.headQuater,
            }));
        }
    }, [user, formData.headquarter, setFormData]);

    const fetchHeadquater = async () => {
        try {
            const response = await api.get('/Headquarters')
            setHeadQuater(response.data)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message || "Something went wrong.")
        }
    }


    const handleSubmit = async () => {
        if (validateData()) {
            try {
                await api.post(`/Chemist/AddChemist`, formData)
                setFormData({
                    chemistCode: 0,
                    chemistName: '',
                    gender: '',
                    email: '',
                    mobileNo: '',
                    addressLine1: '',
                    addressLine2: '',
                    pinCode: '',
                    routeName: '',
                    chemistArea: '',
                    phone: '',
                    contactPerson: '',
                    vfreq: '',
                    dob: '',
                    chemistType: '',
                    isActive: 1,
                    createdBy: 0,
                    headquarter: ''
                })
                toast.success("Chemist Details Added.")
            } catch (err) {
                toast.error("Something went wrong.")
                console.log(err)
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        fetchHeadquater()
    }, [])

    useEffect(() => {
        if (user && headQuater.length > 0) {
            const selectedHQ = headQuater.find(
                (hq) => Number(hq?.hqid) === Number(user?.headQuater)
            );
            const headquarterName = selectedHQ ? selectedHQ.hqName : "Unknown";
            setHeadquarterName(headquarterName);
        }
    }, [user, headQuater?.length]);

    return (
        <div className='flex h-full flex-col gap-3 md:gap-4'>
            <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Link to={user.isAdmin ? '/admin/chemists' : "/employee/chemists"}><span className='text-gray-600 cursor-pointer'><ArrowBackIosIcon style={{ fontSize: '1.4rem' }}></ArrowBackIosIcon></span></Link>
                    <h1 className='text-gray-800 text-base md:text-lg font-medium'>Add New Chemist</h1>
                </div>
            </div>
            <div className='md:py-6 md:px-4 bg-white rounded-md custom-shadow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-3 px-3'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='chemistName' className='font-medium text-gray-700'>Chemist Name <span className='text-red-500'>*</span></label>
                    <input value={formData.chemistName} onChange={handleChange} name='chemistName' type='text' id='chemistName' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. jode toe'></input>
                    {errors.chemistName && <span className='text-sm text-red-500'>{errors.chemistName}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='font-medium text-gray-700'>Email <span className='text-red-500'>*</span></label>
                    <input value={formData.email} onChange={handleChange} name='email' type='email' id='email' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. test@example.com'></input>
                    {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='mobileNo' className='font-medium text-gray-700'>Mobile No <span className='text-red-500'>*</span></label>
                    <input value={formData.mobileNo} onChange={handleChange} name='mobileNo' type='text' id='mobileNo' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 73653...'></input>
                    {errors.mobileNo && <span className='text-sm text-red-500'>{errors.mobileNo}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='gender' className='font-medium text-gray-700'>Gender <span className='text-red-500'>*</span> </label>
                    <select value={formData.gender} onChange={handleChange} name='gender' className='p-2 outline-none border-2 border-gray-200' id='gender'>
                        <option value={""}>--- Select Gender ---</option>
                        <option value={'M'}>Male</option>
                        <option value={"F"}>Female</option>
                    </select>
                    {
                        errors.gender && <span className='text-sm text-red-500'>{errors.gender}</span>
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='addressLine1' className='font-medium text-gray-700'>Address Line 1 <span className='text-red-500'>*</span></label>
                    <input value={formData.addressLine1} onChange={handleChange} name='addressLine1' type='text' id='addressLine1' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 402 - Tax'></input>
                    {errors.addressLine1 && <span className='text-sm text-red-500'>{errors.addressLine1}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='addressLine2' className='font-medium text-gray-700'>Address Line 2 </label>
                    <input value={formData.addressLine2} onChange={handleChange} name='addressLine2' type='text' id='addressLine2' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Near Simahall'></input>
                    {errors.addressLine2 && <span className='text-sm text-red-500'>{errors.addressLine2}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='pinCode' className='font-medium text-gray-700'>Pincode <span className='text-red-500'>*</span></label>
                    <input value={formData.pinCode} onChange={handleChange} name='pinCode' type='text' id='pinCode' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 762522'></input>
                    {errors.pinCode && <span className='text-sm text-red-500'>{errors.pinCode}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='routeName' className='font-medium text-gray-700'>Route name <span className='text-red-500'>*</span></label>
                    <input value={formData.routeName} onChange={handleChange} name='routeName' type='text' id='routeName' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Jabalpur'></input>
                    {errors.routeName && <span className='text-sm text-red-500'>{errors.routeName}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='chemistArea' className='font-medium text-gray-700'>Chemist Area <span className='text-red-500'>*</span></label>
                    <input value={formData.chemistArea} onChange={handleChange} name='chemistArea' type='text' id='chemistArea' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Jabalpur'></input>
                    {errors.chemistArea && <span className='text-sm text-red-500'>{errors.chemistArea}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='phone' className='font-medium text-gray-700'>Phone </label>
                    <input value={formData.phone} onChange={handleChange} name='phone' type='text' id='phone' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 87252...'></input>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='contactPerson' className='font-medium text-gray-700'>Contact Person <span className='text-red-500'>*</span></label>
                    <input value={formData.contactPerson} onChange={handleChange} name='contactPerson' type='text' id='contactPerson' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Tom Jode'></input>
                    {errors.contactPerson && <span className='text-sm text-red-500'>{errors.contactPerson}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='vfreq' className='font-medium text-gray-700'>Visit Frequency <span className='text-red-500'>*</span></label>
                    <input value={formData.vfreq} onChange={handleChange} name='vfreq' type='number' id='vfreq' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. 3'></input>
                    {errors.vfreq && <span className='text-sm text-red-500'>{errors.vfreq}</span>}
                </div>
                {/* <div className='flex flex-col gap-2'>
                    <label htmlFor='headquarter' className='font-medium text-gray-700'>HeadQuater <span className='text-red-500'>*</span></label>
                    <select name='headquarter' onChange={handleChange} value={formData.headquarter} id='headquarter' className='border-2 border-gray-200 p-2 outline-none'>
                        <option value={''}>--- Select Headquarters ---</option>
                        {
                            headQuater.map((hd) => (
                                <option value={hd.hqid}>{hd.hqName}</option>
                            ))
                        }
                    </select>
                    {
                        errors.headquarter && <span className='text-sm text-red-500'>{errors.headquarter}</span>
                    }
                </div> */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='headquarter' className='font-medium text-gray-700'>
                        HeadQuater <span className='text-red-500'>*</span>
                    </label>

                    {
                        user?.headQuater &&
                        <div className="p-2 border-2 border-gray-200 bg-gray-50 rounded">
                            {headquarterName}
                        </div>
                    }
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='dob' className='font-medium text-gray-700'>Date of Birth <span className='text-red-500'>*</span></label>
                    <input value={formData.dob} onChange={handleChange} name='dob' type='date' id='dob' className='p-2 outline-none border-b-2 border-gray-200'></input>
                    {errors.dob && <span className='text-sm text-red-500'>{errors.dob}</span>}
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='chemistType' className='font-medium text-gray-700'>Chemist Type <span className='text-red-500'>*</span></label>
                    <input value={formData.chemistType} onChange={handleChange} name='chemistType' type='text' id='chemistType' className='p-2 outline-none border-b-2 border-gray-200' placeholder='Ex. Bio'></input>
                    {errors.chemistType && <span className='text-sm text-red-500'>{errors.chemistType}</span>}
                </div>
            </div>
            <div className='flex place-content-end bg-white custom-shadow rounded-md py-3 px-3 md:py-4 md:px-4'>
                <button onClick={handleSubmit} className='bg-themeblue p-2 text-white rounded-md hover:bg-blue-800'>Add Chemist</button>
            </div>
        </div>
    )
}
