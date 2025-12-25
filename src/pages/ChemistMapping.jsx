// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Box from "@mui/material/Box";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// //importing icons
// import AutorenewIcon from "@mui/icons-material/Autorenew";
// import { LoaderCircle, UserSearch } from "lucide-react";

// import { chemistMapColumns, getAllChemist } from "../data/chemistDataTable";
// import { empMapColumns, fetchAllUsers } from "../data/EmployeeDataTable";
// import api from "../api";

// const prepareObj = (chemistList, employee) => {
//   console.log(employee);
//   return chemistList.map((chemist) => ({
//     chemistCode: chemist.chemistCode,
//     employeeCode: employee.id,
//   }));
// };

// function ChemistMapping() {
//   const { user } = useSelector((state) => state.auth);

//   const [loading, setLoading] = useState(false);
//   const [saveLoader, setSaveLoader] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [filterUsers, setFilterUsers] = useState([]);
//   const [filterChemist, setFilterChemist] = useState([]);
//   const [userSearch, setUserSearch] = useState("");
//   const [chemistSearch, setChemistSearch] = useState("");
//   const [chemist, setChemist] = useState([]);
//   const [selectedChemist, setSelectedChemist] = useState([]);

//   const [selectedEmployee, setSelectedEmployee] = useState([]);
//   const [selectedEmpIdx, setSelectedEmpIdx] = useState([]);
//   const [selectedChemIdx, setSelectedChemIdx] = useState([]);

//   const [headQuater, setHeadQuater] = useState([]);
//   const [selectedHeadQuater, setSelectedHeadQuater] = useState("");

//   console.log("filterUsers(chemistMapping):-", filterUsers);
//   console.log("filterChemist(chemistMapping):-", filterChemist);

//   const fetchHeadQuater = async () => {
//     try {
//       const response = await api.get("Headquarters");
//       setHeadQuater(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   //Get employee mapping data with chemist
//   const getEmpChemistMapping = async () => {
//     try {
//       const response = await api.get(
//         `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
//       );
//       let data = response.data.data.result;

//       setSelectedChemIdx(data.map((item) => item.chemistCode));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     if (selectedEmpIdx.length > 0) {
//       getEmpChemistMapping();
//     }
//   }, [selectedEmpIdx]);

//   //Fetch data get all chemist data
//   const getChemistData = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllChemist();
//       setChemist(data.map((item) => ({ ...item, id: item.chemistCode })));
//     } catch (err) {
//       console.log(err);
//       toast.error(err.response.data.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //Fetch data for get all employees
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchAllUsers();
//       setUsers(users);
//       console.log(users);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllData = () => {
//     getChemistData();
//     fetchData();
//   };

//   useEffect(() => {
//     if (selectedHeadQuater) {
//       setFilterChemist(
//         chemist.filter((item) => Number(item.headquarter) == selectedHeadQuater)
//       );
//       setFilterUsers(
//         users.filter((item) => Number(item.headQuater) == selectedHeadQuater)
//       );
//     } else {
//       setFilterChemist(chemist);
//       setFilterUsers(users);
//     }
//   }, [selectedHeadQuater, chemist, users]);

//   useEffect(() => {
//     fetchAllData();
//     fetchHeadQuater();
//   }, []);

//   const mappedUsers = filterUsers.map((items) => ({
//     ...items,
//     empname: `${items.firstName} ${items.lastName}`.toLowerCase(),
//   }));

//   const filteredEmployee = mappedUsers.filter(
//     (items) =>
//       items?.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
//       items?.empname?.toLowerCase().includes(userSearch.toLowerCase()) ||
//       items?.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
//       items?.phoneNumber?.toLowerCase().includes(userSearch.toLowerCase()) ||
//       items?.designationName
//         ?.toLowerCase()
//         .includes(userSearch.toLowerCase()) ||
//       items?.joiningDate?.toLowerCase().includes(userSearch.toLowerCase()) ||
//       items?.panCard?.toLowerCase().includes(userSearch.toLowerCase())
//   );

