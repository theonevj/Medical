import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { LoaderCircle } from "lucide-react";
import { docMapColumn, getDoctors } from "../data/doctorsDataTable";
import { fetchAllUsers } from "../data/EmployeeDataTable";
import api from "../api";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Typography } from "@mui/material";

const prepareObj = (doctorList, employee) =>
  doctorList.map((doctor) => ({
    doctorCode: doctor.drCode, // keep as drCode for Add mapping (your backend Add expects this)
    employeeCode: employee.id,
  }));

export default function DoctorMapping() {
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmpIdx, setSelectedEmpIdx] = useState([]); // [id]
  const [selectedDocIdx, setSelectedDocIdx] = useState([]); // correct spelling

  const [userSearch, setUserSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState("");
  const [openUnmapModal, setOpenUnmapModal] = useState(false);
  const [unmapSearch, setUnmapSearch] = useState("");

  // --- fetchers ---
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const u = await fetchAllUsers();
      setUsers(u);
    } catch (err) {
      console.error(err);
      toast.error("Failed fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const d = await getDoctors();
      if (d) setDoctor(d.map((item) => ({ ...item, id: item.drCode })));
    } catch (err) {
      console.error(err);
      toast.error("Failed fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = () => {
    fetchAllDoctors();
    fetchData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getEmpDoctorChemistMapping = async () => {
    if (!selectedEmpIdx || selectedEmpIdx.length === 0) {
      setSelectedDocIdx([]);
      setSelectedDoctor([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(
        `/DoctorMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
      );
      const data = response.data?.data?.result || [];
      // selctedDocIdx is drCode list
      setSelectedDocIdx(data.map((item) => item.drCode));

      // Merge with doctor list and attach doc_no (mapping id) where present
      const mappedDocs = doctor
        .filter((d) => data.some((mapped) => mapped.drCode === d.drCode))
        .map((d) => {
          const mapped = data.find((m) => m.drCode === d.drCode);
          return { ...d, doc_no: mapped?.doc_no ?? null }; // attach doc_no from API
        });

      setSelectedDoctor(mappedDocs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mapped doctors");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedEmpIdx.length > 0) getEmpDoctorChemistMapping();
  //   else {
  //     setSelectedDocIdx([]);
  //     setSelectedDoctor([]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedEmpIdx, doctor]);

  const handleGetData = () => {
    if (!selectedEmpIdx.length || !selectedHeadQuater) {
      toast.warn("Please select Employee and HeadQuarter");
      return;
    }
    getEmpDoctorChemistMapping();
  };

  const handleRefresh = () => {
    setSelectedEmpIdx([]);
    setSelectedEmployee(null);
    setSelectedHeadQuater("");
    setSelectedDoctor([]);
    setSelectedDocIdx([]);
    fetchAllData();
  };

  // useEffect(() => {
  //   if (selectedHeadQuater) {
  //     setFilterDoctor(doctor.filter((it) => Number(it.headquarter) === Number(selectedHeadQuater)));
  //     setFilterUsers(users.filter((it) => Number(it.headQuater) === Number(selectedHeadQuater)));
  //   } else {
  //     setFilterDoctor(doctor);
  //     setFilterUsers(users);
  //   }
  // }, [selectedHeadQuater, doctor, users]);

  // --- Headquarter filter effect ---

  useEffect(() => {
    if (selectedHeadQuater) {
      setFilterDoctor(doctor.filter((it) => Number(it.headquarter) === Number(selectedHeadQuater)));
      // setFilterUsers(users.filter((it) => Number(it.headQuater) === Number(selectedHeadQuater)));
    } else {
      setFilterDoctor(doctor);
      setFilterUsers(users);
    }
    // Remove employee reset! Employee stays selected
  }, [selectedHeadQuater, doctor, users]);



  const filteredDoctors = doctor
    .filter((doc) => {
      if (selectedHeadQuater) {
        return Number(doc.headquarter) === Number(selectedHeadQuater);
      }
      return true;
    })
    .filter((doc) => {
      if (!doctorSearch) return true;
      const search = doctorSearch.toLowerCase();
      return (
        doc?.drName?.toLowerCase()?.includes(search) ||
        doc?.className?.toLowerCase()?.includes(search) ||
        doc?.speciality?.toLowerCase()?.includes(search) ||
        doc?.qualification?.toLowerCase()?.includes(search) ||
        doc?.dob?.toLowerCase()?.includes(search) ||
        doc?.gender?.toLowerCase()?.includes(search) ||
        doc?.routeName?.toLowerCase()?.includes(search) ||
        doc?.addressLine1?.toLowerCase()?.includes(search) ||
        doc?.addressLine2?.toLowerCase()?.includes(search) ||
        doc?.pinCode?.toLowerCase()?.includes(search) ||
        doc?.doctorArea?.toLowerCase()?.includes(search) ||
        doc?.vfreq?.toLowerCase()?.includes(search) ||
        doc?.mobileNo?.toLowerCase()?.includes(search) ||
        doc?.phone?.toLowerCase()?.includes(search)
      );
    });

  const filteredMappedDoctors = selectedDoctor.filter((doc) => {
    if (!doctorSearch) return true;
    const search = doctorSearch.toLowerCase();
    return (
      doc?.drName?.toLowerCase()?.includes(search) ||
      doc?.className?.toLowerCase()?.includes(search) ||
      doc?.speciality?.toLowerCase()?.includes(search) ||
      doc?.qualification?.toLowerCase()?.includes(search) ||
      doc?.dob?.toLowerCase()?.includes(search) ||
      doc?.gender?.toLowerCase()?.includes(search) ||
      doc?.routeName?.toLowerCase()?.includes(search) ||
      doc?.addressLine1?.toLowerCase()?.includes(search) ||
      doc?.addressLine2?.toLowerCase()?.includes(search) ||
      doc?.pinCode?.toLowerCase()?.includes(search) ||
      doc?.doctorArea?.toLowerCase()?.includes(search) ||
      doc?.vfreq?.toLowerCase()?.includes(search) ||
      doc?.mobileNo?.toLowerCase()?.includes(search) ||
      doc?.phone?.toLowerCase()?.includes(search)
    );
  });
  // --- Map single doctor (UI only) ---
  const handleMapDoctor = (doc) => {
    setSelectedDoctor((prev) => {
      if (!prev.some((d) => d.drCode === doc.drCode)) {
        return [...prev, doc];
      }
      return prev;
    });
    setSelectedDocIdx((prev) => {
      if (!prev.includes(doc.drCode)) return [...prev, doc.drCode];
      return prev;
    });
    toast.success(`Doctor ${doc.drName} queued to map (click Map Selected to save).`);
  };

  // --- Map many (save to backend) ---
  const handleMapDoctors = async () => {
    if (!selectedEmployee || selectedDoctor.length === 0) {
      toast.warn("Please select employee and doctors");
      return;
    }

    const mappingObj = {
      doctorMappingList: prepareObj(selectedDoctor, selectedEmployee),
      employeeCode: selectedEmployee.id,
      drCode: 0,
      isActive: 1,
      createdBy: user.id,
    };

    try {
      setSaveLoader(true);
      await api.post("/DoctorMapping/AddDoctorMapping", mappingObj);
      toast.success("Doctors mapped successfully!");
      await getEmpDoctorChemistMapping();
      setSelectedDoctor([]);
      handleRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to map doctors.");
    } finally {
      setSaveLoader(false);
    }
  };

  // --- Unmap handler: if doc_no exists -> call API; otherwise remove locally ---
  const handleUnmapDoctor = async (doc) => {
    // doc is the row object (we expect doc.doc_no when server-mapped)
    if (!doc) return;

    if (!doc.doc_no) {
      // not saved to server yet — remove locally
      setSelectedDoctor((prev) => prev.filter((d) => d.drCode !== doc.drCode));
      setSelectedDocIdx((prev) => prev.filter((id) => id !== doc.drCode));
      toast.info(`Removed ${doc.drName} (not saved on server).`);
      return;
    }

    try {
      setLoading(true);
      // API expects doc_no and updateby query params (POST with query ok)
      await api.post(`/DoctorMapping/DeleteDoctorMapping?doc_no=${encodeURIComponent(doc.doc_no)}&updateby=${encodeURIComponent(user.id)}`);
      toast.success(`Doctor ${doc.drName} unmapped successfully!`);
      await getEmpDoctorChemistMapping();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while unmapping.");
      // try to refresh local state from server
      await getEmpDoctorChemistMapping();
    } finally {
      setLoading(false);
    }
  };

  // --- Export current mapped list (selectedDoctor) ---
  const exportToExcel = (data, fileName = "Data") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, `${fileName}.xlsx`);
  };

  // --- helper: set selected employee ---
  const handleSelectEmployee = (val) => {
    const arr = val ? [Number(val)] : [];
    const emp = arr.length ? users.find((u) => u.id === arr[0]) : null;
    setSelectedEmployee(emp);
    setSelectedEmpIdx(arr);
    setSelectedEmployee(arr.length ? users.find((u) => u.id === arr[0]) : null);
    setSelectedDoctor([]);
    setSelectedDocIdx([]);
    if (emp) {
      fetchHeadQuater(emp.id);
    }
  };

  const mappedTableRows = selectedDoctor;

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      {/* Headquarter */}
      {/* <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Employee:</span>
          <select value={selectedEmpIdx[0] || ""} onChange={(e) => handleSelectEmployee(e.target.value)} className="rounded-md border-neutral-200 border p-1 outline-none">
            <option value="">Select Employee</option>
            {filterUsers.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designationName})</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>HeadQuater:</span>
          <select value={selectedHeadQuater} onChange={(e) => setSelectedHeadQuater(e.target.value)} className="rounded-md border-neutral-200 border p-1 outline-none">
            <option value="">All Headquater</option>
            {headQuater.map((hq) => <option key={hq.hqid} value={hq.hqid}>{hq.hqName}</option>)}
          </select>
        </div>
        <span onClick={fetchAllData} className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md">
          <AutorenewIcon />
        </span>
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
          onClick={handleRefresh}
          className="border px-4 py-2 rounded-md flex items-center gap-1"
        >
          <AutorenewIcon fontSize="small" />
          Refresh
        </button>
      </div>

      {/* Doctors area */}
      <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white mt-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="mb-2 font-medium text-lg">Doctors</h1>
          <div className="flex gap-2">
            <input type="text" value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)} placeholder="Search Doctor..." className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
            {selectedEmployee &&
              <button onClick={() => exportToExcel(mappedTableRows, "Mapped_Doctors")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md">
                Download
              </button>
            }
            <button onClick={() => {
              if (!selectedEmployee) { toast.warn("Select an employee first."); return; }
              setOpenUnmapModal(true);
            }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">
              Add / Show Unmapped
            </button>
          </div>
        </div>

        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={filteredMappedDoctors}
            getRowId={(row) => row.drCode}
            columns={[
              {
                field: "actions",
                headerName: "Actions",
                width: 140,
                renderCell: (params) => (
                  <button onClick={() => handleUnmapDoctor(params.row)} className="text-red-500 hover:underline">
                    ❌
                  </button>
                ),
              },
              ...docMapColumn,
            ]}
            loading={loading}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[20, 40]}
            slots={{
              noRowsOverlay: () => (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
                  No doctor is available
                </Box>
              ),
            }}
          />
        </Box>
      </div>

      {/* Modal: Unmapped doctors -> show Map button per row */}
      <Modal open={openUnmapModal} onClose={() => setOpenUnmapModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70%", bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, p: 3 }}>
          <Typography variant="h6" mb={2}>Unmapped Doctors</Typography>
          <input
            type="text"
            placeholder="Search doctors..."
            value={unmapSearch}
            onChange={(e) => setUnmapSearch(e.target.value)}
            className="flex  px-3 w-[30%]  py-2 border border-gray-300 rounded-md mb-2 w-full focus:outline-none focus:border-blue-500"
          />
          <Box sx={{ height: 420 }}>
            <DataGrid
              // rows={filteredDoctors.filter((doc) => !selctedDocIdx.includes(doc.drCode))}
              // rows={filteredDoctors.filter((doc) => !selectedDocIdx.includes(doc.drCode))}
              rows={filteredDoctors
                .filter((doc) => !selectedDocIdx.includes(doc.drCode))
                .filter((doc) => {
                  if (!unmapSearch) return true;
                  const text = unmapSearch.toLowerCase();
                  return Object.values(doc).some((val) =>
                    String(val).toLowerCase().includes(text)
                  );
                })}
              getRowId={(row) => row.drCode}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              columns={[
                {
                  field: "mapAction",
                  headerName: "Action",
                  width: 120,
                  renderCell: (params) => (
                    <button onClick={() => handleMapDoctor(params.row)} className="text-bold text-green-500  px-3 py-1 rounded-md">
                      ✓
                    </button>
                  ),
                },
                ...docMapColumn,
              ]}
              // slots={{
              //   noRowsOverlay: () => (
              //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
              //       All doctors are mapped 🎉
              //     </Box>
              //   ),
              // }}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
                    {unmapSearch ? "No doctor is available" : "All doctors are mapped 🎉"}
                  </Box>
                ),
              }}

            />
          </Box>

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpenUnmapModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md">Close</button>
          </div>
        </Box>
      </Modal>

      {/* Map Selected (save) button */}
      <div className="flex place-content-center items-center rounded-md custom-shadow p-2 bg-white">
        <button disabled={selectedDoctor.length === 0 || !selectedEmployee} onClick={handleMapDoctors} className="bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-44 p-2">
          {saveLoader ? <div className="flex items-center gap-2"><LoaderCircle className="animate-spin" />Saving..</div> : <span>Map Selected Doctors</span>}
        </button>
      </div>
    </div>
  );
}
