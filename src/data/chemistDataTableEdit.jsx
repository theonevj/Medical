import api from '../api';
//importing icons
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';

const formateDate = (dateString) => {
    const date = new Date(dateString);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
}


export const columns = (handleOpenUpdateData, handleOpenConfirmPopUp, getChemistData) => [
    {
        field: 'chemistName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Name',
        flex: 0.5, // Proportional width
        minWidth: 180, // Minimum width to prevent shrinking
    },
    {
        field: 'mobileNo',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mobile No',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine1',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 1',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine2',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 2',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'pinCode',
        headerClassName: 'super-app-theme--header',
        headerName: 'Pincode',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'chemistArea',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Area',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'vfreq',
        headerClassName: 'super-app-theme--header',
        headerName: 'Visit Frequency',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'phone',
        headerClassName: 'super-app-theme--header',
        headerName: 'Phone',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'gender',
        headerClassName: 'super-app-theme--header',
        headerName: 'Gender',
        flex: 0.5, // Proportional width
        minWidth: 140, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='flex items-center w-full h-full'>
                <span>{params.value === "M" || params.value === "m" ? "Male" : "Female"}</span>
            </div>
        )
    },
    {
        field: 'contactPerson',
        headerClassName: 'super-app-theme--header',
        headerName: 'Contact Person',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'routeName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Route Name',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'dob',
        headerClassName: 'super-app-theme--header',
        headerName: 'DOB',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='w-full flex items-center'>
                <span>{formateDate(params.value)}</span>
            </div>
        )
    },
    {
        field: 'chemistType',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Type',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'action',
        headerClassName: 'super-app-theme--header',
        headerName: 'Action',
        flex: 1.5,
        minWidth: 150,
        renderCell: (params) => (
            <div className="flex gap-3 items-center w-full h-full">
                <button onClick={() => handleOpenUpdateData(params.row)} className="bg-blue-500 md:text-base text-sm hover:bg-blue-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
                    <BorderColorOutlinedIcon style={{ fontSize: '1.2rem' }}></BorderColorOutlinedIcon>
                </button>
                <button onClick={() => handleOpenConfirmPopUp(params.row)} className="bg-red-500 md:text-base text-sm hover:bg-red-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
                    <DeleteOutlineOutlinedIcon style={{ fontSize: '1.2rem' }}></DeleteOutlineOutlinedIcon>
                </button>
            </div>
        ),
    },
    {
        field: 'Status',
        headerClassName: 'super-app-theme--header',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 200,
        renderCell: (params) => (
            <div className="flex gap-3 items-center w-full h-full">
                {params.row?.approvalStatus === 'Approved' ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">Approved</span>
                ) : params.row?.approvalStatus === 'Rejected' ? (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                        Rejected
                    </span>
                ) : (
                    <>
                        <button
                            onClick={() => handleStatusChange(params.row, 'approve', () => { }, getChemistData)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleStatusChange(params.row, 'reject', () => { }, getChemistData)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        ),
    }
]

const handleStatusChange = async (chemist, status, handleUpdateLocalStatus, getChemistData) => {
    console.log("chemist.chemistCode", chemist)
    try {
        const response = await api.post(
            `/Chemist/${chemist.chemistCode}/${status}`,
            {
                approvedBy: 0,
                description: "Approved by admin"
            }
        );
        if (response.status === 200) {
            toast.success(`Doctor ${status} successfully!`);
            await getChemistData();
            handleUpdateLocalStatus(chemist.id, status);
        }
    } catch (error) {
        console.error("Status update failed:", error);
        toast.error("Failed to update status!");
    }
};

export const empChemistColumn = (handleOpenUpdateData, handleOpenConfirmPopUp) => [
    {
        field: 'chemistName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Name',
        flex: 0.5, // Proportional width
        minWidth: 180, // Minimum width to prevent shrinking
    },
    {
        field: 'routeName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Route Name',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'mobileNo',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mobile No',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine1',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 1',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine2',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 2',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'pinCode',
        headerClassName: 'super-app-theme--header',
        headerName: 'Pincode',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'chemistArea',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Area',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'vfreq',
        headerClassName: 'super-app-theme--header',
        headerName: 'Visit Frequency',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'phone',
        headerClassName: 'super-app-theme--header',
        headerName: 'Phone',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'gender',
        headerClassName: 'super-app-theme--header',
        headerName: 'Gender',
        flex: 0.5, // Proportional width
        minWidth: 140, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='flex items-center w-full h-full'>
                <span>{params.value === "M" || params.value === "m" ? "Male" : "Female"}</span>
            </div>
        )
    },
    {
        field: 'contactPerson',
        headerClassName: 'super-app-theme--header',
        headerName: 'Contact Person',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },

    {
        field: 'dob',
        headerClassName: 'super-app-theme--header',
        headerName: 'DOB',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='w-full flex items-center'>
                <span>{formateDate(params.value)}</span>
            </div>
        )
    },
    {
        field: 'chemistType',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Type',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'action',
        headerClassName: 'super-app-theme--header',
        headerName: 'Action',
        flex: 1.5,
        minWidth: 150,
        renderCell: (params) => (
            <div className="flex gap-3 items-center w-full h-full">
                {params.row?.approvalStatus === 'Approved' ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">Approved</span>
                ) : params.row?.approvalStatus === 'Rejected' ? (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                        Rejected
                    </span>
                ) : (
                    <>
                        <button onClick={() => handleOpenUpdateData(params.row)} className="bg-blue-500 md:text-base text-sm hover:bg-blue-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
                            <BorderColorOutlinedIcon style={{ fontSize: '1.2rem' }}></BorderColorOutlinedIcon>
                        </button>
                        <button onClick={() => handleOpenConfirmPopUp(params.row)} className="bg-red-500 md:text-base text-sm hover:bg-red-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7">
                            <DeleteOutlineOutlinedIcon style={{ fontSize: '1.2rem' }}></DeleteOutlineOutlinedIcon>
                        </button>
                    </>
                )}
            </div>
        ),
    },
]


