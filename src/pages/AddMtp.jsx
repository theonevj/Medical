import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

//Importing icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { LoaderCircle, Search } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";

import { toast } from "react-toastify";
import api from "../api";

import { mtpcolumns } from "../data/mtpTable";
import Select from "react-select";

function AddMtp() {
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [chemist, setChemist] = useState([]);
  const [initialHeadQuarterId, setInitialHeadQuarterId] = useState(null);
  const [headQuarterId, setHeadQuarterId] = useState("");
  const [stp, setStp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mtpRow, setMtpRow] = useState([]);
  const [product, setProduct] = useState([]);

  const [selectedStp, setSelectedStp] = useState(null);
  const [mtpDate, setSelectedMtpDate] = useState(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [pendingStpChange, setPendingStpChange] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [openUser, setOpenUser] = useState(false);

  const userdropdownref = useRef(null);

  const productdropdownref = useRef(null);

  let docchem = [...doctors, ...chemist];

  const handleClickOutside = (event) => {
    if (
      userdropdownref.current &&
      !userdropdownref.current.contains(event.target)
    ) {
      setOpenUser(false);
    }

    if (
      productdropdownref.current &&
      !productdropdownref.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState({
    user: [],
    doctor: null,
    description: "",
    headQuarterId: "",
    modeOfWork: "",
    product: [],
  });

  useEffect(() => {
    const fetchStps = async () => {
      const stpObj = {
        pageNumber: 0,
        pageSize: 0,
        criteria: "string",
        reportingTo: 0,
        tourType: 0,
      };

      try {
        const response = await api.post("/STPMTP/GetAll", stpObj);
        setStp(response.data.data);
      } catch (err) {
        console.error("Failed to fetch STPs:", err);
        toast.error("Failed to fetch STPs.");
      }
    };

    fetchStps();
  }, [users]);

  useEffect(() => {
    if (headQuarterId) {
      const fetchUsers = async () => {
        try {
          const response = await api.get(
            "/User/GetReportingToMtp?hqid=" + headQuarterId
          );
          setUsers(response.data.data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch users.");
        }
      };
      fetchUsers();
    }
  }, [headQuarterId]);

  // useEffect(() => {
  //   const fetchDoctorsChemists = async () => {
  //     try {
  //       const [doctors, chemists] = await Promise.all([
  //         api.get("/Doctor/GetAllDoctor"),
  //         api.get("/Chemist/GetAllChemist"),
  //       ]);

  //       setDoctors(doctors.data.data);
  //       setChemist(chemists.data.data);
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to fetch doctors/chemists.");
  //     }
  //   };
  //   fetchDoctorsChemists();
  // }, []);

  useEffect(() => {
    if (!headQuarterId) return;

    const fetchDoctorsChemists = async () => {
      const objReq = {
        hqid: parseInt(headQuarterId) || 1,
      };

      try {
        const [doctors] = await Promise.all([
          api.post("/Doctor/GetAllDocChemByHdID", objReq),
          // api.get("/Chemist/GetAllChemist"),
        ]);

        setDoctors(doctors.data.data);
        // setChemist(chemists.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch doctors/chemists.");
      }
    };

    fetchDoctorsChemists();
  }, [headQuarterId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/Product");
        setProduct(response.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  // const fetchData = async () => {
  //   let stpObj = {
  //     pageNumber: 0,
  //     pageSize: 0,
  //     criteria: "string",
  //     reportingTo: 0,
  //     tourType: 0,
  //   };
  //   try {
  //     const [users, doctors, chemists, stps, products] = await Promise.all([
  //       api.get("/User/GetReportingToMtp"),
  //       api.get("/Doctor/GetAllDoctor"),
  //       api.get("/Chemist/GetAllChemist"),
  //       api.post("/STPMTP/GetAll", stpObj),
  //       api.get("/Product"),
  //     ]);

  //     console.log(users.data.data);

  //     setUsers(users.data.data);
  //     setDoctors(doctors.data.data);
  //     setChemist(chemists.data.data);
  //     setStp(stps.data.data);
  //     setProduct(products.data.data);

  //     console.log(users.data.data);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Something went wrong.");
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "user" || name === "stp" || name === "doctor") {
      if (value) {
        let parsedValue = JSON.parse(value);

        if (name === "stp") {
          const newHeadQuarter = parsedValue.headQuarter;

          if (mtpRow.length > 0 && newHeadQuarter !== initialHeadQuarterId) {
            setShowResetModal(true);
            if (pendingStpChange) {
              setFormData({
                user: [],
                doctor: null,
                description: "",
                headQuarterId: newHeadQuarter,
                modeOfWork: "",
                product: [],
              });
              setInitialHeadQuarterId(newHeadQuarter);
              setSelectedStp(parsedValue);
              setHeadQuarterId(newHeadQuarter);
            }
            return;
          }

          setSelectedStp(parsedValue);
          setHeadQuarterId(newHeadQuarter);
          setFormData((prev) => ({
            ...prev,
            stp: parsedValue,
            headQuarterId: newHeadQuarter,
          }));
          return;
        }

        setFormData((prevData) => ({ ...prevData, [name]: parsedValue }));
      } else {
        setFormData((prevData) => ({ ...prevData, [name]: null }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateData = () => {
    let newErrors = {};

    if (!formData.doctor) newErrors.doc = "Please select doctor or chemist.";
    if (!formData.description)
      newErrors.description = "Please enter description.";
    if (formData.product.length === 0)
      newErrors.product = "Please select any one product.";
    if (!formData.modeOfWork)
      newErrors.modeOfWork = "Please select Mode of work.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateFinaleData = () => {
    let newErrors = {};

    if (!selectedStp) newErrors.stp = "Please select stp.";
    if (!mtpDate) newErrors.mtpDate = "Please select mtp date.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFinaleData()) {
      try {
        setLoading(true);
        let obj = {
          mtpID: 0,
          stpID: selectedStp.tourID,
          mtpDate: mtpDate,
          mtpdetailrequests: mtpRow.map((mtp) => ({
            prodIDs: mtp.product.map((item) => item.prodId),
            superiorID: mtp.user.map((user) => user.codeID),
            modeOfWork: mtp.modeOfWork,
            docID: mtp.doctor?.drCode || mtp.doctor?.chemistCode,
            visitedType: mtp.doctor?.visitedType,
            description: mtp.description,
          })),
        };

        console.log("MTPhandleSubmit:", obj);

        const response = await api.post("/STPMTP/addMTP", obj);

        if (response.data.statusCode === 500) {
          toast.error(
            "Mtp is already added./Can not submit date other than today and yesterday."
          );
          console.log(response.data);
          return;
        }

        toast.success("Successfully mtp created.");
        setMtpRow([]);
        setSelectedStp(null);
        setSelectedMtpDate("");
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    console.log("Add clicked");
    if (validateData()) {
      if (!initialHeadQuarterId) {
        setInitialHeadQuarterId(formData.headQuarterId);
      }
      setMtpRow((prevData) => [
        { id: prevData.length + 1, ...formData },
        ...prevData,
      ]);
      setFormData({
        user: [],
        doctor: null,
        product: [],
        headQuarterId: "",
        description: "",
        modeOfWork: "",
      });
    }
  };

  const handleRemove = (id) => {
    setMtpRow(() => mtpRow.filter((item) => item.id !== id));
  };

  const handleSelectProduct = (item) => {
    const existProduct = formData.product.find(
      (pd) => pd.prodId === item.prodId
    );

    if (existProduct) {
      let filterProduct = formData.product.filter(
        (pd) => pd.prodId !== item.prodId
      );
      setFormData((prevData) => ({ ...prevData, product: filterProduct }));
    } else {
      let addProduct = [...formData.product, item];
      setFormData((prev) => ({ ...prev, product: addProduct }));
    }
  };

  const handleSelectUser = (item) => {
    const existUser = formData.user.find((u) => u.codeID === item.codeID);

    if (existUser) {
      let filterUser = formData.user.filter((u) => u.codeID !== item.codeID);
      setFormData((prevData) => ({ ...prevData, user: filterUser }));
    } else {
      if (formData.user.length >= 1)
        return toast.warning("Maximum 1 user are allow to work with you.");
      let addUser = [...formData.user, item];
      setFormData((prev) => ({ ...prev, user: addUser }));
    }
  };

  const filterOption = (option, inputValue) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  const filteredProducts = product.filter((item) =>
    item?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((name) =>
    name?.user?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={user.isAdmin ? "/admin/mtpplan" : "/employee/mtpplan"}>
            <span className="text-gray-600 cursor-pointer">
              <ArrowBackIosIcon
                style={{ fontSize: "1.4rem" }}
              ></ArrowBackIosIcon>
            </span>
          </Link>
          <h1 className="text-gray-800 text-base md:text-lg font-medium">
            Add Monthly Tour Plan
          </h1>
        </div>
      </div>
      <div className="bg-white h-full custom-shadow flex flex-col gap-4 rounded-md md:py-4 py-3 px-3 md:px-4">
        <div className="grid md:grid-cols-2 gap-4 grid-cols-1 mb-2 items-center">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Select STP <span className="text-sm text-red-500">*</span>
            </label>
            <select
              name="stp"
              value={JSON.stringify(selectedStp)}
              onChange={handleChange}
              className="p-2 border border-gray-200 outline-none"
            >
              <option value={""}>--Select Stp---</option>
              {stp.map((item, index) => (
                <option key={index} value={JSON.stringify(item)}>
                  {item.tourName}
                </option>
              ))}
            </select>
            {errors.stp && (
              <span className="text-sm text-red-500">{errors.stp}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Select MTP Date <span className="text-sm text-red-500">*</span>
            </label>
            <input
              name="mtpDate"
              type="date"
              onChange={(e) => setSelectedMtpDate(e.target.value)}
              value={mtpDate}
              className="p-2 border border-gray-200 outline-none"
            ></input>
            {errors.mtpDate && (
              <span className="text-sm text-red-500">{errors.mtpDate}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-medium text-lg">Select Mtp Details</h1>

          <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Select Doctor/Chemist
                <span className="text-sm text-red-500">*</span>
              </label>

              <div className="flex justify-content-between items-center px-2 border border-gray-200">
                <SearchOutlinedIcon className=" text-gray-500" />
                <div className="flex-1 w-full">
                  <Select
                    options={docchem.map((item) => ({
                      value: JSON.stringify(item),
                      label: item.drName || item.chemistName,
                    }))}
                    onChange={(selectedOption) => {
                      const value = selectedOption
                        ? JSON.parse(selectedOption.value)
                        : null;
                      setFormData((prevData) => ({
                        ...prevData,
                        doctor: value,
                      }));
                    }}
                    placeholder="Search..."
                    isSearchable
                    isClearable
                    isMulti={false}
                    filterOption={filterOption}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        border: "none",
                        outline: "none",
                        borderColor: "none",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "none",
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? "#78716c" : "",
                        color: state.isFocused ? "white" : "#374151",
                        "&:active": {
                          backgroundColor: "#D1D5DB",
                        },
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "gray",
                      }),
                    }}
                    className="outline-none"
                  />
                </div>
              </div>
              {errors.doc && (
                <span className="text-sm text-red-500">{errors.doc}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Work With</label>

              <div className="relative w-full">
                <div
                  onClick={() => setOpenUser((prev) => !prev)}
                  className="p-1.5 cursor-pointer border flex gap-2 justify-between items-center  "
                >
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="px-4 border-none rounded-md focus:outline-none focus:ring-none  placeholder-neutral-400  "
                  />

                  <span>
                    {open ? (
                      <ChevronUp className="w-5 h-5 text-gray-600"></ChevronUp>
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600"></ChevronDown>
                    )}
                  </span>
                </div>
                {(openUser || userSearchTerm.length !== 0) && (
                  <div
                    ref={userdropdownref}
                    className="absolute h-24 overflow-scroll w-full shadow bg-white z-40"
                  >
                    {filteredUsers.map((item, index) => (
                      <div
                        key={index}
                        className="grid p-2 grid-cols-4 items-center gap-2"
                      >
                        <input
                          onChange={() => handleSelectUser(item)}
                          className="col-span-1"
                          checked={formData.user.includes(item)}
                          type="checkbox"
                        ></input>
                        <span className="text-md col-span-3">
                          {item.codeName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {errors.user && (
                  <span className="text-sm text-red-500">{errors.user}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Description <span className="text-sm text-red-500">*</span>
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                type="text"
                value={formData.description}
                placeholder="enter description"
                className="p-2 border border-gray-200 outline-none"
              ></textarea>
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Mode Of Work <span className="text-sm text-red-500">*</span>
              </label>
              <select
                name="modeOfWork"
                value={formData.modeOfWork}
                onChange={handleChange}
                className="p-2 outline-none border-2 border-gray-200 "
              >
                <option value={""}>--- Select Mode Of Work ---</option>
                <option value={"MEETING"}>MEETING</option>
                <option value={"TRANSIT"}>TRANSIT</option>
                <option value={"STRIKE"}>STRIKE</option>
                <option value={"CAMP"}>CAMP</option>
                <option value={"CALL"}>CALL</option>
                <option value={"Other"}>Other</option>
              </select>
              {errors.modeOfWork && (
                <span className="text-sm text-red-500">
                  {errors.modeOfWork}
                </span>
              )}
            </div>

            <div ref={productdropdownref} className="flex w-72 flex-col gap-2">
              <label className="font-medium" htmlFor="allowance">
                Products <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-1.5 cursor-pointer border flex gap-2 justify-between items-center  "
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="px-4 border-none rounded-md focus:outline-none focus:ring-none  placeholder-neutral-400  "
                  />

                  <span>
                    {open ? (
                      <ChevronUp className="w-5 h-5 text-gray-600"></ChevronUp>
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600"></ChevronDown>
                    )}
                  </span>
                </div>

                {(open || searchTerm.length !== 0) && (
                  <div className="absolute h-72 overflow-scroll w-full shadow bg-white z-40">
                    {filteredProducts.map((item, index) => (
                      <div
                        key={index}
                        className="grid p-2 grid-cols-4 items-center gap-2 font-semibold hover:bg-neutral-500 hover:text-white"
                      >
                        <input
                          onChange={() => {
                            handleSelectProduct(item);
                            setSearchTerm("");
                            setOpen(true);
                          }}
                          className="w-full text-center col-span-1 w-5 h-5 text-neutral-600 bg-white border-2 border-gray-300 rounded-md  cursor-pointer"
                          checked={formData.product.includes(item)}
                          type="checkbox"
                        ></input>
                        <span className="text-md col-span-3">
                          {item.productName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {errors.product && (
                  <span className="text-sm text-red-500">{errors.product}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full place-content-end">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-themeblue cursor-pointer text-white p-2 w-20"
          >
            {loading ? (
              <LoaderCircle className="animate-spin"></LoaderCircle>
            ) : (
              <span>Add</span>
            )}
          </button>
        </div>
      </div>
      <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white">
        <Box
          sx={{
            height: "100%",
            "& .super-app-theme--header": {
              backgroundColor: "#edf3fd",
            },
          }}
        >
          <DataGrid
            rows={mtpRow}
            columns={mtpcolumns(handleRemove)}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <div
        onClick={handleSubmit}
        className="p-2 bg-white flex place-content-end"
      >
        <button
          disabled={mtpRow.length === 0}
          className="w-36  disabled:bg-gray-500 disabled:cursor-not-allowed p-2 font-medium flex justify-center items-center bg-themeblue text-white"
        >
          {loading ? (
            <LoaderCircle className="animate-spin"></LoaderCircle>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Changes</h2>
            <p className="mb-6">
              Changing the Headquarter will reset all added data. Do you want to
              continue?
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowResetModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  setShowResetModal(false);
                  setPendingStpChange(true);
                  setMtpRow([]);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMtp;
