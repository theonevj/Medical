
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useSelector } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//importing images
import Loader from '../assets/loader.svg'

//Importing icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import { X } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';

import { toast } from 'react-toastify'


function ReportingPlan() {
    const { user } = useSelector((state) => state.auth);
    const [userDetails, setUserDetails] = useState(null)
    const [mtpPlan, setMtpPlan] = useState([])
    const [filterMtpPlan, setFilterMtpPlan] = useState([])
    const [mtpDetails, setMtpDetails] = useState([])
    const [openPopUp, setOpenPopUp] = useState(false)
    const [mtpLoader, setMtpLoader] = useState(false)

    const [loading, setLoading] = useState(false)
    const [openDate, setOpenDate] = useState(false)

    const [mtpType, setMtpType] = useState(0)

    const [date, setDate] = useState(new Date())
    const [viewMode, setViewMode] = useState("card");

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

    const getShortName = (name) => {
        if (!name) return ''

        return name.split(' ').map((char) => char.charAt(0).toUpperCase()).join('')
    }


    const getAllTourPlan = async () => {
        try {
            setLoading(true)
            const response = await api.post(`/STPMTP/getMTP`,
                {
                    mtpDate: date
                })

            console.log("response.data Reporting", response.data)
            setUserDetails(response.data?.data?.userDetails)
            setMtpPlan(response.data?.data?.mtpdetails)

        } catch (err) {
            console.log(err)
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllTourPlan()
    }, [date])


    useEffect(() => {
        setFilterMtpPlan(() => mtpPlan.filter(item => item.mtpType === mtpType))
    }, [mtpType, mtpPlan])


    const fetchMTPDetails = async (id) => {
        setMtpLoader(true)
        try {
            setOpenPopUp(true)
            const response = await api.post(`/STPMTP/GetAllById?id=${Number(id)}`)
            setMtpDetails(response.data.data.mtpdetails)
        } catch (err) {
            toast.error("Something went wrong.")
        } finally {
            setMtpLoader(false)
        }
    }

    return (
        <div className='flex h-full flex-col gap-3 md:gap-4'>
            {openPopUp && (
                <div className="absolute z-50 inset-0 flex justify-center items-center">
                    <div className="w-5/6 z-50 h-5/6 rounded-md overflow-hidden shadow-sm bg-white border">
                        <div className="flex bg-themeblue text-white p-4 border-b border-neutral-200 justify-between items-center">
                            <h1 className="font-medium text-lg">MTP Details</h1>
                            <button
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setOpenPopUp(false)}
                            >
                                <X></X>
                            </button>
                        </div>
                        <div className="h-full overflow-auto bg-neutral-100 p-2">
                            {mtpLoader ? (
                                <div className="flex justify-center items-center w-full h-full">
                                    <LoaderCircle className="animate-spin"></LoaderCircle>
                                </div>
                            ) : (
                                mtpDetails.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 mb-2  md:grid-cols-3 bg-white shadow-sm p-2 rounded-md items-center gap-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Doctor:</span>
                                            <span className="text-neutral-600">
                                                {item?.drName || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Speciality</span>
                                            <span className="text-neutral-600">
                                                {item?.speciality || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Qualification</span>
                                            <span className="text-neutral-600">
                                                {item?.qualification || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">MTP Date</span>
                                            <span className="text-neutral-600">
                                                {item?.mtpdate || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Doctor Area</span>
                                            <span className="text-neutral-600">
                                                {item?.doctorArea || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Products</span>
                                            <span className="text-neutral-600">
                                                {item?.products}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">

                <div className="flex flex-col gap-2">
                    <h1 className="text-gray-600 text-base md:text-lg font-medium">
                        Monthly Tour Plan
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2 '>
                                <span className='font-medium'>MTP:</span>
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <input
                                            onChange={() => setMtpType(0)}
                                            checked={mtpType === 0}
                                            type='radio'
                                        />
                                        <span className='text-sm'>Planned</span>
                                    </div>
                                    {/* <div className='flex items-center gap-1'>
                                        <input
                                            onChange={() => setMtpType(1)}
                                            checked={mtpType === 1}
                                            type='radio'
                                        />
                                        <span className='text-sm'>Reporting</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className='relative w-44 border md:p-2 p-1.5 rounded-md'>
                            <span onClick={() => setOpenDate((prev) => !prev)} className='text-center cursor-pointer'>
                                Date: {getDate(date)}
                            </span>
                            {openDate && (
                                <div className='absolute bg-white border rounded-md -right-4 shadow p-4 top-12'>
                                    <DatePicker
                                        selected={date}
                                        onChange={(date) => setDate(new Date(date))}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                    />
                                </div>
                            )}
                        </div>
                        <Link
                            to={user.isAdmin ? "/admin/mtpplan/add" : "/employee/mtpplan/add"}
                        >
                            <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
                                Add Tour Plan
                            </button>
                        </Link>
                    </>

                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-1 border rounded ${viewMode === "card" && "bg-[#14b8a6] text-white"
                        }`}
                >
                    Card
                </button>
                <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 border rounded ${viewMode === "table" && "bg-[#14b8a6] text-white"
                        }`}
                >
                    Table
                </button>
            </div>

            <div className='flex h-full flex-col overflow-scroll gap-4'>
                {loading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <img src={Loader} alt="loader" className="w-10 h-10"></img>
                    </div>
                ) : (
                    <>
                        <div className='bg-white custom-shadow rounded-md flex justify-between md:py-4 py-3 px-3'>
                            <div className='flex gap-2 items-center'>
                                <div className='text-white font-bold bg-[#14b8a6] rounded-full w-12 h-12 flex justify-center items-center'>
                                    {getShortName(userDetails?.fullName)}
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{userDetails?.fullName}</span>
                                    <span className='text-sm'>{userDetails?.headQuater ? userDetails?.headQuater : "No HeadQuater"}</span>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex gap-2'>
                                    <span className='font-medium'>Reporting To:</span>
                                    <span className='text-gray-600'>{userDetails?.reportToName ? userDetails?.reportToName : "No Repoting"}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span className='font-medium'>Reporting To HeadQuater:</span>
                                    <span className='text-gray-600'>{userDetails?.reportingToHeadQuater ? userDetails?.reportingToHeadQuater : "No Headquater"}</span>
                                </div>
                            </div>
                        </div>
                        {viewMode === "card" && (
                            <div className='flex flex-col gap-4 w-full h-full'>
                                <div className='grid grid-cols-3 items-start gap-4'>
                                    {
                                        filterMtpPlan?.map((mtp) => (
                                            <div onClick={() => fetchMTPDetails(mtp.mtpid)} className='flex p-4 border-t-2 bg-white custom-shadow rounded-md border-[#14b8a6] flex-col gap-4'>
                                                <div className='flex justify-between items-center'>
                                                    <span>{mtp?.drName}</span>
                                                    <span className='p-1 px-2 text-sm text-white bg-[#14b8a6] rounded-md font-medium'>
                                                        Class {mtp?.className}
                                                    </span>
                                                </div>
                                                {console.log("itemmmmmm", mtp)}
                                                <div className='flex items-center gap-2'>
                                                    <span className='p-1 text-center text-xs bg-green-200 rounded-md text-green-600 w-20'>
                                                        {mtp?.speciality}
                                                    </span>
                                                    <span className='p-1 text-center text-xs bg-violet-200 rounded-md text-violet-500 w-20'>
                                                        {mtp?.qualification}
                                                    </span>
                                                    <span className='p-1 text-center text-xs bg-neutral-400 rounded-md text-black w-20'>
                                                        {mtp?.gender === "M" ? "MALE" : "FEMALE"}
                                                    </span>
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <CalendarTodayIcon className='text-[#14b8a6]' style={{ fontSize: '1.2rem' }}></CalendarTodayIcon>
                                                        <span className='text-sm'>{mtp?.mtpdate}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <LocationOnOutlinedIcon className='text-[#14b8a6]' style={{ fontSize: '1.2rem' }}></LocationOnOutlinedIcon>
                                                        <span className='text-sm'>{mtp?.address},{mtp?.pinCode}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <AccessTimeOutlinedIcon className='text-[#14b8a6]' style={{ fontSize: '1.2rem' }}></AccessTimeOutlinedIcon>
                                                        <span className='text-sm'>V Freq: {mtp?.vfreq}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <LocalHospitalOutlinedIcon className='text-[#14b8a6]' style={{ fontSize: '1.2rem' }}></LocalHospitalOutlinedIcon>
                                                        <span className='text-sm'>Area: {mtp?.doctorArea}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <NearMeOutlinedIcon className='text-[#14b8a6]' style={{ fontSize: '1.2rem' }}></NearMeOutlinedIcon>
                                                        <span className='text-sm'>MTP: {mtp?.mtp}</span>
                                                    </div>
                                                </div>
                                                <div className='bg-gray-100 flex  gap-1 flex-col p-2 rounded-md'>
                                                    <span>Products</span>
                                                    <span className='text-sm'>{mtp?.products}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {viewMode === "table" && filterMtpPlan?.length > 0 ? (
                            <div className="bg-white rounded shadow overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-blue-50 text-black p-2 text-center text-sm font-semibold">
                                        <tr>
                                            <th className="p-2">Doctor</th>
                                            <th className="p-2">Speciality</th>
                                            <th className="p-2">Qualification</th>
                                            <th className="p-2">Date</th>
                                            <th className="p-2">Area</th>
                                            <th className="p-2">Products</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterMtpPlan.map((mtp) => (
                                            <tr
                                                key={mtp.mtpid}
                                                onClick={() => fetchMTPDetails(mtp.mtpid)}
                                                className="border-b hover:bg-gray-50 cursor-pointer"
                                            >
                                                <td className="p-2">{mtp.drName}</td>
                                                <td className="p-2">{mtp.speciality}</td>
                                                <td className="p-2">{mtp.qualification}</td>
                                                <td className="p-2">{mtp.mtpdate}</td>
                                                <td className="p-2">{mtp.doctorArea}</td>
                                                <td className="p-2">{mtp.products}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) :
                            <div className="flex items-center justify-center h-full min-h-[300px]">
                                <h1 className="text-lg font-semibold text-gray-500">
                                    No Planned Found
                                </h1>
                            </div>

                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default ReportingPlan