//   const filteredChemist = filterChemist.filter(
//     (items) =>
//       items?.chemistName?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.mobileNo?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.addressLine1
//         ?.toLowerCase()
//         .includes(chemistSearch.toLowerCase()) ||
//       items?.addressLine2
//         ?.toLowerCase()
//         .includes(chemistSearch.toLowerCase()) ||
//       items?.pinCode?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.chemistArea?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.vfreq?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.phone?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.gender?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.contactPerson
//         ?.toLowerCase()
//         .includes(chemistSearch.toLowerCase()) ||
//       items?.routeName?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.dob?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.chemistType?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
//       items?.dob?.toLowerCase().includes(chemistSearch.toLowerCase())
//   );

//   const handleSelectChemist = (newChemist) => {
//     setSelectedChemIdx(newChemist);
//     setSelectedChemist(
//       chemist.filter((item, index) => newChemist.includes(index + 1))
//     );
//   };

//   const handleSelectEmployee = (newEmployee) => {
//     setSelectedEmpIdx(newEmployee);
//     setSelectedEmployee(
//       users.find((item, index) => item.id === newEmployee[0])
//     );
//   };

//   const handleSave = async () => {
//     let mappingObj = {
//       chemistsMappingList: prepareObj(selectedChemist, selectedEmployee),
//       employeeCode: user.id,
//       isActive: 1,
//       createdBy: 0,
//     };
//     try {
//       console.log(mappingObj);
//       setSaveLoader(true);
//       await api.post("/ChemistMapping/AddChemistMapping", mappingObj);
//       setSelectedChemist([]);
//       setSelectedEmployee([]);
//       setSelectedEmpIdx([]);
//       setSelectedChemIdx([]);
//       toast.success("New chemist mapping created successfully.");
//     } catch (err) {
//       console.log(err);
//       toast.error("Something went wrong.");
//     } finally {
//       setSaveLoader(false);
//     }
//   };

//   return (
//     <div className="flex h-full flex-col gap-3 md:gap-4">
//       <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
//         <h1 className="text-gray-600 text-base md:text-lg font-medium">
//           Chemist Mapping
//         </h1>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2">
//             <span>HeadQuater:</span>
//             <select
//               onChange={(e) => setSelectedHeadQuater(e.target.value)}
//               className="rounded-md border-neutral-200 border p-1 outline-none"
//             >
//               <option value="">All Headquater</option>
//               {headQuater.map((item) => (
//                 <option value={item.hqid}>{item.hqName}</option>
//               ))}
//             </select>
//           </div>
//           <span
//             onClick={() => fetchAllData}
//             className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md"
//           >
//             <AutorenewIcon></AutorenewIcon>
//           </span>
//         </div>
//       </div>

//       <div className="h-auto grid md:grid-cols-2 grid-cols-1 items-center gap-2">
//         <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white">
//           <div className="flex justify-between items-center mb-2">
//             <h1 className="mb-2 font-medium text-lg">Employee</h1>

//             <input
//               type="text"
//               value={userSearch}
//               onChange={(e) => setUserSearch(e.target.value)}
//               placeholder="Search Employee..."
//               className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <Box
//             sx={{
//               height: "90%",
//             }}
//           >
//             <DataGrid
//               rows={filteredEmployee}
//               columns={empMapColumns}
//               loading={loading}
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     pageSize: 5,
//                   },
//                 },
//               }}
//               pageSizeOptions={[5, 10]}
//               sx={{
//                 "& .MuiDataGrid-row.Mui-selected": {
//                   backgroundColor: "#c8e6c9", // light green
//                   color: "#2e7d32", // darker green text
//                 },
//               }}
//               // checkboxSelection
//               rowSelectionModel={selectedEmpIdx}
//               onRowSelectionModelChange={(newSelected) => {
//                 // Allow only one selection
//                 const selected = Array.isArray(newSelected)
//                   ? newSelected[0]
//                   : newSelected;
//                 handleSelectEmployee(selected ? [selected] : []);
//               }}
//             />
//           </Box>
//         </div>

