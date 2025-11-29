import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import api from "../api";
import { useSelector } from "react-redux";

//Importing icons
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";
import { LoaderCircle } from "lucide-react";

//Importing data
import {
  columns,
  filterDoctorColumns,
  getDoctors,
  getDoctorsForEmployee,
} from "../data/doctorsDataTable";
import { toast } from "react-toastify";

export default function Doctors() {
  const fileUrl = "/DoctorList.xlsx";
  const { user } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadquater, setSelectedHeadQuater] = useState(null);
  const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);

  const [updateData, setUpdateData] = useState({
    drName: "",
    drCode: 0,
    className: "",
    speciality: "",
    qualification: "",
    gender: "",
    routeName: "",
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    doctorArea: "",
    vfreq: "",
    mobileNo: "",
    phone: "",
    dob: "",
    isActive: 1,
    createdBy: 0,
  });

  const [errors, setErrors] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchHeadQuater = async () => {
    try {
      const response = await api.get("/Headquarters");
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHeadQuater();
  }, []);

  const validateData = () => {
    let newErrors = {};

    if (!updateData.drName) newErrors.drname = "Dr.name is required.";
    if (!updateData.className) newErrors.class = "Class is required.";
    if (!updateData.speciality)
      newErrors.speciality = "Speciality is required.";
    if (!updateData.qualification)
      newErrors.qualification = "Qualification is required.";
    if (!updateData.phone) newErrors.phone = "Phone is required.";
    if (!updateData.mobileNo) newErrors.mobileno = "Mobile number is required.";
    else if (updateData.mobileNo.length !== 10)
      newErrors.mobileno = "Invalid mobile number.";
    if (!updateData.gender) newErrors.gender = "Gender is required.";
    if (!updateData.doctorArea)
      newErrors.doctorArea = "Doctor area is required.";
    if (!updateData.dob) newErrors.dob = "Date of Birth is required.";
    if (!updateData.routeName) newErrors.routename = "Routename is required.";
    if (!updateData.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required.";
    if (!updateData.vfreq) newErrors.vfreq = "Visiting freq is required.";
    if (!updateData.addressLine2)
      newErrors.addressLine2 = "Address Line 2 is required.";
    if (!updateData.pinCode) newErrors.pincode = "Pincode is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (user.isAdmin) {
        data = await getDoctors();
      } else {
        data = await getDoctorsForEmployee();
      }

      if (data) {
        setDoctors(data.map((item, index) => ({ ...item, id: index + 1 })));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredDoctors(() =>
        doctors.filter((dr) =>
          dr.drName.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
      );
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchQuery, doctors]);

  useEffect(() => {
    fetchData();
  }, []);

  const [updatePopUp, setUpdatePopUp] = useState(false);

  const handleOpenUpdateData = (data) => {
    const { id, ...updateData } = data;
    setUpdateData(updateData);
    setUpdatePopUp(true);
  };

  const handleCloseUpdateData = () => {
    setUpdateData({
      drName: "",
      drCode: 0,
      className: "",
      speciality: "",
      qualification: "",
      gender: "",
      routeName: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: "",
      doctorArea: "",
      vfreq: "",
      mobileNo: "",
      phone: "",
      dob: "",
      isActive: 1,
      createdBy: 0,
    });
    setUpdatePopUp(false);
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    if (validateData) {
      try {
        setUpdateLoading(true);
        await api.post("/Doctor/UpdateDoctor", updateData);
        await fetchData();
        toast.success("Successfully chemist data updated.");
        handleCloseUpdateData();
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || "Something went wrong.");
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const handleOpenConfirmPopUp = (data) => {
    setSelectedId(data.drCode);
    setOpenConfirmPopUp(true);
  };

  const handleCloseConfirmPopUp = () => {
    setSelectedId(null);
    setOpenConfirmPopUp(false);
  };

  const handleRemoveDoctor = async () => {
    if (selectedId) {
      try {
        await api.post(`/Doctor/DeleteDoctor`, { doctorCode: selectedId });
        fetchData();
        handleCloseConfirmPopUp();
        toast.success("Doctor deleted successfully.");
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const handleFile = (e) => {
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Please upload an Excel file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select any file.");
    }
    if (!selectedHeadquater) {
      return toast.error("Please select headquarter.");
    }
    try {
      setUploadLoading(true);
      let formData = new FormData();
      formData.append("file", file);
      await api.post(
        `/ExcelFileUpload/UploadExcelForDoctor?hqid=${selectedHeadquater}`,
        formData
      );
      setFile(null);
      setUploadModal(false);
      toast.success("Your data inserted successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCloseUploadModal = () => {
    setSelectedHeadQuater(null);
    setUploadModal(false);
  };

  let docColumns = user.isAdmin ? columns : filterDoctorColumns;

  return (
    <>
      {uploadModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Upload Excel File</h2>
            <div className="flex flex-col gap-1">
              <label>
                Select Headquarter{" "}
                <span className="text-sm text-red-500">*</span>
              </label>
              <select
                value={selectedHeadquater}
                className="w-full p-1 border rounded-md mb-4"
                onChange={(e) => setSelectedHeadQuater(e.target.value)}
              >
                <option value={""}>--- Select HeadQuaeter ---</option>
                {headQuater.map((item, index) => (
                  <option key={index} value={item.hqid}>
                    {item.hqName}
                  </option>
                ))}
              </select>
            </div>
            <input onChange={handleFile} type="file" accept=".xlsx, .xls" />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => handleCloseUploadModal()}
              >
                Cancel
              </button>
              <button
                disabled={updateLoading}
                onClick={handleUpload}
                className="px-4 flex justify-center items-center py-2 bg-blue-600 text-white rounded"
              >
                {uploadLoading ? (
                  <LoaderCircle className="animate-spin"></LoaderCircle>
                ) : (
                  <span>Upload</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {openConfirmPopUp && (
        <div className="fixed z-50 flex justify-center items-center inset-0 bg-black/50">
          <div className="bg-white w-96 rounded-md p-4 flex flex-col">
            <h1 className="font-medium text-lg">Confirmation</h1>
            <span>Are you sure to remove this doctor?</span>
            <div className="w-full mt-4 flex place-content-end gap-2">
              <button
                onClick={handleCloseConfirmPopUp}
                className="font-medium text-white rounded-md p-1 w-20 bg-blue-500 hover:bg-blue-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveDoctor}
                className="font-medium text-white rounded-md p-1 w-20 bg-red-500 hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {updatePopUp && (
        <div className="flex justify-center items-center z-50 fixed inset-0 bg-black/40">
          <div className="bg-white rounded-md shadow w-4/5 md:w-1/2 flex flex-col gap-2">
            <div className="flex px-4 py-4 border-b justify-between items-center">
              <h1 className="text-lg font-semibold">
                Edit Chemist Information
              </h1>
              <span
                onClick={handleCloseUpdateData}
                className="bg-gray-500 cursor-pointer w-5 transition-colors h-5 flex justify-center items-center hover:bg-red-500 text-white rounded-full"
              >
                <CloseIcon style={{ fontSize: ".9rem" }}></CloseIcon>
              </span>
            </div>
            <div className="px-4 py-4">
              <form
                onSubmit={handleUpdateData}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="drName">
                    Dr Name <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.drName}
                      onChange={handleChange}
                      name="drName"
                      id="drName"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. John Doe"
                    ></input>
                    {errors.drName && (
                      <span className="text-sm text-red-500">
                        {errors.drName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="className">
                    Classname <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.className}
                      onChange={handleChange}
                      name="className"
                      id="className"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. +A"
                    ></input>
                    {errors.className && (
                      <span className="text-sm text-red-500">
                        {errors.className}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="speciality">
                    Speciality <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.speciality}
                      onChange={handleChange}
                      name="speciality"
                      id="speciality"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Ortho"
                    ></input>
                    {errors.speciality && (
                      <span className="text-sm text-red-500">
                        {errors.speciality}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="qualification">
                    {" "}
                    Qualification{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.qualification}
                      onChange={handleChange}
                      name="qualification"
                      id="qualification"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. M.D"
                    ></input>
                    {errors.qualification && (
                      <span className="text-sm text-red-500">
                        {errors.qualification}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="mobileNo">
                    {" "}
                    Mobile No <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      value={updateData.mobileNo}
                      onChange={handleChange}
                      name="mobileNo"
                      id="mobileNo"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 982725..."
                    ></input>
                    {errors.mobileNo && (
                      <span className="text-sm text-red-500">
                        {errors.mobileNo}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="dob">
                    {" "}
                    Date Of Birth{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="date"
                      value={updateData.dob}
                      onChange={handleChange}
                      name="dob"
                      id="dob"
                      className="outline-none border py-1 px-1.5"
                    ></input>
                    {errors.dob && (
                      <span className="text-sm text-red-500">{errors.dob}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="gender">
                    {" "}
                    Gender <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <select
                      value={updateData.gender}
                      name="gender"
                      id="gender"
                      className="outline-none border py-1 px-1.5"
                    >
                      <option value={""}>--- Select Gender ---</option>
                      <option value={"M"}>Male</option>
                      <option value={"F"}>Female</option>
                    </select>
                    {errors.gender && (
                      <span className="text-sm text-red-500">
                        {errors.gender}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="phone">
                    {" "}
                    Phone <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.phone}
                      onChange={handleChange}
                      name="phone"
                      id="phone"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. (101) 6252"
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="routeName">
                    {" "}
                    Route Name <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.routeName}
                      onChange={handleChange}
                      name="routeName"
                      id="routeName"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Jabalpur"
                    ></input>
                    {errors.routeName && (
                      <span className="text-sm text-red-500">
                        {errors.routeName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="addressLine1">
                    {" "}
                    AddressLine 1{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.addressLine1}
                      onChange={handleChange}
                      name="addressLine1"
                      id="addressLine1"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 3-b New Tower"
                    ></input>
                    {errors.addressLine1 && (
                      <span className="text-sm text-red-500">
                        {errors.addressLine1}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="addressLine2">
                    {" "}
                    AddressLine 2{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.addressLine2}
                      onChange={handleChange}
                      name="addressLine2"
                      id="addressLine2"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Near Home Street"
                    ></input>
                    {errors.addressLine2 && (
                      <span className="text-sm text-red-500">
                        {errors.addressLine2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="pinCode">
                    {" "}
                    Pincode <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.pinCode}
                      onChange={handleChange}
                      name="pinCode"
                      id="pinCode"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 652421"
                    ></input>
                    {errors.pinCode && (
                      <span className="text-sm text-red-500">
                        {errors.pinCode}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="doctorArea">
                    {" "}
                    Doctor Area <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.doctorArea}
                      onChange={handleChange}
                      name="doctorArea"
                      id="doctorArea"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Nehrunagar"
                    ></input>
                    {errors.doctorArea && (
                      <span className="text-sm text-red-500">
                        {errors.doctorArea}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="vfreq">
                    {" "}
                    Visiting Frequency{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={updateData.vfreq}
                      onChange={handleChange}
                      name="vfreq"
                      id="vfreq"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 2"
                    ></input>
                    {errors.vfreq && (
                      <span className="text-sm text-red-500">
                        {errors.vfreq}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex place-content-end">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseUpdateData}
                      className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white font-medium p-1 rounded-md w-20"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={updateLoading}
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 flex justify-center items-center transition-all duration-300 text-white font-medium p-1 rounded-md w-20"
                    >
                      {updateLoading ? (
                        <LoaderCircle className="animate-spin"></LoaderCircle>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-full flex-col gap-3 md:gap-4">
        <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
          <h1 className="text-gray-600 text-base md:text-lg font-medium">
            Doctors Details
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 md:flex p-1.5 rounded-md hidden gap-1 items-center">
              <span>
                <SearchIcon></SearchIcon>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none bg-transparent"
                placeholder="Search Doctors..."
                type="text"
              ></input>
            </div>
            <span
              onClick={fetchData}
              className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border-slate-200 border flex justify-center items-center rounded-md"
            >
              <AutorenewIcon></AutorenewIcon>
            </span>
            {user.isAdmin && (
              <Link to={`/${user?.isAdmin ? "admin" : "employee"}/doctors/addnew`}>
                <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
                  Add New Doctor
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="h-full flex flex-col gap-2 py-4 px-3 custom-shadow rounded-md bg-white">
          <div className="flex gap-2 w-full place-content-end">
            {user.isAdmin && (
              <>
                <button
                  onClick={() => setUploadModal(true)}
                  className="bg-indigo-500 rounded-md p-1.5 px-2 text-white "
                >
                  Upload File
                </button>
                <a href={fileUrl} download={"doctor.xlsx"}>
                  <button className="bg-green-500 px-2 text-white p-1.5 rounded-md">
                    Download File
                  </button>
                </a>
              </>
            )}
          </div>
          <Box
            sx={{
              height: "95%",
              "& .super-app-theme--header": {
                backgroundColor: "#edf3fd",
              },
            }}
          >
            <DataGrid
              rows={filteredDoctors}
              columns={docColumns(handleOpenUpdateData, handleOpenConfirmPopUp, fetchData)}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 25]}
              disableRowSelectionOnClick
            />
          </Box>
        </div>
      </div>
    </>
  );
}