export const chemistMapColumns = [
    {
        field: 'chemistName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Name',
        flex: 0.5, // Proportional width
        minWidth: 180, // Minimum width to prevent shrinking
    },
    {
        field: 'mobileNo',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mobile No',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine1',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 1',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'addressLine2',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address Line 2',
        flex: 0.5, // Proportional width
        minWidth: 200, // Minimum width to prevent shrinking
    },
    {
        field: 'pinCode',
        headerClassName: 'super-app-theme--header',
        headerName: 'Pincode',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'chemistArea',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Area',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'vfreq',
        headerClassName: 'super-app-theme--header',
        headerName: 'Visit Frequency',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'phone',
        headerClassName: 'super-app-theme--header',
        headerName: 'Phone',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'gender',
        headerClassName: 'super-app-theme--header',
        headerName: 'Gender',
        flex: 0.5, // Proportional width
        minWidth: 140, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='flex items-center w-full h-full'>
                <span>{params.value === "M" || params.value === "m" ? "Male" : "Female"}</span>
            </div>
        )
    },
    {
        field: 'contactPerson',
        headerClassName: 'super-app-theme--header',
        headerName: 'Contact Person',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'routeName',
        headerClassName: 'super-app-theme--header',
        headerName: 'Route Name',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
    {
        field: 'dob',
        headerClassName: 'super-app-theme--header',
        headerName: 'DOB',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
        renderCell: (params) => (
            <div className='w-full flex items-center'>
                <span>{formateDate(params.value)}</span>
            </div>
        )
    },
    {
        field: 'chemistType',
        headerClassName: 'super-app-theme--header',
        headerName: 'Chemist Type',
        flex: 0.5, // Proportional width
        minWidth: 150, // Minimum width to prevent shrinking
    },
]

