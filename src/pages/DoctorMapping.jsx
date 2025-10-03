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
    doctorCode: doctor.drCode,
    employeeCode: employee.id,
  }));

function DoctorMapping() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmpIdx, setSelectedEmpIdx] = useState([]);
  const [selctedDocIdx, setSelectedDocIdx] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [headQuater, setHeadQuater] = useState([]);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState("");

  // fetch HQ
  const fetchHeadQuater = async () => {
    try {
      const response = await api.get("Headquarters");
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // fetch mapping doctors for employee
  const getEmpDoctorChemistMapping = async () => {
    try {
      const response = await api.get(
        `/DoctorMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
      );
      let data = response.data.data.result;

      setSelectedDocIdx(data.map((item) => item.drCode));
      setSelectedDoctor(
        doctor.filter((d) => data.some((mapped) => mapped.drCode === d.drCode))
      ); // ✅ keep both existing + newly mapped
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (selectedEmpIdx.length > 0) {
      getEmpDoctorChemistMapping();
    }
  }, [selectedEmpIdx]);

  // fetch employees
  const fetchData = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // fetch doctors
  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const data = await getDoctors();
      if (data) {
        setDoctor(data.map((item) => ({ ...item, id: item.drCode })));
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while fetching doctor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHeadQuater) {
      setFilterDoctor(
        doctor.filter((item) => Number(item.headquarter) == selectedHeadQuater)
      );
      setFilterUsers(
        users.filter((item) => Number(item.headQuater) == selectedHeadQuater)
      );
    } else {
      setFilterDoctor(doctor);
      setFilterUsers(users);
    }
  }, [selectedHeadQuater, doctor, users]);

  const filteredDoctors = filterDoctor.filter(
    (items) =>
      items?.drName?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.className?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.speciality?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.qualification?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.dob?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.gender?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.routeName?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.addressLine1?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.addressLine2?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.pinCode?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.doctorArea?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.vfreq?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.mobileNo?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      items?.phone?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const fetchAllData = () => {
    fetchAllDoctors();
    fetchData();
    fetchHeadQuater();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleMapDoctor = (doctor) => {
  setSelectedDoctor((prev) => {
    if (!prev.some((d) => d.drCode === doctor.drCode)) {
      return [...prev, doctor];
    }
    return prev;
  });

  setSelectedDocIdx((prev) => {
    if (!prev.includes(doctor.drCode)) {
      return [...prev, doctor.drCode];
    }
    return prev;
  });

  toast.success(`Doctor ${doctor.drName} mapped successfully!`);
};


  const handleSelectDoctors = (newDoctor) => {
    setSelectedDocIdx(newDoctor);
    setSelectedDoctor(doctor.filter((item) => newDoctor.includes(item.drCode)));
  };

  const handleSelectEmployee = (newEmployee) => {
    setSelectedEmpIdx(newEmployee);
    setSelectedEmployee(users.find((item) => item.id === newEmployee[0]));
  };

  const handleSave = async () => {
    let mappingObj = {
      doctorMappingList: prepareObj(selectedDoctor, selectedEmployee),
      employeeCode: user.id,
      drCode: 0,
      isActive: 1,
      createdBy: 0,
    };

    try {
      setSaveLoader(true);
      await api.post("/DoctorMapping/AddDoctorMapping", mappingObj);
      toast.success("Doctors mapped successfully.");
      setOpenUnmapModal(false);

      // 🔥 Refresh mapped doctors from server so both old + new appear
      await getEmpDoctorChemistMapping();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setSaveLoader(false);
    }
  };


  // 👉 Unmap doctor handler
  const handleUnmapDoctor = async (doc) => {
    try {
      await api.post(
        `/DoctorMapping/DeleteDoctorMapping?doc_no=${doc.doc_no}&updateby=${user.id}`
      );
      toast.success(`Doctor ${doc.drName} unmapped successfully!`);
      getEmpDoctorChemistMapping(); // refresh mapped doctors
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while unmapping.");
    }
  };

  // 👉 Add column for Unmap action
  const doctorColumnsWithUnmap = [
    ...docMapColumn,
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleUnmapDoctor(params.row)}
          className="text-red-500 hover:underline"
        >
          Unmap
        </button>
      )
      ,
    },
  ];
  const [openUnmapModal, setOpenUnmapModal] = useState(false);
  const handleMapDoctors = async () => {
    if (!selectedEmployee || selectedDoctor.length === 0) {
      toast.warn("Please select employee and doctors");
      return;
    }

    let mappingObj = {
      doctorMappingList: prepareObj(selectedDoctor, selectedEmployee),
      employeeCode: user.id,
      drCode: 0,
      isActive: 1,
      createdBy: 0,
    };

    try {
      setSaveLoader(true);
      await api.post("/DoctorMapping/AddDoctorMapping", mappingObj);
      toast.success("Doctors mapped successfully!");
      setOpenUnmapModal(false);
      getEmpDoctorChemistMapping(); // refresh mapped doctor list
      setSelectedDoctor([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to map doctors.");
    } finally {
      setSaveLoader(false);
    }
  };

  // unmapped doctors list
  const unMappedDoctors = filteredDoctors.filter(
    (doc) => !selctedDocIdx.includes(doc.drCode)
  );

  const exportToExcel = (data, fileName = "Data") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `${fileName}.xlsx`);
  };

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      {/* Headquarter */}
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>HeadQuater:</span>
          <select
            onChange={(e) => setSelectedHeadQuater(e.target.value)}
            className="rounded-md border-neutral-200 border p-1 outline-none"
          >
            <option value="">All Headquater</option>
            {headQuater.map((item) => (
              <option key={item.hqid} value={item.hqid}>
                {item.hqName}
              </option>
            ))}
          </select>
        </div>
        <span
          onClick={fetchAllData}
          className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md"
        >
          <AutorenewIcon />
        </span>
      </div>

      {/* Employee dropdown */}
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center gap-2">
        <span>Employee:</span>
        <select
          value={selectedEmpIdx[0] || ""}
          onChange={(e) =>
            handleSelectEmployee(
              e.target.value ? [Number(e.target.value)] : []
            )
          }
          className="rounded-md border-neutral-200 border p-1 outline-none"
        >
          <option value="">Select Employee</option>
          {filterUsers.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} ({emp.designationName})
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Table */}
      {/* Doctor Table */}
      {/* Doctor Table */}
      <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white mt-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="mb-2 font-medium text-lg">Doctors</h1>
          <div className="flex gap-2">
            {/* Search Doctor */}
            <input
              type="text"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              placeholder="Search Doctor..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />

            {/* Download Excel */}
            <button
              onClick={() =>
                exportToExcel(
                  filteredDoctors.filter((doc) =>
                    selctedDocIdx.includes(doc.drCode)
                  ),
                  "Mapped_Doctors"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
            >
              Download
            </button>

            {/* Show Unmapped Doctors */}
            <button
              onClick={() => setOpenUnmapModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
            >
              Show Unmapped Doctors
            </button>
          </div>
        </div>

        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={filteredDoctors.filter((doc) =>
              selctedDocIdx.includes(doc.drCode)
            )}
            columns={[
              {
                field: "actions",
                headerName: "Actions",
                width: 120,
                renderCell: (params) => (
                  <button
                    onClick={() => handleUnmapDoctor(params.row.drCode)}
                    className="text-red-500 hover:underline"
                  >
                    Unmap
                  </button>
                ),
              },
              ...docMapColumn,
            ]}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[20, 40]}
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
                  No doctor is available
                </Box>
              ),
            }}
          />
        </Box>
      </div>


      {/* Unmapped Doctors Modal */}
      {/* Unmapped Doctors Modal */}
    <Modal open={openUnmapModal} onClose={() => setOpenUnmapModal(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 2,
      p: 3,
    }}
  >
    <Typography variant="h6" mb={2}>
      Unmapped Doctors
    </Typography>
    <Box sx={{ height: 400 }}>
      <DataGrid
        rows={unMappedDoctors}
        getRowId={(row) => row.drCode}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        columns={[
          {
            field: "mapAction",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
              <button
                onClick={() => handleMapDoctor(params.row)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
              >
                Map
              </button>
            ),
          },
          ...docMapColumn,
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
              All doctors are mapped 🎉
            </Box>
          ),
        }}
      />
    </Box>

    <div className="flex justify-end gap-2 mt-3">
      <button
        onClick={() => setOpenUnmapModal(false)}
        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </Box>
</Modal>



      {/* Save Button */}
      <button
        disabled={selectedDoctor.length === 0 || !selectedEmployee}
        onClick={handleMapDoctors}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        {saveLoader ? "Saving..." : "Map Selected Doctors"}
      </button>
    </div>
  );  
}

export default DoctorMapping;
