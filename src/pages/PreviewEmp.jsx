import React, {useState, useEffect} from 'react'
import IMG1 from "../assets/asset5.png";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import api from '../api';
import { toast } from 'react-toastify'

function PreviewEmp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [designation,setDesignation] = useState([])
  const [reporting,setReporting] = useState([])

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!location.state) {
      navigate("/admin/employee");
    }
    console.log('location state----->',location.state)
    setFormData(location.state);
  }, []);


   useEffect(()=>{
      const fetchDesignationData = async () =>{
         try{
           const response = await api.get('/User/Designation')
           console.log(response.data.data)
           setDesignation(response.data.data)
         }catch(err){
          console.log(err)
          toast.error("Something went wrong.")
         }
      }
    
      const fetchReportingValue = async () =>{
        try{
          const response = await api.get('/User/GetReportingTo')
          console.log(response.data.data)
          setReporting(response.data.data)
        }catch(err){
          console.log(err)
          toast.error("Something went wrong.")
        }
      }

      const fetchHeadQuater = async () =>{
        try{
          const response = await api.get('/Headquarters')
          console.log(response.data)
          let headQuater = response.data.find((item)=>item.hqid==location.state.headQuater)
          console.log("headquater ---->",headQuater)
          setFormData((prevData)=>({...prevData,headQuater:headQuater.hqName}))
        }catch(err){
          toast.error("Something went wrong.")
        }
      }
  
      fetchDesignationData()
      fetchReportingValue()
      fetchHeadQuater()
  },[])




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
            {(formData.firstName && formData.lastName) ? (`${formData.firstName.charAt(0).toUpperCase()+formData.firstName.slice(1)} ${formData.lastName}`):"Employee Details"}
          </h1>
        </div>
      </div>
      <div className="md:py-6 md:px-4 bg-white rounded-md custom-shadow py-3 px-3">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
             <div className='flex items-center justify-center'>
               <div className='group overflow-hidden relative rounded-full w-36 h-36 flex justify-center items-center border'>
                <img src={formData.image?formData?.image:IMG1} className='w-full h-full'></img>
               </div>
             </div>
             <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>First Name</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.firstName || "Not Available"}</span>
                </div>
                <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Last Name</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.lastName || "Not Available"}</span>
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Username</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.username || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Email</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.email || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Mobile No</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.phoneNumber || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Date of birth</span>
                   <span className='h-10 px-2 flex items-center border'>{formData?.dob?.split("T")[0] || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Gender</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.gender==="M"?"Male":"Female" || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Joining Date</span>
                   <span className='h-10 px-2 flex items-center border'>{formData?.joiningDate?.split("T")[0]|| "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Pancard</span>
                   <span className='h-10 px-2 flex items-center border'>{formData.panCard || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'>Designation </span>
                   <span className='h-10 px-2 flex items-center border'>{designation.find((item)=> item.codeID==formData.designation)?.codeName || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Provident Fund </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.pfno || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Universal Account Number </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.uan || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Headquater </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.headQuater || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Reporting To </span>
                   <span className='h-10 px-2 flex items-center border'>{reporting.find((item)=> item.codeID==formData.reportingTo)?.codeName || "Not Available"}</span>
             </div>
             <div className='md:col-span-2'>
               <h1 className='text-lg font-bold'>Bank Details</h1>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Bank Name </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.bankName || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> IFSC Code </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.ifscCode || "Not Available"}</span>
             </div>
             <div className='flex flex-col gap-2'>
                   <span className='font-medium text-gray-700 text-lg'> Account No </span>
                   <span className='h-10 px-2 flex items-center border'>{formData.bankAcctNo || "Not Available"}</span>
             </div>
          </div>
      </div>
    </div>
  )
}

export default PreviewEmp