//         <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white">
//           <div className="flex justify-between items-center mb-2">
//             <h1 className="mb-2 font-medium text-lg">Chemist</h1>
//             <input
//               type="text"
//               value={chemistSearch}
//               onChange={(e) => setChemistSearch(e.target.value)}
//               placeholder="Search Chemist..."
//               className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <Box
//             sx={{
//               height: "90%",
//             }}
//           >
//             <DataGrid
//               rows={filteredChemist}
//               columns={chemistMapColumns}
//               loading={loading}
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     pageSize: 5,
//                   },
//                 },
//               }}
//               pageSizeOptions={[5, 10]}
//               checkboxSelection
//               rowSelectionModel={selectedChemIdx}
//               onRowSelectionModelChange={(newSelected) =>
//                 handleSelectChemist(newSelected)
//               }
//             />
//           </Box>
//         </div>
//       </div>

//       <div className="flex place-content-center  items-center rounded-md custom-shadow p-2 bg-white">
//         <button
//           disabled={
//             selectedChemist.length === 0 || selectedEmployee.length === 0
//           }
//           onClick={handleSave}
//           className={`bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-24 p-1`}
//         >
//           {saveLoader ? (
//             <div className="flex items-center gap-2">
//               <LoaderCircle className="animate-spin"></LoaderCircle>
//               Loading..
//             </div>
//           ) : (
//             <span>Save</span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChemistMapping;


