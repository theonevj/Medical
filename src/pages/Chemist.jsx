import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import api from "../api";
import { useSelector } from "react-redux";

//Importing data
import {
  columns,
  empChemistColumn,
  getAllChemist,
  getAllChemistForEmployee,
} from "../data/chemistDataTable";

//Importing icons
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";
import { LoaderCircle } from "lucide-react";

export default function Chemist() {
  const fileUrl = "/ChemistList.xlsx";
  const { user } = useSelector((state) => state.auth);
  const [chemist, setChemist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChemist, setFilteredChemist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState(null);

  const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);

  const [errors, setErrors] = useState({});
  const [updateData, setUpdateData] = useState({
    chemistCode: 0,
    chemistName: "",
    gender: "",
    routeName: "",
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    chemistArea: "",
    vfreq: "",
    mobileNo: "",
    phone: "",
    contactPerson: "",
    chemistType: "",
    dob: "",
    isActive: 0,
    createdBy: 0,
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateData = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let newErrors = {};

    if (!updateData.chemistName)
      newErrors.chemistName = "Pleaes enter chemist name.";
    if (!updateData.gender) newErrors.gender = "Please select gender.";
    if (!updateData.email) newErrors.email = "Please enter email address.";
    else if (!emailRegex.test(updateData.email))
      newErrors.email = "Invalid email address.";
    if (!updateData.mobileNo) newErrors.mobileNo = "Please enter mobile no.";
    else if (updateData.mobileNo.length !== 10)
      newErrors.mobileNo = "Invlalid mobile no.";
    if (!updateData.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required.";
    if (!updateData.addressLine2)
      newErrors.addressLine2 = "Address Line 2 is required.";
    if (!updateData.pinCode) newErrors.pinCode = "Please enter pincode.";
    if (!updateData.routeName) newErrors.routeName = "Please enter route name.";
    if (!updateData.chemistArea)
      newErrors.chemistArea = "Please enter chemist area.";
    if (!updateData.contactPerson)
      newErrors.contactPerson = "Please enter contact person name.";
    if (!updateData.vfreq) newErrors.vfreq = "Pleaes enter visit frequency.";
    if (!updateData.dob) newErrors.dob = "Please enter dob.";
    if (!updateData.chemistType)
      newErrors.chemistType = "Please enter chemist type.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getChemistData = async () => {
    try {
      setLoading(true);
      let data = [];
      if (user.isAdmin) {
        data = await getAllChemist();
      } else {
        data = await getAllChemistForEmployee();
      }

      setChemist(data.map((item, index) => ({ ...item, id: index + 1 })));
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredChemist(() =>
        chemist.filter((chm) =>
          chm.chemistName
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
        )
      );
    } else {
      setFilteredChemist(chemist);
    }
  }, [searchQuery, chemist]);

  useEffect(() => {
    getChemistData();
  }, []);

  const [updatePopUp, setUpdatePopUp] = useState(false);

  //For updating data
  const handleOpenUpdateData = (data) => {
    const { id, ...updateData } = data;
    setUpdateData(updateData);
    setUpdatePopUp(true);
  };

  const handleCloseUpdateData = () => {
    setUpdateData({
      chemistCode: 0,
      chemistName: "",
      gender: "",
      routeName: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: "",
      chemistArea: "",
      vfreq: "",
      mobileNo: "",
      phone: "",
      contactPerson: "",
      chemistType: "",
      dob: "",
      isActive: 0,
      createdBy: 0,
    });
    setUpdatePopUp(false);
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    if (validateData) {
      try {
        setUpdateLoading(true);
        await api.post("/Chemist/UpdateChemist", updateData);
        await getChemistData();
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
    setSelectedId(data.chemistCode);
    setOpenConfirmPopUp(true);
  };

  const handleCloseConfirmPopUp = () => {
    setSelectedId(null);
    setOpenConfirmPopUp(false);
  };

  const handleRemoveChemist = async () => {
    if (selectedId) {
      try {
        const response = await api.post("/Chemist/DeleteChemist/", {
          ChemistCode: selectedId,
        });
        console.log(response);
        getChemistData();
        handleCloseConfirmPopUp();
        toast.success("Chemist deleted successfully.");
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

  const fetchHeadQuater = async () => {
    try {
      const response = await api.get(`/Headquarters`);
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHeadQuater();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select any file.");
    }
    try {
      setUploadLoading(true);
      let formData = new FormData();
      formData.append("file", file);
      await api.post("/ExcelFileUpload/UploadExcelForChemist", formData);
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

  let filterColumns = user.isAdmin ? columns : empChemistColumn;

  const handleCloseUploadModal = () => {
    setUploadModal(false);
    setSelectedHeadQuater(null);
  };

  return (
    <>
      {uploadModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Upload Excel File</h2>
            <div className="flex flex-col gap-1 mb-2">
              <label>Select Headquarter</label>
              <select
                className="p-1 border rounded-md w-full "
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
            <span>Are you sure to remove this chemist?</span>
            <div className="w-full mt-4 flex place-content-end gap-2">
              <button
                onClick={handleCloseConfirmPopUp}
                className="font-medium text-white rounded-md p-1 w-20 bg-blue-500 hover:bg-blue-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveChemist}
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
                  <label className="font-medium" htmlFor="chemistName">
                    Chemist Name <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.chemistName}
                      onChange={handleChange}
                      name="chemistName"
                      id="chemistName"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. John Doe"
                    ></input>
                    {errors.chemistName && (
                      <span className="text-sm text-red-500">
                        {errors.chemistName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="mobileNo">
                    Mobile No <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.mobileNo}
                      onChange={handleChange}
                      name="mobileNo"
                      id="mobileNo"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 876252"
                    ></input>
                    {errors.mobileNo && (
                      <span className="text-sm text-red-500">
                        {errors.mobileNo}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="mobileNo">
                    Gender <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <select
                      value={updateData.gender}
                      onChange={handleChange}
                      name="gender"
                      className="outline-none border py-1 px-1.5"
                      id="gender"
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
                  <label className="font-medium" htmlFor="addressLine1">
                    AddressLine 1{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.addressLine1}
                      onChange={handleChange}
                      name="addressLine1"
                      id="addressLine1"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 3-b High Tower"
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
                    AddressLine 2
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.addressLine2}
                      onChange={handleChange}
                      name="addressLine2"
                      id="addressLine2"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. West Street"
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="pinCode">
                    Pincode <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.pinCode}
                      onChange={handleChange}
                      name="pinCode"
                      id="pinCode"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 382512"
                    ></input>
                    {errors.pinCode && (
                      <span className="text-sm text-red-500">
                        {errors.pinCode}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="routeName">
                    Route Name <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
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
                  <label className="font-medium" htmlFor="chemistArea">
                    Chemist Area <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.chemistArea}
                      onChange={handleChange}
                      name="chemistArea"
                      id="chemistArea"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Nehrunagar"
                    ></input>
                    {errors.chemistArea && (
                      <span className="text-sm text-red-500">
                        {errors.chemistArea}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="phone">
                    Phone{" "}
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.phone}
                      onChange={handleChange}
                      name="phone"
                      id="phone"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. (101) - 1423"
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="contactPerson">
                    Contact Person{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.contactPerson}
                      onChange={handleChange}
                      name="contactPerson"
                      id="contactPerson"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. Raj"
                    ></input>
                    {errors.contactPerson && (
                      <span className="text-sm text-red-500">
                        {errors.contactPerson}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="vfreq">
                    Visiting Frequency{" "}
                    <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.vfreq}
                      onChange={handleChange}
                      name="vfreq"
                      id="vfreq"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ex. 5"
                    ></input>
                    {errors.vfreq && (
                      <span className="text-sm text-red-500">
                        {errors.vfreq}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="dob">
                    Date of Birth{" "}
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
                  <label className="font-medium" htmlFor="chemistType">
                    Chemist Type <span className="text-sm text-red-500">*</span>
                  </label>
                  <div className="flex flex-col">
                    <input
                      value={updateData.chemistType}
                      onChange={handleChange}
                      name="chemistType"
                      id="chemistType"
                      className="outline-none border py-1 px-1.5"
                      placeholder="Ortho"
                    ></input>
                    {errors.chemistType && (
                      <span className="text-sm text-red-500">
                        {errors.chemistType}
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
            Chemist Details
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-1.5 rounded-md hidden md:flex gap-1 items-center">
              <span>
                <SearchIcon></SearchIcon>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none bg-transparent"
                placeholder="Search Chemist..."
                type="text"
              ></input>
            </div>
            <span
              onClick={getChemistData}
              className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md"
            >
              <AutorenewIcon></AutorenewIcon>
            </span>
            {user.isAdmin && (
              <Link
                to={
                  user.isAdmin
                    ? "/admin/chemists/addnew"
                    : "/employee/chemists/addnew"
                }
              >
                <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
                  Add New Chemist
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="h-full py-4 px-3 gap-2 flex flex-col custom-shadow rounded-md bg-white">
          <div className="flex gap-2 w-full place-content-end">
            {user.isAdmin && (
              <>
                <button
                  onClick={() => setUploadModal(true)}
                  className="bg-indigo-500 rounded-md p-1.5 px-2 text-white "
                >
                  Upload File
                </button>
                <a href={fileUrl} download={"chemist.xlsx"}>
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
              rows={filteredChemist}
              columns={filterColumns(
                handleOpenUpdateData,
                handleOpenConfirmPopUp
              )}
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
