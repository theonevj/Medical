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

  // selectedDoctor will store doctor objects (some with doc_no when mapped on server)
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmpIdx, setSelectedEmpIdx] = useState([]); // [id]
  const [selctedDocIdx, setSelectedDocIdx] = useState([]); // drCode list of mapped doctors

  const [userSearch, setUserSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState("");

  const [openUnmapModal, setOpenUnmapModal] = useState(false);

  // --- fetchers ---
  const fetchHeadQuater = async () => {
    try {
      const res = await api.get("Headquarters");
      setHeadQuater(res.data);
    } catch (err) {
      console.error(err);
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
    fetchHeadQuater();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- get mapped doctors for employee ---
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

  useEffect(() => {
    if (selectedEmpIdx.length > 0) getEmpDoctorChemistMapping();
    else {
      setSelectedDocIdx([]);
      setSelectedDoctor([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmpIdx, doctor]); // include doctor in deps so mapping attaches doc objects after doctors fetched

  // filter lists by HQ
  useEffect(() => {
    if (selectedHeadQuater) {
      setFilterDoctor(doctor.filter((it) => Number(it.headquarter) === Number(selectedHeadQuater)));
      setFilterUsers(users.filter((it) => Number(it.headQuater) === Number(selectedHeadQuater)));
    } else {
      setFilterDoctor(doctor);
      setFilterUsers(users);
    }
  }, [selectedHeadQuater, doctor, users]);

  const filteredDoctors = filterDoctor.filter(
    (items) =>
      items?.drName?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.speciality?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  // --- Map single doctor (UI only) ---
  const handleMapDoctor = (doc) => {
    // add to selectedDoctor locally (no doc_no yet)
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
      // refresh server mapping so we get doc_no populated
      await getEmpDoctorChemistMapping();
      // clear local queued ones (they will be reloaded from server)
      setSelectedDoctor([]);
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
    setSelectedEmpIdx(arr);
    setSelectedEmployee(arr.length ? users.find((u) => u.id === arr[0]) : null);
    // clear any queued doctors
    setSelectedDoctor([]);
    setSelectedDocIdx([]);
  };

  // rows for mapped doctors table — use selectedDoctor so doc_no is available for server-synced rows
  const mappedTableRows = selectedDoctor;

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      {/* Headquarter */}
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
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
      </div>

      {/* Employee dropdown */}
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center gap-2">
        <span>Employee:</span>
        <select value={selectedEmpIdx[0] || ""} onChange={(e) => handleSelectEmployee(e.target.value)} className="rounded-md border-neutral-200 border p-1 outline-none">
          <option value="">Select Employee</option>
          {filterUsers.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designationName})</option>)}
        </select>
      </div>

      {/* Doctors area */}
      <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white mt-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="mb-2 font-medium text-lg">Doctors</h1>
          <div className="flex gap-2">
            <input type="text" value={doctorSearch} onChange={(e) => setDoctorSearch(e.target.value)} placeholder="Search Doctor..." className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />

            <button onClick={() => exportToExcel(mappedTableRows, "Mapped_Doctors")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md">
              Download
            </button>

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
            rows={mappedTableRows}
            getRowId={(row) => row.drCode}
            columns={[
              {
                field: "actions",
                headerName: "Actions",
                width: 140,
                renderCell: (params) => (
                  <button onClick={() => handleUnmapDoctor(params.row)} className="text-red-500 hover:underline">
                    Unmap
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
          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={filteredDoctors.filter((doc) => !selctedDocIdx.includes(doc.drCode))}
              getRowId={(row) => row.drCode}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              columns={[
                {
                  field: "mapAction",
                  headerName: "Action",
                  width: 120,
                  renderCell: (params) => (
                    <button onClick={() => handleMapDoctor(params.row)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                      Map
                    </button>
                  ),
                },
                ...docMapColumn,
              ]}
              slots={{
                noRowsOverlay: () => (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#666" }}>
                    All doctors are mapped 🎉
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