import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { LoaderCircle } from "lucide-react";
import { chemistMapColumns, getAllChemist } from "../data/chemistDataTable";
import { empMapColumns, fetchAllUsers } from "../data/EmployeeDataTable";
import api from "../api";
const prepareObj = (chemistList, employee) => {
  return chemistList.map((chemist) => ({
    chemistCode: chemist.chemistCode,
    employeeCode: employee.id,
  }));
};
function ChemistMapping() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [filterChemist, setFilterChemist] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [chemistSearch, setChemistSearch] = useState("");
  const [chemist, setChemist] = useState([]);
  const [selectedChemist, setSelectedChemist] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmpIdx, setSelectedEmpIdx] = useState([]);
  const [selectedChemIdx, setSelectedChemIdx] = useState([]);
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState("");
  // Pagination state for DataGrid
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const fetchHeadQuater = async (empId) => {
    if (!empId) {
      setHeadQuater([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/User/GetAllHQByUser", {
        params: { userID: empId },
      });
      setHeadQuater(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch headquarters");
    } finally {
      setLoading(false);
    }
  };
  ;
  // const getEmpChemistMapping = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get(
  //       `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
  //     );
  //     const data = response.data.data.result;
  //     setSelectedChemIdx(data.map((item) => item.chemistCode));
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   finally {
  //     setLoading(false);
  //   }
  // };
  const getEmpChemistMapping = async () => {
    if (!selectedEmpIdx || selectedEmpIdx.length === 0) {
      setSelectedChemIdx([]);
      setSelectedChemist([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(
        `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
      );
      const data = response.data?.data?.result || [];
      setSelectedChemIdx(data.map((item) => item.chemistCode));
      const mappedChemists = chemist.filter((c) =>
        data.some((mapped) => mapped.chemistCode === c.chemistCode)
      );
      setSelectedChemist(mappedChemists);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mapped chemists");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedEmpIdx.length > 0) {
  //     getEmpChemistMapping();
  //   } else {
  //     setSelectedChemIdx([]);
  //     setSelectedChemist([]);
  //   }
  // }, [selectedEmpIdx]);
  useEffect(() => {
    if (selectedEmpIdx.length > 0) {
      getEmpChemistMapping();
    } else {
      setSelectedChemIdx([]);
      setSelectedChemist([]);
    }
  }, [selectedEmpIdx, chemist]);

  const getChemistData = async () => {
    try {
      setLoading(true);
      const data = await getAllChemist();
      setChemist(data.map((item) => ({ ...item, id: item.chemistCode })));
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllData = () => {
    getChemistData();
    fetchData();
  };
  useEffect(() => {
    if (selectedHeadQuater) {
      //   setFilterChemist(
      //     chemist.filter((item) => Number(item.headquarter) === Number(selectedHeadQuater))
      //   );
      //   setFilterUsers(
      //     users.filter((item) => Number(item.headQuater) === Number(selectedHeadQuater))
      //   );
      // } else {
      //   setFilterChemist(chemist);
      //   setFilterUsers(users);
      // }
      setFilterChemist(
        chemist.filter((item) => Number(item.headquarter) === Number(selectedHeadQuater))
      )
    } else {
      setFilterChemist(chemist);
      setFilterUsers(users);
    }
  }, [selectedHeadQuater, chemist, users]);
  useEffect(() => {
    fetchAllData();
    // fetchHeadQuater();
  }, []);
  const mappedUsers = filterUsers.map((items) => ({
    ...items,
    empname: `${items.firstName} ${items.lastName}`.toLowerCase(),
  }));
  // Global search for employees
  const filteredEmployee = mappedUsers.filter((items) => {
    const query = userSearch.toLowerCase();
    return Object.values(items).some(
      (val) => val && val.toString().toLowerCase().includes(query)
    );
  });
  // Global search for chemists
  const filteredChemist = filterChemist?.filter((items) => {
    const query = chemistSearch.toLowerCase();
    return Object.values(items).some(
      (val) => val && val.toString().toLowerCase().includes(query)
    );
  });
  // const handleSelectChemist = (newChemist) => {
  //   console.log("newChemist:-", newChemist);
  //   setSelectedChemIdx(newChemist);
  //   setSelectedChemist(
  //     chemist.filter((item) => newChemist.includes(item.chemistCode))
  //   );
  // };
  const handleSelectChemist = (newChemist) => {
    setSelectedChemIdx(newChemist);
    setSelectedChemist(
      chemist.filter((item) => newChemist.includes(item.chemistCode))
    );
  };

  // const handleSelectEmployee = (newEmployee) => {
  //   setSelectedEmpIdx(newEmployee);
  //   setSelectedEmployee(users.find((item) => item.id === newEmployee[0]));
  // };

  const handleSelectEmployee = (val) => {
    const arr = val ? [Number(val)] : [];
    const emp = arr.length ? users.find((u) => u.id === arr[0]) : null;
    setSelectedEmpIdx(arr);
    setSelectedEmployee(
      arr.length ? users.find((u) => u.id === arr[0]) : null
    );
    // reset chemists on employee change
    setSelectedChemIdx([]);
    setSelectedChemist([]);
    if (emp) {
      fetchHeadQuater(emp.id);
    }
  };
  const handleSave = async () => {
    const mappingObj = {
      chemistsMappingList: prepareObj(selectedChemist, selectedEmployee),
      employeeCode: user.id,
      isActive: 1,
      createdBy: 0,
    };
    try {
      setSaveLoader(true);
      await api.post("/ChemistMapping/AddChemistMapping", mappingObj);
      setSelectedChemist([]);
      setSelectedEmployee([]);
      setSelectedEmpIdx([]);
      setSelectedChemIdx([]);
      toast.success("New chemist mapping created successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setSaveLoader(false);
    }
  };
  const mappedChemists = filterChemist
    .filter((c) => selectedChemIdx.includes(c.chemistCode))
    .filter((c) => {
      const query = chemistSearch.toLowerCase();
      return Object.values(c).some(
        (val) => val && val.toString().toLowerCase().includes(query)
      );
    });

  // GET DATA
  const handleGetData = () => {
    if (!selectedEmpIdx.length || !selectedHeadQuater) return;
    getChemistData();
    setFilterChemist(
      chemist.filter(
        (item) => Number(item.headquarter) === Number(selectedHeadQuater)
      )
    );
  };
  const handleRefresh = () => {
    setSelectedEmpIdx([]);
    setSelectedEmployee(null);
    setSelectedHeadQuater("");
    setSelectedChemIdx([]);
    setSelectedChemist([]);
    fetchAllData();
  };

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      {/* <div className="bg-white custom-shadow rounded-md py-3 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>HeadQuater:</span>
          <select
            value={selectedHeadQuater}
            onChange={(e) => setSelectedHeadQuater(e.target.value)}
            className="rounded-md border p-1"
          >
            <option value="">All HeadQuarter</option>
            {headQuater.map((hq) => (
              <option key={hq.hqid} value={hq.hqid}>
                {hq.hqName}
              </option>
            ))}
          </select>
        </div>
        <span
          onClick={fetchAllData}
          className="cursor-pointer w-8 h-8 border flex justify-center items-center rounded-md"
        >
          <AutorenewIcon />
        </span>
      </div>
      <div className="bg-white custom-shadow rounded-md py-3 px-3 flex items-center gap-2">
        <span>Employee:</span>
        <select
          value={selectedEmpIdx[0] || ""}
          onChange={(e) =>
            handleSelectEmployee(e.target.value ? [Number(e.target.value)] : [])
          }
          className="rounded-md border p-1"
        >
          <option value="">Select Employee</option>
          {filterUsers.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} ({emp.designationName})
            </option>
          ))}
        </select>
      </div> */}
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="min-w-[80px]">Employee:</span>
          <select
            value={selectedEmpIdx[0] || ""}
            onChange={(e) => handleSelectEmployee(e.target.value)}
            className="w-[260px] rounded-md border border-neutral-200 p-2 outline-none"
          >
            <option value="">Select Employee</option>
            {filterUsers.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.designationName})
              </option>
            ))}
          </select>
        </div>
        {/* HEADQUARTER */}
        <div className="flex items-center gap-2">
          <span>HeadQuarter:</span>
          <select
            value={selectedHeadQuater}
            disabled={!selectedEmpIdx.length}
            onChange={(e) => setSelectedHeadQuater(e.target.value)}
            className="rounded-md border-neutral-200 border p-1 outline-none disabled:bg-gray-100"
          >
            <option value="">Select HeadQuarter</option>
            {headQuater?.map((hq) => (
              <option key={hq.codeID} value={hq.codeID}>
                {hq.codeName}
              </option>
            ))}
          </select>
        </div>
        {/* GET DATA */}
        <button
          disabled={!selectedEmpIdx.length || !selectedHeadQuater}
          onClick={handleGetData}
          className="bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Get Data
        </button>
        {/* REFRESH */}
        <button
          // onClick={handleRefresh}
          className="border px-4 py-2 rounded-md flex items-center gap-1"
        >
          <AutorenewIcon fontSize="small" />
          Refresh
        </button>
      </div>
      <DataGrid
        rows={filteredChemist}
        getRowId={(row) => row.chemistCode}
        columns={chemistMapColumns}
        checkboxSelection
        rowSelectionModel={selectedChemIdx}
        onRowSelectionModelChange={(newSelected) =>
          handleSelectChemist(newSelected)
        }
        loading={loading}
      />

      {/* Chemists DataGrid */}
      <div className="bg-white custom-shadow rounded-md py-4 px-3">
        <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
          <h1 className="font-medium text-lg">Mapped Chemists</h1>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={chemistSearch}
              onChange={(e) => setChemistSearch(e.target.value)}
              placeholder="Search Chemist..."
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={mappedChemists}
            getRowId={(row) => row.chemistCode}
            columns={chemistMapColumns}
            loading={loading}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[
              5,
              10,
              20,
              { value: mappedChemists.length, label: "All" },
            ]}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "#666",
                  }}
                >
                  No chemist mapped
                </Box>
              ),
            }}
          />
        </Box>
      </div>
      <div className="flex place-content-center items-center rounded-md custom-shadow p-2 bg-white">
        <button disabled={selectedChemist.length === 0 || !selectedEmployee} onClick={handleSelectChemist} className="bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-44 p-2">
          {saveLoader ? <div className="flex items-center gap-2"><LoaderCircle className="animate-spin" />Saving..</div> : <span>Map Selected Doctors</span>}
        </button>
      </div>
      {/* <button
        disabled={selectedChemist.length === 0 || !selectedEmployee}
        onClick={handleSave}
        className="bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-44 p-2"
      >
        {saveLoader ? (
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin" />
            Saving..
          </div>
        ) : (
          <span>Map Selected Chemists</span>
        )}
      </button> */}
    </div>
  );
}
export default ChemistMapping;
