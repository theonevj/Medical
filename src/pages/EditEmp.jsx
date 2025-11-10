import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

//Importing icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

//Importing images
import IMG1 from "../assets/asset5.png";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import api from "../api";

import { Link, useLocation, useNavigate } from "react-router-dom";

function EditEmp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [headQuater, setHeadQuater] = useState([])
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [designation, setDesignation] = useState([])
  const [reporting, setReporting] = useState([])

  useEffect(() => {
    if (!location.state) {
      navigate("/admin/employee");
    }
    setFormData(location.state);
  }, []);

  useEffect(() => {
    const fetchHeadQauter = async () => {
      try {
        const response = await api.get('/Headquarters')
        console.log(response.data)
        setHeadQuater(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchHeadQauter()
  }, [])

  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && fileTypes.includes(file.type) && file.size <= 5 * 1014 * 1014) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select valid file type under 10mb.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: name === "reportingTo" ? parseInt(value) : value }));
  };

  const validateData = () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.firstName) newErrors.firstName = "Please enter firstname.";
    if (!formData.lastName) newErrors.lastName = "Please enter lastname.";
    if (!formData.username) newErrors.username = "Please enter username.";
    if (!formData.email) newErrors.email = "Please enter email address.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Please enter mobileno.";
    else if (formData.phoneNumber.length !== 10)
      newErrors.phoneNumber = "Invalid mobile no.";
    if (!formData.joiningDate)
      newErrors.joiningDate = "Please enter joining date.";
    if (!formData.dob) newErrors.dob = "Please enter date of birth.";
    if (!formData.panCard) newErrors.panCard = "Please enter pancard.";
    if (!formData.gender) newErrors.gender = "Please enter gender.";
    if (!formData.designation) newErrors.designation = "Please enter designation."
    if (!formData.pfno) newErrors.pfno = "Please enter Provident fund"
    if (!formData.uan) newErrors.uan = "Please enter Universal Account Number."
    if (!formData.headQuater) newErrors.headQuater = "Please enter headQuater details."
    if (!formData.bankName) newErrors.bankName = "Please enter bank name."
    if (!formData.ifscCode) newErrors.ifscCode = "Please enter ifsc code."
    if (!formData.bankAcctNo) newErrors.bankAcctNo = "Please enter account number."
    if (!formData.reportingTo) newErrors.reportingTo = "Please select reporting to."
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    if (validateData()) {
      setLoading(true);
      const {
        password,
        userID,
        username,
        firstName,
        lastName,
        gender,
        dob,
        panCard,
        email,
        phoneNumber,
        roleID,
        joiningdate,
        designation,
        reportingTo,
        pfno,
        uan,
        bankName,
        ifscCode,
        bankAcctNo,
        headQuater
      } = formData;
      try {
        await api.post(
          `/User/UpdateUser?id=${formData.id}`,
          {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            dob,
            gender,
            joiningdate,
            panCard,
            designation,
            pfno,
            uan,
            bankName,
            ifscCode,
            bankAcctNo,
            headQuater,
            reportingTo
          },
        );
        setImageFile(null);
        setPreviewImage(null);
        setFormData({});
        navigate("/admin/employee");
        toast.success("Employee details updated.");
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong while saving data.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {

    const fetchDropDownData = async () => {
      try {
        const [designationRes, reportingRes] = await Promise.all([
          api.get('/User/Designation'),
          api.get('/User/GetReportingTo')
        ]);
        setDesignation(designationRes.data.data);
        setReporting(reportingRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching data.");
      }
    };

    fetchDropDownData();

  }, [])


  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={"/admin/employee"}>
            <span className="text-gray-600 cursor-pointer">
              <ArrowBackIosIcon
                style={{ fontSize: "1.4rem" }}
              ></ArrowBackIosIcon>
            </span>
          </Link>
          <h1 className="text-gray-800 text-base md:text-lg font-medium">
            Edit Employee Details
          </h1>
        </div>
      </div>
      <div className="md:py-6 md:px-4 bg-white rounded-md custom-shadow py-3 px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="flex flex-col gap-2 items-center">
            <div className="group overflow-hidden relative rounded-full w-36 h-36 flex justify-center items-center border">
              <img
                src={previewImage ? previewImage : IMG1}
                className="w-full h-full"
                alt="person"
              ></img>
              <div className="group-hover:top-0 transition-all duration-300 absolute bg-gray-200 gap-2 flex justify-center items-center bg-opacity-80 w-full h-full top-full rounded-full">
                <label
                  htmlFor="profile"
                  className="text-gray-600 cursor-pointer"
                >
                  <PhotoCameraOutlinedIcon
                    style={{ fontSize: "2rem" }}
                  ></PhotoCameraOutlinedIcon>
                </label>
                {previewImage && (
                  <span
                    onClick={clearImage}
                    className="text-gray-600 cursor-pointer"
                  >
                    <ClearOutlinedIcon
                      style={{ fontSize: "2rem" }}
                    ></ClearOutlinedIcon>
                  </span>
                )}
                <input
                  onChange={handleImageChange}
                  id="profile"
                  type="file"
                  className="hidden"
                ></input>
              </div>
            </div>
            {errors.image && (
              <span className="text-sm text-red-400">{errors.image}</span>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="font-medium text-gray-700">
                Firstname <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                onChange={handleChange}
                type="text"
                value={formData.firstName}
                id="firstName"
                className="p-2 outline-none border-b-2 border-gray-200"
                placeholder="Ex. Jode"
              ></input>
              {errors.firstName && (
                <span className="text-sm text-red-400">{errors.firstName}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="font-medium text-gray-700">
                Lastname <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                onChange={handleChange}
                type="text"
                value={formData.lastName}
                id="lastName"
                className="p-2 outline-none border-b-2 border-gray-200"
                placeholder="Ex. Doe"
              ></input>
              {errors.lastName && (
                <span className="text-sm text-red-400">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              onChange={handleChange}
              type="text"
              value={formData.username}
              id="username"
              className="p-2 outline-none border-b-2 border-gray-200"
              placeholder="Ex. MyUser"
            ></input>
            {errors.username && (
              <span className="text-sm text-red-400">{errors.username}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              onChange={handleChange}
              type="text"
              value={formData.email}
              id="email"
              className="p-2 outline-none border-b-2 border-gray-200"
              placeholder="Ex. test@example.com"
            ></input>
            {errors.email && (
              <span className="text-sm text-red-400">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="font-medium text-gray-700">
              Mobile No <span className="text-red-500">*</span>
            </label>
            <input
              name="phoneNumber"
              onChange={handleChange}
              type="number"
              value={formData.phoneNumber}
              id="phoneNumber"
              className="p-2 outline-none border-b-2 border-gray-200"
              placeholder="Ex. 72626..."
            ></input>
            {errors.phoneNumber && (
              <span className="text-sm text-red-400">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dob" className="font-medium text-gray-700">
              Date of birth <span className="text-red-500">*</span>
            </label>
            <input
              name="dob"
              onChange={handleChange}
              type="date"
              value={formData?.dob?.split("T")[0]}
              id="dob"
              className="p-2 outline-none border-b-2 border-gray-200"
            ></input>
            {errors.joiningDate && (
              <span className="text-sm text-red-400">{errors.dob}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 outline-none border-2 border-gray-200"
            >
              <option value={""}>--- Select Gender ---</option>
              <option value={"M"}>Male</option>
              <option value={"F"}>Female</option>
            </select>
            {errors.gender && (
              <span className="text-sm text-red-400">{errors.gender}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="joiningDate" className="font-medium text-gray-700">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              name="joiningDate"
              onChange={handleChange}
              type="date"
              value={formData?.joiningDate?.split("T")[0]}
              id="joiningDate"
              className="p-2 outline-none border-b-2 border-gray-200"
            ></input>
            {errors.joiningDate && (
              <span className="text-sm text-red-400">{errors.joiningDate}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="panCard" className="font-medium text-gray-700">
              Pancard <span className="text-red-500">*</span>
            </label>
            <input
              name="panCard"
              onChange={handleChange}
              type="text"
              value={formData.panCard}
              placeholder="Ex. AFZPK7190K"
              id="panCard"
              className="p-2 outline-none border-b-2 border-gray-200"
            ></input>
            {errors.panCard && (
              <span className="text-sm text-red-400">{errors.panCard}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="designation" className="font-medium text-gray-700">
              Designation <span className="text-red-500">*</span>
            </label>
            <select name='designation' onChange={handleChange} value={formData.designation} id='designation' className='p-2 outline-none border-2 border-gray-200'>
              <option value="">--- Select Designation ---</option>
              {
                designation.map((item, index) => (
                  <option key={index} value={item.codeID}>{item.codeName}</option>
                ))
              }
            </select>
            {errors.designation && (
              <span className="text-sm text-red-400">{errors.designation}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pfno" className="font-medium text-gray-700">
              Provident Fund <span className="text-red-500">*</span>
            </label>
            <input
              name="pfno"
              onChange={handleChange}
              type="text"
              value={formData.pfno}
              placeholder="Ex. 1 Cr"
              id="pfno"
              className="p-2 outline-none border-b-2 border-gray-200"
            ></input>
            {errors.pfno && (
              <span className="text-sm text-red-400">{errors.pfno}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="uan" className="font-medium text-gray-700">
              Universal Account Number <span className="text-red-500">*</span>
            </label>
            <input
              name="uan"
              onChange={handleChange}
              type="text"
              value={formData.uan}
              placeholder="Ex. 1000 2625 5142"
              id="uan"
              className="p-2 outline-none border-b-2 border-gray-200"
            ></input>
            {errors.uan && (
              <span className="text-sm text-red-400">{errors.uan}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="headQuater" className="font-medium text-gray-700">
              Headquater <span className="text-red-500">*</span>
            </label>
            <select
              name="headQuater"
              onChange={handleChange}
              value={formData?.headQuater}
              id="headQuater"
              className="p-2 outline-none border-2 border-gray-200"
            >
              <option value={''}>--- Select Headquater ---</option>
              {
                headQuater?.map((item) => (
                  <option value={item.hqid}>{item.hqName}</option>
                ))
              }
            </select>
            {errors.headQuater && (
              <span className="text-sm text-red-400">{errors.headQuater}</span>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='reportingTo' className='font-medium text-gray-700'>Reporting To <span className='text-red-500'>*</span></label>
            <select className='p-2 outline-none border-2 border-gray-200' name='reportingTo' onChange={handleChange} value={formData.reportingTo}>
              <option value={''}>--- Select Reporting To ---</option>
              {
                reporting.map((item, index) => (
                  <option key={index} value={item.codeID}>{item.codeName}</option>
                ))
              }
            </select>
            {errors.reportingTo && <span className='text-sm text-red-400'>{errors.reportingTo}</span>}
          </div>

          <div className='md:col-span-2'>
            <h1 className='text-lg font-smibold'>Employee Bank Details</h1>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='bankName' className='font-medium text-gray-700'>Bank Name <span className='text-red-500'>*</span></label>
            <input name='bankName' onChange={handleChange} type='text' value={formData.bankName} placeholder='Ex. STATE BANK OF INDIA' id='bankName' className='p-2 outline-none border-b-2 border-gray-200'></input>
            {errors.bankName && <span className='text-sm text-red-400'>{errors.bankName}</span>}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='ifscCode' className='font-medium text-gray-700'>IFSC Code <span className='text-red-500'>*</span></label>
            <input name='ifscCode' onChange={handleChange} type='text' value={formData.ifscCode} placeholder='Ex. KKBK0000123' id='ifscCode' className='p-2 outline-none border-b-2 border-gray-200'></input>
            {errors.ifscCode && <span className='text-sm text-red-400'>{errors.ifscCode}</span>}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='bankAcctNo' className='font-medium text-gray-700'>Account No <span className='text-red-500'>*</span></label>
            <input name='bankAcctNo' onChange={handleChange} type='text' value={formData.bankAcctNo} placeholder='Ex. 1234567000' id='bankAcctNo' className='p-2 outline-none border-b-2 border-gray-200'></input>
            {errors.bankAcctNo && <span className='text-sm text-red-400'>{errors.bankAcctNo}</span>}
          </div>

        </div>
      </div>
      <div className="flex place-content-end bg-white custom-shadow rounded-md py-3 px-3 md:py-4 md:px-4">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`p-2 text-white w-36 flex justify-center items-center rounded-md ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-themeblue hover:bg-blue-800"
            }`}
        >
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
          {loading ? "Loading..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default EditEmp;
