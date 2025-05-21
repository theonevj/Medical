//importing icons
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import api from '../api';

const formateDate = (dateString)=>{
  const date = new Date(dateString);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(',', '');
}


export const columns = (handleOpenUpdateData,handleOpenConfirmPopUp)=>[
    {
      field: 'drName',
      headerClassName: 'super-app-theme--header',
      headerName: 'Dr. Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'className',
      headerClassName: 'super-app-theme--header',
      headerName: 'Class',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'speciality',
      headerClassName: 'super-app-theme--header',
      headerName: 'Speciality',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'qualification',
      headerClassName: 'super-app-theme--header',
      headerName: 'Qualification',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'dob',
      headerClassName: 'super-app-theme--header',
      headerName: 'DOB',
      flex: 1,
      minWidth: 150,
      renderCell: (params)=>(
        <div className='flex w-full h-full'>
          <span>{formateDate(params.row.dob)}</span>
        </div>
      )
    },
    {
      field: 'gender',
      headerClassName: 'super-app-theme--header',
      headerName: 'Gender',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <span>{params.value?params.value==="M"?"Male":"Female":""}</span>
      )
    },
    {
      field: 'routeName',
      headerClassName: 'super-app-theme--header',
      headerName: 'Route Name',
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: 'addressLine1',
      headerClassName: 'super-app-theme--header',
      headerName: 'Address Line 1',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'addressLine2',
      headerClassName: 'super-app-theme--header',
      headerName: 'Address Line 2',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'pinCode',
      headerClassName: 'super-app-theme--header',
      headerName: 'Pincode',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'doctorArea',
      headerClassName: 'super-app-theme--header',
      headerName: 'Docter Area',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'vfreq',
      headerClassName: 'super-app-theme--header',
      headerName: 'Visiting Freq',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'mobileNo',
      headerClassName: 'super-app-theme--header',
      headerName: 'Mobile No',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'phone',
      headerClassName: 'super-app-theme--header',
      headerName: 'Phone',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'action',
      headerClassName: 'super-app-theme--header',
      headerName: 'Action',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex gap-3 items-center w-full h-full">
          <button onClick={()=>handleOpenUpdateData(params.row)} className="bg-blue-500 md:text-base text-sm hover:bg-blue-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
            <BorderColorOutlinedIcon style={{fontSize:'1.2rem'}}></BorderColorOutlinedIcon>
          </button>
          <button onClick={()=>handleOpenConfirmPopUp(params.row)} className="bg-red-500 md:text-base text-sm hover:bg-red-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
            <DeleteOutlineOutlinedIcon style={{fontSize:'1.2rem'}}></DeleteOutlineOutlinedIcon>
          </button>
        </div>
      ),
    },
  ];



export const filterDoctorColumns = (handleOpenUpdateData,handleOpenConfirmPopUp)=>[
  {
    field: 'drName',
    headerClassName: 'super-app-theme--header',
    headerName: 'Dr. Name',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'className',
    headerClassName: 'super-app-theme--header',
    headerName: 'Class',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'speciality',
    headerClassName: 'super-app-theme--header',
    headerName: 'Speciality',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'qualification',
    headerClassName: 'super-app-theme--header',
    headerName: 'Qualification',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'dob',
    headerClassName: 'super-app-theme--header',
    headerName: 'DOB',
    flex: 1,
    minWidth: 150,
    renderCell: (params)=>(
      <div className='flex w-full h-full'>
        <span>{formateDate(params.row.dob)}</span>
      </div>
    )
  },
  {
    field: 'gender',
    headerClassName: 'super-app-theme--header',
    headerName: 'Gender',
    flex: 0.8,
    minWidth: 120,
    renderCell: (params) => (
      <span>{params.row.gender==="M"?"Male":"Female"}</span>
    )
  },
  {
    field: 'routeName',
    headerClassName: 'super-app-theme--header',
    headerName: 'Route Name',
    flex: 1.2,
    minWidth: 150,
  },
  {
    field: 'addressLine1',
    headerClassName: 'super-app-theme--header',
    headerName: 'Address Line 1',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'addressLine2',
    headerClassName: 'super-app-theme--header',
    headerName: 'Address Line 2',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'pinCode',
    headerClassName: 'super-app-theme--header',
    headerName: 'Pincode',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'doctorArea',
    headerClassName: 'super-app-theme--header',
    headerName: 'Docter Area',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'vfreq',
    headerClassName: 'super-app-theme--header',
    headerName: 'Visiting Freq',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'mobileNo',
    headerClassName: 'super-app-theme--header',
    headerName: 'Mobile No',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'phone',
    headerClassName: 'super-app-theme--header',
    headerName: 'Phone',
    flex: 0.8,
    minWidth: 120,
  }

];


