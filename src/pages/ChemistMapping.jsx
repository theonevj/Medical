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


// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Box from "@mui/material/Box";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import AutorenewIcon from "@mui/icons-material/Autorenew";
// import { LoaderCircle } from "lucide-react";
// import { chemistMapColumns, getAllChemist } from "../data/chemistDataTable";
// import { empMapColumns, fetchAllUsers } from "../data/EmployeeDataTable";
// import api from "../api";
// const prepareObj = (chemistList, employee) => {
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
//   // Pagination state for DataGrid
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 10,
//   });
//   const fetchHeadQuater = async (empId) => {
//     if (!empId) {
//       setHeadQuater([]);
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await api.get("/User/GetAllHQByUser", {
//         params: { userID: empId },
//       });
//       setHeadQuater(res?.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch headquarters");
//     } finally {
//       setLoading(false);
//     }
//   };
//   ;
//   // const getEmpChemistMapping = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await api.get(
//   //       `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
//   //     );
//   //     const data = response.data.data.result;
//   //     setSelectedChemIdx(data.map((item) => item.chemistCode));
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   //   finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const getEmpChemistMapping = async () => {
//     if (!selectedEmpIdx || selectedEmpIdx.length === 0) {
//       setSelectedChemIdx([]);
//       setSelectedChemist([]);
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await api.get(
//         `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
//       );
//       const data = response.data?.data?.result || [];
//       setSelectedChemIdx(data.map((item) => item.chemistCode));
//       const mappedChemists = chemist.filter((c) =>
//         data.some((mapped) => mapped.chemistCode === c.chemistCode)
//       );
//       setSelectedChemist(mappedChemists);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load mapped chemists");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   if (selectedEmpIdx.length > 0) {
//   //     getEmpChemistMapping();
//   //   } else {
//   //     setSelectedChemIdx([]);
//   //     setSelectedChemist([]);
//   //   }
//   // }, [selectedEmpIdx]);
//   useEffect(() => {
//     if (selectedEmpIdx.length > 0) {
//       getEmpChemistMapping();
//     } else {
//       setSelectedChemIdx([]);
//       setSelectedChemist([]);
//     }
//   }, [selectedEmpIdx, chemist]);

//   const getChemistData = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllChemist();
//       setChemist(data.map((item) => ({ ...item, id: item.chemistCode })));
//     } catch (err) {
//       console.log(err);
//       toast.error(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const users = await fetchAllUsers();
//       setUsers(users);
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
//       //   setFilterChemist(
//       //     chemist.filter((item) => Number(item.headquarter) === Number(selectedHeadQuater))
//       //   );
//       //   setFilterUsers(
//       //     users.filter((item) => Number(item.headQuater) === Number(selectedHeadQuater))
//       //   );
//       // } else {
//       //   setFilterChemist(chemist);
//       //   setFilterUsers(users);
//       // }
//       setFilterChemist(
//         chemist.filter((item) => Number(item.headquarter) === Number(selectedHeadQuater))
//       )
//     } else {
//       setFilterChemist(chemist);
//       setFilterUsers(users);
//     }
//   }, [selectedHeadQuater, chemist, users]);
//   useEffect(() => {
//     fetchAllData();
//     // fetchHeadQuater();
//   }, []);
//   const mappedUsers = filterUsers.map((items) => ({
//     ...items,
//     empname: `${items.firstName} ${items.lastName}`.toLowerCase(),
//   }));
//   // Global search for employees
//   const filteredEmployee = mappedUsers.filter((items) => {
//     const query = userSearch.toLowerCase();
//     return Object.values(items).some(
//       (val) => val && val.toString().toLowerCase().includes(query)
//     );
//   });
//   // Global search for chemists
//   const filteredChemist = filterChemist?.filter((items) => {
//     const query = chemistSearch.toLowerCase();
//     return Object.values(items).some(
//       (val) => val && val.toString().toLowerCase().includes(query)
//     );
//   });
//   // const handleSelectChemist = (newChemist) => {
//   //   console.log("newChemist:-", newChemist);
//   //   setSelectedChemIdx(newChemist);
//   //   setSelectedChemist(
//   //     chemist.filter((item) => newChemist.includes(item.chemistCode))
//   //   );
//   // };
//   const handleSelectChemist = (newChemist) => {
//     setSelectedChemIdx(newChemist);
//     setSelectedChemist(
//       chemist.filter((item) => newChemist.includes(item.chemistCode))
//     );
//   };

//   // const handleSelectEmployee = (newEmployee) => {
//   //   setSelectedEmpIdx(newEmployee);
//   //   setSelectedEmployee(users.find((item) => item.id === newEmployee[0]));
//   // };

//   const handleSelectEmployee = (val) => {
//     const arr = val ? [Number(val)] : [];
//     const emp = arr.length ? users.find((u) => u.id === arr[0]) : null;
//     setSelectedEmpIdx(arr);
//     setSelectedEmployee(
//       arr.length ? users.find((u) => u.id === arr[0]) : null
//     );
//     // reset chemists on employee change
//     setSelectedChemIdx([]);
//     setSelectedChemist([]);
//     if (emp) {
//       fetchHeadQuater(emp.id);
//     }
//   };
//   const handleSave = async () => {
//     const mappingObj = {
//       chemistsMappingList: prepareObj(selectedChemist, selectedEmployee),
//       employeeCode: user.id,
//       isActive: 1,
//       createdBy: 0,
//     };
//     try {
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
//   const mappedChemists = filterChemist
//     .filter((c) => selectedChemIdx.includes(c.chemistCode))
//     .filter((c) => {
//       const query = chemistSearch.toLowerCase();
//       return Object.values(c).some(
//         (val) => val && val.toString().toLowerCase().includes(query)
//       );
//     });

//   // GET DATA
//   const handleGetData = () => {
//     if (!selectedEmpIdx.length || !selectedHeadQuater) return;
//     getChemistData();
//     setFilterChemist(
//       chemist.filter(
//         (item) => Number(item.headquarter) === Number(selectedHeadQuater)
//       )
//     );
//   };
//   const handleRefresh = () => {
//     setSelectedEmpIdx([]);
//     setSelectedEmployee(null);
//     setSelectedHeadQuater("");
//     setSelectedChemIdx([]);
//     setSelectedChemist([]);
//     fetchAllData();
//   };

//   return (
//     <div className="flex h-full flex-col gap-3 md:gap-4">
//       {/* <div className="bg-white custom-shadow rounded-md py-3 px-3 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span>HeadQuater:</span>
//           <select
//             value={selectedHeadQuater}
//             onChange={(e) => setSelectedHeadQuater(e.target.value)}
//             className="rounded-md border p-1"
//           >
//             <option value="">All HeadQuarter</option>
//             {headQuater.map((hq) => (
//               <option key={hq.hqid} value={hq.hqid}>
//                 {hq.hqName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <span
//           onClick={fetchAllData}
//           className="cursor-pointer w-8 h-8 border flex justify-center items-center rounded-md"
//         >
//           <AutorenewIcon />
//         </span>
//       </div>
//       <div className="bg-white custom-shadow rounded-md py-3 px-3 flex items-center gap-2">
//         <span>Employee:</span>
//         <select
//           value={selectedEmpIdx[0] || ""}
//           onChange={(e) =>
//             handleSelectEmployee(e.target.value ? [Number(e.target.value)] : [])
//           }
//           className="rounded-md border p-1"
//         >
//           <option value="">Select Employee</option>
//           {filterUsers.map((emp) => (
//             <option key={emp.id} value={emp.id}>
//               {emp.firstName} {emp.lastName} ({emp.designationName})
//             </option>
//           ))}
//         </select>
//       </div> */}
//       <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center gap-3">
//         <div className="flex items-center gap-2">
//           <span className="min-w-[80px]">Employee:</span>
//           <select
//             value={selectedEmpIdx[0] || ""}
//             onChange={(e) => handleSelectEmployee(e.target.value)}
//             className="w-[260px] rounded-md border border-neutral-200 p-2 outline-none"
//           >
//             <option value="">Select Employee</option>
//             {filterUsers.map((emp) => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.firstName} {emp.lastName} ({emp.designationName})
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* HEADQUARTER */}
//         <div className="flex items-center gap-2">
//           <span>HeadQuarter:</span>
//           <select
//             value={selectedHeadQuater}
//             disabled={!selectedEmpIdx.length}
//             onChange={(e) => setSelectedHeadQuater(e.target.value)}
//             className="rounded-md border-neutral-200 border p-1 outline-none disabled:bg-gray-100"
//           >
//             <option value="">Select HeadQuarter</option>
//             {headQuater?.map((hq) => (
//               <option key={hq.codeID} value={hq.codeID}>
//                 {hq.codeName}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* GET DATA */}
//         <button
//           disabled={!selectedEmpIdx.length || !selectedHeadQuater}
//           onClick={handleGetData}
//           className="bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
//         >
//           Get Data
//         </button>
//         {/* REFRESH */}
//         <button
//           // onClick={handleRefresh}
//           className="border px-4 py-2 rounded-md flex items-center gap-1"
//         >
//           <AutorenewIcon fontSize="small" />
//           Refresh
//         </button>
//       </div>
//       <DataGrid
//         rows={filteredChemist}
//         getRowId={(row) => row.chemistCode}
//         columns={chemistMapColumns}
//         checkboxSelection
//         rowSelectionModel={selectedChemIdx}
//         onRowSelectionModelChange={(newSelected) =>
//           handleSelectChemist(newSelected)
//         }
//         loading={loading}
//       />

//       {/* Chemists DataGrid */}
//       <div className="bg-white custom-shadow rounded-md py-4 px-3">
//         <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
//           <h1 className="font-medium text-lg">Mapped Chemists</h1>
//           <div className="flex gap-2 items-center">
//             <input
//               type="text"
//               value={chemistSearch}
//               onChange={(e) => setChemistSearch(e.target.value)}
//               placeholder="Search Chemist..."
//               className="px-3 py-2 border rounded-md"
//             />
//           </div>
//         </div>
//         <Box sx={{ height: 400 }}>
//           <DataGrid
//             rows={mappedChemists}
//             getRowId={(row) => row.chemistCode}
//             columns={chemistMapColumns}
//             loading={loading}
//             pagination
//             paginationModel={paginationModel}
//             onPaginationModelChange={setPaginationModel}
//             pageSizeOptions={[
//               5,
//               10,
//               20,
//               { value: mappedChemists.length, label: "All" },
//             ]}
//             slots={{
//               noRowsOverlay: () => (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "100%",
//                     color: "#666",
//                   }}
//                 >
//                   No chemist mapped
//                 </Box>
//               ),
//             }}
//           />
//         </Box>
//       </div>
//       <div className="flex place-content-center items-center rounded-md custom-shadow p-2 bg-white">
//         <button disabled={selectedChemist.length === 0 || !selectedEmployee} onClick={handleSelectChemist} className="bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-44 p-2">
//           {saveLoader ? <div className="flex items-center gap-2"><LoaderCircle className="animate-spin" />Saving..</div> : <span>Map Selected Doctors</span>}
//         </button>
//       </div>
//       {/* <button
//         disabled={selectedChemist.length === 0 || !selectedEmployee}
//         onClick={handleSave}
//         className="bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-44 p-2"
//       >
//         {saveLoader ? (
//           <div className="flex items-center gap-2">
//             <LoaderCircle className="animate-spin" />
//             Saving..
//           </div>
//         ) : (
//           <span>Map Selected Chemists</span>
//         )}
//       </button> */}
//     </div>
//   );
// }
// export default ChemistMapping;




// ------------===------------------------FINAL------------------------------CODE----------------------------===

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Modal, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { LoaderCircle } from "lucide-react";

import { chemistMapColumns, getAllChemist } from "../data/chemistDataTable";
import { fetchAllUsers } from "../data/EmployeeDataTable";
import api from "../api";

/* ---------- helper ---------- */
const prepareObj = (chemistList, employee) =>
  chemistList.map((c) => ({
    chemistCode: c.chemistCode,
    employeeCode: employee.id,
  }));

export default function ChemistMapping() {
  const { user } = useSelector((state) => state.auth);

  /* ---------- loaders ---------- */
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  /* ---------- master data ---------- */
  const [users, setUsers] = useState([]);
  const [chemist, setChemist] = useState([]);
  const [filterChemist, setFilterChemist] = useState([]);

  /* ---------- selection ---------- */
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmpIdx, setSelectedEmpIdx] = useState([]);

  const [selectedChemist, setSelectedChemist] = useState([]);
  const [selectedChemIdx, setSelectedChemIdx] = useState([]);

  /* ---------- filters ---------- */
  const [chemistSearch, setChemistSearch] = useState("");
  const [unmapSearch, setUnmapSearch] = useState("");

  /* ---------- HQ ---------- */
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState("");

  /* ---------- modal ---------- */
  const [openUnmapModal, setOpenUnmapModal] = useState(false);

  /* ================= FETCHERS ================= */

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
    } catch {
      console.log("Failed to fetch HQ");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const u = await fetchAllUsers();
      setUsers(u);
    } finally {
      setLoading(false);
    }
  };

  const fetchChemists = async () => {
    try {
      setLoading(true);
      const c = await getAllChemist();
      setChemist(c.map((i) => ({ ...i, id: i.chemistCode })));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = () => {
    fetchUsers();
    fetchChemists();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  /* ================= HQ FILTER ================= */

  // useEffect(() => {
  //   if (selectedHeadQuater) {
  //     setFilterChemist(
  //       chemist.filter(
  //         (c) => Number(c.headquarter) === Number(selectedHeadQuater)
  //       )
  //     );
  //   } else {
  //     setFilterChemist(chemist);
  //   }
  // }, [selectedHeadQuater, chemist]);

  // useEffect(() => {
  //   const fetchChemistByHQ = async () => {
  //     if (!selectedHeadQuater) {
  //       setFilterChemist([]);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const res = await api.get(
  //         `/Chemist/GetAllChemist?hqid=${selectedHeadQuater}`,);
  //       setFilterChemist(res?.data?.data || []);
  //     } catch (error) {
  //       console.log("Failed to fetch chemist", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchChemistByHQ();
  // }, [selectedHeadQuater]);

  /* ================= GET MAPPED ================= */

  const getEmpChemistMapping = async () => {
    if (!selectedEmpIdx.length) {
      setSelectedChemist([]);
      setSelectedChemIdx([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}&hqid=${selectedHeadQuater}`
      );
      const data = res?.data?.data?.result || [];

      setSelectedChemIdx(data.map((i) => i.chemistCode));

      const mapped = chemist
        .filter((c) => data.some((m) => m.chemistCode === c.chemistCode))
        .map((c) => {
          const m = data.find((x) => x.chemistCode === c.chemistCode);
          return { ...c, chem_map_no: m?.chem_map_no ?? null };
        });

      setSelectedChemist(mapped);
    } catch {
      toast.error("Failed to load mapped chemists");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  const handleSelectEmployee = (val) => {
    const arr = val ? [Number(val)] : [];
    const emp = arr.length ? users.find((u) => u.id === arr[0]) : null;

    setSelectedEmpIdx(arr);
    setSelectedEmployee(emp);
    setSelectedChemist([]);
    setSelectedChemIdx([]);
    setSelectedHeadQuater("");

    if (emp) fetchHeadQuater(emp.id);
  };

  // const handleGetData = () => {
  //   if (!selectedEmpIdx.length || !selectedHeadQuater) {
  //     toast.warn("Select Employee & HeadQuarter");
  //     return;
  //   }
  //   getEmpChemistMapping();
  // };

  const handleGetData = async () => {
    if (!selectedEmpIdx.length || !selectedHeadQuater) {
      toast.warn("Select Employee & HeadQuarter");
      return;
    }

    try {
      setLoading(true);
      await getEmpChemistMapping();
      const res = await api.get(
        `/Chemist/GetAllChemist?hqid=${selectedHeadQuater}`
      );
      setFilterChemist(res?.data?.data || []);

    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setSelectedEmpIdx([]);
      setSelectedEmployee(null);
      setSelectedHeadQuater("");
      setSelectedChemist([]);
      setSelectedChemIdx([]);
      setFilterChemist([]);
      await fetchAllData();
    } catch (e) {
      console.error("Refresh failed", e);
      toast.error("Session expired, please login again");
    }
  };


  /* ================= MAP / UNMAP ================= */

  const handleMapChemist = (row) => {
    const fullChemist = chemist.find(
      (c) => c.chemistCode === row.chemistCode
    );

    if (!fullChemist) return;

    setSelectedChemist((prev) => {
      if (prev.some((c) => c.chemistCode === fullChemist.chemistCode)) {
        return prev;
      }
      return [...prev, { ...fullChemist, chem_map_no: null }];
    });

    setSelectedChemIdx((prev) =>
      prev.includes(fullChemist.chemistCode)
        ? prev
        : [...prev, fullChemist.chemistCode]
    );

    toast.success("Chemist added for mapping");
  };

  const handleMapChemists = async () => {
    if (!selectedEmployee || !selectedChemist.length) {
      toast.warn("Select employee & chemists");
      return;
    }

    const payload = {
      chemistsMappingList: prepareObj(selectedChemist, selectedEmployee),
      employeeCode: selectedEmployee.id,
      isActive: 1,
      createdBy: user.id,
    };

    try {
      setSaveLoader(true);
      await api.post("/ChemistMapping/AddChemistMapping", payload);
      toast.success("Chemists mapped successfully");
      // await getEmpChemistMapping();
      handleRefresh();
    } catch {
      toast.error("Mapping failed");
    } finally {
      setSaveLoader(false);
    }
  };

  const handleUnmapChemist = async (row) => {
    if (!row.chem_map_no) {
      setSelectedChemist((p) =>
        p.filter((c) => c.chemistCode !== row.chemistCode)
      );
      setSelectedChemIdx((p) =>
        p.filter((i) => i !== row.chemistCode)
      );
      return;
    }

    try {
      setLoading(true);
      await api.post(
        `/ChemistMapping/DeleteChemistMapping?chem_map_no=${row.chem_map_no}&updateby=${user.id}`
      );
      toast.success("Chemist unmapped");
      // await getEmpChemistMapping();
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERED ================= */

  const filteredMappedChemists = selectedChemist.filter((c) => {
    if (!chemistSearch) return true;
    return Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(chemistSearch.toLowerCase());
  });

  const downloadCSV = (rows, fileName = "chemist_mapping.csv") => {
    if (!rows || !rows.length) {
      toast.warn("No data to download");
      return;
    }

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","), // header row
      ...rows.map((row) =>
        headers.map((h) => `"${row[h] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };


  /* ================= UI ================= */

  return (
    <div className="flex h-full flex-col gap-4">

      {/* HEADER */}
      <div className="bg-white custom-shadow rounded-md p-3 flex items-center gap-3">
        <select
          value={selectedEmpIdx[0] || ""}
          onChange={(e) => handleSelectEmployee(e.target.value)}
          className="border p-2 rounded-md w-[260px]"
        >
          <option value="">Select Employee</option>
          {users.map((e) => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName} ({e.designationName})
            </option>
          ))}
        </select>

        <select
          value={selectedHeadQuater}
          disabled={!selectedEmpIdx.length}
          onChange={(e) => setSelectedHeadQuater(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Select HeadQuarter</option>
          {headQuater.map((hq) => (
            <option key={hq.codeID} value={hq.codeID}>
              {hq.codeName}
            </option>
          ))}
        </select>

        <button
          onClick={handleGetData}
          disabled={!selectedEmpIdx.length || !selectedHeadQuater}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Get Data
        </button>

        <button onClick={handleRefresh} className="border px-3 py-2 rounded-md">
          <AutorenewIcon fontSize="small" />
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={chemistSearch}
          onChange={(e) => setChemistSearch(e.target.value)}
          placeholder="Search mapped chemists..."
          className="border px-3 py-2 rounded-md w-[250px]"
        />

        <div className="flex gap-2">
          {/* DOWNLOAD */}
          <button
            onClick={() =>
              downloadCSV(filteredMappedChemists, "Mapped_Chemists.csv")
            }
            disabled={!filteredMappedChemists.length}
            className="bg-green-600 text-white px-3 py-2 rounded-md disabled:bg-gray-400"
          >
            Download
          </button>

          <button
            onClick={() => {
              if (!selectedEmployee || !selectedHeadQuater) {
                toast.warn("Select Employee & HeadQuarter");
                return;
              }
              setOpenUnmapModal(true);
            }}
            className="bg-red-500 text-white px-3 py-2 rounded-md"
          >
            Add / Show Unmapped
          </button>
        </div>
      </div>


      {/* MAPPED TABLE */}
      <Box sx={{ height: 420 }}>
        <DataGrid
          rows={filteredMappedChemists}
          getRowId={(r) => r.chemistCode}
          columns={[
            {
              field: "action",
              headerName: "Action",
              width: 120,
              renderCell: (p) => (
                <button
                  onClick={() => handleUnmapChemist(p.row)}
                  className="text-red-500"
                >
                  ❌
                </button>
              ),
            },
            ...chemistMapColumns,
          ]}
          loading={loading}
        />
      </Box>

      {/* UNMAPPED MODAL */}
      <Modal open={openUnmapModal} onClose={() => setOpenUnmapModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Unmapped Chemists
          </Typography>

          <input
            value={unmapSearch}
            onChange={(e) => setUnmapSearch(e.target.value)}
            placeholder="Search chemists..."
            className="border px-3 py-2 rounded-md mb-2 w-[30%]"
          />

          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={filterChemist
                .filter((c) => !selectedChemIdx.includes(c.chemistCode))
                .filter((c) =>
                  !unmapSearch
                    ? true
                    : Object.values(c)
                      .join(" ")
                      .toLowerCase()
                      .includes(unmapSearch.toLowerCase())
                )}
              getRowId={(r) => r.chemistCode}
              columns={[
                {
                  field: "map",
                  headerName: "Action",
                  width: 120,
                  renderCell: (p) => (
                    <button
                      onClick={() => handleMapChemist(p.row)}
                      className="text-green-600 font-bold hover:bg-green-100 howver:border-green-400 hover:border"
                    >
                      ✓
                    </button>
                  ),
                },
                ...chemistMapColumns,
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
                    {unmapSearch
                      ? "No chemist found"
                      : "All chemists are mapped 🎉"}
                  </Box>
                ),
              }}
            />
          </Box>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => setOpenUnmapModal(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>

      {/* SAVE */}
      <div className="flex justify-center bg-white p-3 rounded-md">
        <button
          disabled={!selectedChemist.length}
          onClick={handleMapChemists}
          className="bg-themeblue text-white w-52 p-2 rounded-md disabled:bg-gray-400"
        >
          {saveLoader ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin" />
              Saving...
            </div>
          ) : (
            "Map Selected Chemists"
          )}
        </button>
      </div>
    </div>
  );
}

