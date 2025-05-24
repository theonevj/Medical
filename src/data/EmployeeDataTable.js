import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import api from "../api";

const formateDate = (dateString) => {
  const date = new Date(dateString);

  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options).replace(",", "");
};

export const columns = (
  handleNavigateToEdit,
  handleOpenConfirmPopUp,
  handleNavigateToPreview,
  handleChangePassword
) => [
  {
    field: "username",
    headerClassName: "super-app-theme--header",
    headerName: "Username",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "empname",
    headerClassName: "super-app-theme--header",
    headerName: "Emp Name",
    flex: 0.5, // Proportional width
    minWidth: 150, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center ">
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerClassName: "super-app-theme--header",
    headerName: "Email",
    flex: 0.5, // Proportional width
    minWidth: 200, // Minimum width to prevent shrinking
  },
  {
    field: "designationName",
    headerClassName: "super-app-theme--header",
    headerName: "Designation",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
  },
  {
    field: "phoneNumber",
    headerClassName: "super-app-theme--header",
    headerName: "Mobile No",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "dob",
    headerClassName: "super-app-theme--header",
    headerName: "Date of birth",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="flex w-full h-full items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "joiningDate",
    headerClassName: "super-app-theme--header",
    headerName: "Joining Date",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "panCard",
    headerClassName: "super-app-theme--header",
    headerName: "Pancard",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "action",
    headerClassName: "super-app-theme--header",
    headerName: "Action",
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => (
      <div className="flex gap-3 items-center w-full h-full">
        <button
          onClick={() => handleNavigateToEdit(params.row)}
          className="bg-blue-500 md:text-base text-sm hover:bg-blue-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7"
        >
          <BorderColorOutlinedIcon
            style={{ fontSize: "1.2rem" }}
          ></BorderColorOutlinedIcon>
        </button>
        <button
          onClick={() => handleOpenConfirmPopUp(params.row)}
          className="bg-red-500 md:text-base text-sm hover:bg-red-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7"
        >
          <DeleteOutlineOutlinedIcon
            style={{ fontSize: "1.2rem" }}
          ></DeleteOutlineOutlinedIcon>
        </button>
        <button
          onClick={() => handleNavigateToPreview(params.row)}
          className="bg-orange-500 md:text-base text-sm hover:bg-orange-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7"
        >
          <RemoveRedEyeOutlinedIcon
            style={{ fontSize: "1.2rem" }}
          ></RemoveRedEyeOutlinedIcon>
        </button>
        <button
          onClick={() => handleChangePassword(params.row)}
          className="bg-yellow-500 md:text-base text-sm hover:bg-yellow-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7"
        >
          <LockResetOutlinedIcon style={{ fontSize: "1.2rem" }} />
        </button>
      </div>
    ),
  },
];

export const empColumns = (
  handleNavigateToEdit,
  handleOpenConfirmPopUp,
  handleNavigateToPreview,
  handleChangePassword
) => [
  {
    field: "username",
    headerClassName: "super-app-theme--header",
    headerName: "Username",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "empname",
    headerClassName: "super-app-theme--header",
    headerName: "Emp Name",
    flex: 0.5, // Proportional width
    minWidth: 150, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerClassName: "super-app-theme--header",
    headerName: "Email",
    flex: 0.5, // Proportional width
    minWidth: 200, // Minimum width to prevent shrinking
  },
  {
    field: "designationName",
    headerClassName: "super-app-theme--header",
    headerName: "Designation",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
  },
  {
    field: "phoneNumber",
    headerClassName: "super-app-theme--header",
    headerName: "Mobile No",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "dob",
    headerClassName: "super-app-theme--header",
    headerName: "Date of birth",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="flex w-full h-full items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "joiningDate",
    headerClassName: "super-app-theme--header",
    headerName: "Joining Date",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "panCard",
    headerClassName: "super-app-theme--header",
    headerName: "Pancard",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "action",
    headerClassName: "super-app-theme--header",
    headerName: "Action",
    flex: 0.5,
    minWidth: 140,
    renderCell: (params) => (
      <div className="flex justify-center items-center w-full h-full">
        <button
          onClick={() => handleNavigateToPreview(params.row)}
          className="bg-orange-500 md:text-base text-sm hover:bg-orange-600 flex justify-center items-center rounded-md text-white md:w-10 w-12 h-6 md:h-7"
        >
          <RemoveRedEyeOutlinedIcon
            style={{ fontSize: "1.2rem" }}
          ></RemoveRedEyeOutlinedIcon>
        </button>
      </div>
    ),
  },
];