export const getChemistReport = [
    {
        field: 'ChemistCode',
        headerName: 'Chemist Code',
        headerClassName: 'super-app-theme--header',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'ChemistName',
        headerName: 'Chemist Name',
        headerClassName: 'super-app-theme--header',
        flex: 1.2,
        minWidth: 160,
    },
    {
        field: 'ChemistType',
        headerName: 'Chemist Type',
        headerClassName: 'super-app-theme--header',
        flex: 0.6,
        minWidth: 100,
    },
    {
        field: 'ContactName',
        headerName: 'Contact Name',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'ContactPerson',
        headerName: 'Contact Person',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 150,
    },
    {
        field: 'ContactNumber',
        headerName: 'Contact Number',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 140,
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
        field: 'Gender',
        headerName: 'Gender',
        headerClassName: 'super-app-theme--header',
        flex: 0.5,
        minWidth: 80,
        renderCell: (params) => (
            <span>{params.value ? params.value === "M" ? "Male" : "Female" : ""}</span>
        )
    },
    {
        field: 'Dob',
        headerName: 'DOB',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 140,
        renderCell: (params) => (
            <span>{formateDate(params.value)}</span>
        )
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
        field: 'ChemistArea',
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
        minWidth: 130,
    },
    {
        field: 'Location',
        headerName: 'Location',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 130,
    },
    {
        field: 'PinCode',
        headerName: 'Pin Code',
        headerClassName: 'super-app-theme--header',
        flex: 0.8,
        minWidth: 100,
    },
    {
        field: 'HQName',
        headerName: 'HQ Name',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 130,
    },
    {
        field: 'Vfreq',
        headerName: 'Visit Frequency',
        headerClassName: 'super-app-theme--header',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'isActive',
        headerName: 'Is Active',
        headerClassName: 'super-app-theme--header',
        flex: 0.6,
        minWidth: 100,
        renderCell: (params) => (
            <span>{params.row.isActive === 1 ? "Yes" : "No"}</span>
        )
    },
    {
        field: 'createdDate',
        headerName: 'Created Date',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
            <span>{formateDate(params.value)}</span>
        )
    },
    {
        field: 'updatedDate',
        headerName: 'Updated Date',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
            <span>{formateDate(params.value)}</span>
        }
    },
];


export const rows = [
    {
        id: 1,
        chemistname: 'SELBY HOSPITAL',
        email: 'info@selby.com',
        mobileno: '8892733872',
        fax: '-',
        pincode: '365630',
        routename: 'Jabalpur',
        chemistarea: 'Jabalpur',
        contactperson: 'Raj Patel',
        phone: '9762626261',
        addressline1: '203 - holiday, S.G Road',
        addressline2: 'Near ashram',
        visitfreq: '3',
        dob: '09-10-2004',
        chemisttype: 'Remote'
    },
    {
        id: 2,
        chemistname: 'DOCTOR HOUSE',
        email: 'info@selby.com',
        mobileno: '8892733872',
        fax: '-',
        pincode: '365630',
        routename: 'Jabalpur',
        chemistarea: 'Jabalpur',
        contactperson: 'Raj Patel',
        phone: '9762626261',
        addressline1: '203 - holiday, S.G Road',
        addressline2: 'Near ashram',
        visitfreq: '3',
        dob: '09-10-2004',
        chemisttype: 'Remote'
    },
    {
        id: 3,
        chemistname: 'NATIONAL HOSPITAI',
        email: 'info@selby.com',
        mobileno: '8892733872',
        fax: '-',
        pincode: '365630',
        routename: 'Jabalpur',
        chemistarea: 'Jabalpur',
        contactperson: 'Raj Patel',
        phone: '9762626261',
        addressline1: '203 - holiday, S.G Road',
        addressline2: 'Near ashram',
        visitfreq: '3',
        dob: '09-10-2004',
        chemisttype: 'Remote'
    },
    {
        id: 4,
        chemistname: 'CITY HOSPITAL',
        email: 'info@selby.com',
        mobileno: '8892733872',
        fax: '-',
        pincode: '365630',
        routename: 'Jabalpur',
        chemistarea: 'Jabalpur',
        contactperson: 'Raj Patel',
        phone: '9762626261',
        addressline1: '203 - holiday, S.G Road',
        addressline2: 'Near ashram',
        visitfreq: '3',
        dob: '09-10-2004',
        chemisttype: 'Remote'
    }

]


export const getAllChemist = async () => {
    try {
        // const response = await api.get(`/Chemist/GetAllChemist`)
        const response = await api.get(`/Chemist/GetAll`)
        return response.data.data
    } catch (err) {
        throw err
    }
}

export const getAllChemistForEmployee = async () => {
    try {
        // const response = await api.get('/Chemist/GetAllChemist')
        const response = await api.get(`/Chemist/GetAll`)
        return response.data.data
    } catch (err) {
        throw err
    }
}