export const rows = [
    {
        id:1,
        drName:'VISWASH SARMA',
        class:'A+',
        speciality:'Ortho',
        qualification:'MS,ORTHO',
        mobile:'9898993892',
        dob:'20-01-2001',
        gender:'Male',
        routename:'JABALPUR',
        address:'HOME SCIENCE RODE JABALPUR',
        pincode:'482002'
    },
    {
        id:2,
        drname:'BRAJESH DADRIYA',
        class:'A+',
        speciality:'Ortho',
        qualification:'MS,ORTHO',
        mobile:'9898993892',
        dob:'20-01-2001',
        gender:'Male',
        routename:'JABALPUR',
        address:'HOME SCIENCE RODE JABALPUR',
        pincode:'482002'
    },
    {
        id:3,
        drname:'RAJEEV SAWANT',
        class:'A+',
        speciality:'Ortho',
        qualification:'MS,ORTHO',
        mobile:'9898993892',
        dob:'20-01-2001',
        gender:'Male',
        routename:'JABALPUR',
        address:'HOME SCIENCE RODE JABALPUR',
        pincode:'482002'
    },
    {
        id:4,
        drname:'RAJEEV BHANDARI',
        class:'A+',
        speciality:'Ortho',
        qualification:'MS,ORTHO',
        mobile:'9898993892',
        dob:'20-01-2001',
        gender:'Male',
        routename:'JABALPUR',
        address:'HOME SCIENCE RODE JABALPUR',
        pincode:'482002'
    }
]

export const docMapColumn = [
  {
    field: 'drName',
    headerClassName: 'super-app-theme--header',
    headerName: 'Dr. Name',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'className',
    headerClassName: 'super-app-theme--header',
    headerName: 'Class',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'speciality',
    headerClassName: 'super-app-theme--header',
    headerName: 'Speciality',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'qualification',
    headerClassName: 'super-app-theme--header',
    headerName: 'Qualification',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'dob',
    headerClassName: 'super-app-theme--header',
    headerName: 'DOB',
    flex: 1,
    minWidth: 150,
    renderCell: (params)=>(
      <div className='flex w-full h-full'>
        <span>{formateDate(params.row.dob)}</span>
      </div>
    )
  },
  {
    field: 'gender',
    headerClassName: 'super-app-theme--header',
    headerName: 'Gender',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'routeName',
    headerClassName: 'super-app-theme--header',
    headerName: 'Route Name',
    flex: 1.2,
    minWidth: 150,
  },
  {
    field: 'addressLine1',
    headerClassName: 'super-app-theme--header',
    headerName: 'Address Line 1',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'addressLine2',
    headerClassName: 'super-app-theme--header',
    headerName: 'Address Line 2',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'pinCode',
    headerClassName: 'super-app-theme--header',
    headerName: 'Pincode',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'doctorArea',
    headerClassName: 'super-app-theme--header',
    headerName: 'Docter Area',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'vfreq',
    headerClassName: 'super-app-theme--header',
    headerName: 'Visiting Freq',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'mobileNo',
    headerClassName: 'super-app-theme--header',
    headerName: 'Mobile No',
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'phone',
    headerClassName: 'super-app-theme--header',
    headerName: 'Phone',
    flex: 0.8,
    minWidth: 120,
  },
]


export const getDoctors = async ()=>{
  try{
    const response = await api.get(`/Doctor/GetAllDoctor`)
    console.log(response.data.data)
    return response.data.data
  }catch(err){
   throw err
  }
}


export const getDoctorsForEmployee = async () =>{
  try{
    const response = await api.get('/Doctor/GetAllDoctor')
    console.log(response)
    return response.data.data
  }catch(err){
    throw err
  }
}


export const getDoctorReport = [
  {
    field: 'DrCode',
    headerName: 'Dr Code',
    headerClassName: 'super-app-theme--header',
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: 'DrName',
    headerName: 'Doctor Name',
    headerClassName: 'super-app-theme--header',
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: 'Gender',
    headerName: 'Gender',
    headerClassName: 'super-app-theme--header',
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: 'Qualification',
    headerName: 'Qualification',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'Speciality',
    headerName: 'Speciality',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'ClassName',
    headerName: 'Class Name',
    headerClassName: 'super-app-theme--header',
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: 'DoctorArea',
    headerName: 'Area',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'RouteName',
    headerName: 'Route Name',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'HQName',
    headerName: 'HQ Name',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'MobileNo',
    headerName: 'Mobile No',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 130,
  },
  {
    field: 'Phone',
    headerName: 'Phone',
    headerClassName: 'super-app-theme--header',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'AddressLine1',
    headerName: 'Address Line 1',
    headerClassName: 'super-app-theme--header',
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: 'AddressLine2',
    headerName: 'Address Line 2',
    headerClassName: 'super-app-theme--header',
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: 'PinCode',
    headerName: 'Pin Code',
    headerClassName: 'super-app-theme--header',
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: 'Vfreq',
    headerName: 'Visit Frequency',
    headerClassName: 'super-app-theme--header',
    flex: 0.8,
    minWidth: 120,
  },
];