export const latestColumns = [
  {
    field: "username",
    headerClassName: "super-app-theme--header",
    headerName: "Username",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "empname",
    headerClassName: "super-app-theme--header",
    headerName: "Emp Name",
    flex: 0.5, // Proportional width
    minWidth: 150, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerClassName: "super-app-theme--header",
    headerName: "Email",
    flex: 0.5, // Proportional width
    minWidth: 200, // Minimum width to prevent shrinking
  },
  {
    field: "designationName",
    headerClassName: "super-app-theme--header",
    headerName: "Designation",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
  },
  {
    field: "phoneNumber",
    headerClassName: "super-app-theme--header",
    headerName: "Mobile No",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "dob",
    headerClassName: "super-app-theme--header",
    headerName: "Date of birth",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="flex w-full h-full items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "joiningDate",
    headerClassName: "super-app-theme--header",
    headerName: "Joining Date",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "panCard",
    headerClassName: "super-app-theme--header",
    headerName: "Pancard",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
];

export const empMapColumns = [
  {
    field: "username",
    headerClassName: "super-app-theme--header",
    headerName: "Username",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "empname",
    headerClassName: "super-app-theme--header",
    headerName: "Emp Name",
    flex: 0.5, // Proportional width
    minWidth: 150, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerClassName: "super-app-theme--header",
    headerName: "Email",
    flex: 0.5, // Proportional width
    minWidth: 200, // Minimum width to prevent shrinking
  },
  {
    field: "phoneNumber",
    headerClassName: "super-app-theme--header",
    headerName: "Mobile No",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
  {
    field: "designationName",
    headerClassName: "super-app-theme--header",
    headerName: "Designation",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
  },
  {
    field: "dob",
    headerClassName: "super-app-theme--header",
    headerName: "Date of birth",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="flex w-full h-full items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "joiningDate",
    headerClassName: "super-app-theme--header",
    headerName: "Joining Date",
    flex: 0.5, // Proportional width
    minWidth: 120, // Minimum width to prevent shrinking
    renderCell: (params) => (
      <div className="w-full h-full flex items-center">
        <span>{formateDate(params.value)}</span>
      </div>
    ),
  },
  {
    field: "panCard",
    headerClassName: "super-app-theme--header",
    headerName: "Pancard",
    flex: 0.5, // Proportional width
    minWidth: 140, // Minimum width to prevent shrinking
  },
];

export const getUserReport = [
  {
    field: "Id",
    headerName: "ID",
    headerClassName: "super-app-theme--header",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "FirstName",
    headerName: "First Name",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "LastName",
    headerName: "Last Name",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "FullName",
    headerName: "Full Name",
    headerClassName: "super-app-theme--header",
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: "Gender",
    headerName: "Gender",
    headerClassName: "super-app-theme--header",
    flex: 0.6,
    minWidth: 100,
    renderCell: (params) => (
      <span>
        {params.value ? (params.value === "M" ? "Male" : "Female") : ""}
      </span>
    ),
  },
  {
    field: "Email",
    headerName: "Email",
    headerClassName: "super-app-theme--header",
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "Description",
    headerName: "Description",
    headerClassName: "super-app-theme--header",
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: "Designation",
    headerName: "Designation ID",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "Name",
    headerName: "Role Name",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "RoleID",
    headerName: "Role ID",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "IsActive",
    headerName: "Active",
    headerClassName: "super-app-theme--header",
    flex: 0.6,
    minWidth: 100,
    renderCell: (params) => <span>{params.row.IsActive ? "Yes" : "No"}</span>,
  },
  {
    field: "PanCard",
    headerName: "PAN Card",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 130,
  },
  {
    field: "CreatedBy",
    headerName: "Created By",
    headerClassName: "super-app-theme--header",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "CreatedDate",
    headerName: "Created Date",
    headerClassName: "super-app-theme--header",
    flex: 1.2,
    minWidth: 150,
    renderCell: (params) => <span>{formateDate(params.value)}</span>,
  },
  {
    field: "JoiningDate",
    headerName: "Joining Date",
    headerClassName: "super-app-theme--header",
    flex: 1.2,
    minWidth: 150,
    renderCell: (params) => <span>{formateDate(params.value)}</span>,
  },
];

export const fetchAllUsers = async () => {
  try {
    const response = await api.get(`/User/GetAllUsers`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const fetchTeam = async () => {
  try {
    const response = await api.get("User/MyTeam");
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
