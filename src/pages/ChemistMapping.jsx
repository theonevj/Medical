import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

//importing icons
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { LoaderCircle, UserSearch } from "lucide-react";

import { chemistMapColumns, getAllChemist } from "../data/chemistDataTable";
import { empMapColumns, fetchAllUsers } from "../data/EmployeeDataTable";
import api from "../api";

const prepareObj = (chemistList, employee) => {
  console.log(employee);
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

  console.log("filterUsers(chemistMapping):-", filterUsers);
  console.log("filterChemist(chemistMapping):-", filterChemist);

  const fetchHeadQuater = async () => {
    try {
      const response = await api.get("Headquarters");
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  //Get employee mapping data with chemist
  const getEmpChemistMapping = async () => {
    try {
      const response = await api.get(
        `/ChemistMapping/GetAllByUserID?userID=${selectedEmpIdx[0]}`
      );
      let data = response.data.data.result;

      setSelectedChemIdx(data.map((item) => item.chemistCode));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedEmpIdx.length > 0) {
      getEmpChemistMapping();
    }
  }, [selectedEmpIdx]);

  //Fetch data get all chemist data
  const getChemistData = async () => {
    try {
      setLoading(true);
      const data = await getAllChemist();
      setChemist(data.map((item) => ({ ...item, id: item.chemistCode })));
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  //Fetch data for get all employees
  const fetchData = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setUsers(users);
      console.log(users);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while fetching data.");
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
      setFilterChemist(
        chemist.filter((item) => Number(item.headquarter) == selectedHeadQuater)
      );
      setFilterUsers(
        users.filter((item) => Number(item.headQuater) == selectedHeadQuater)
      );
    } else {
      setFilterChemist(chemist);
      setFilterUsers(users);
    }
  }, [selectedHeadQuater, chemist, users]);

  useEffect(() => {
    fetchAllData();
    fetchHeadQuater();
  }, []);

  const mappedUsers = filterUsers.map((items) => ({
    ...items,
    empname: `${items.firstName} ${items.lastName}`.toLowerCase(),
  }));

  const filteredEmployee = mappedUsers.filter(
    (items) =>
      items?.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      items?.empname?.toLowerCase().includes(userSearch.toLowerCase()) ||
      items?.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      items?.phoneNumber?.toLowerCase().includes(userSearch.toLowerCase()) ||
      items?.designationName
        ?.toLowerCase()
        .includes(userSearch.toLowerCase()) ||
      items?.joiningDate?.toLowerCase().includes(userSearch.toLowerCase()) ||
      items?.panCard?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredChemist = filterChemist.filter(
    (items) =>
      items?.chemistName?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.mobileNo?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.addressLine1
        ?.toLowerCase()
        .includes(chemistSearch.toLowerCase()) ||
      items?.addressLine2
        ?.toLowerCase()
        .includes(chemistSearch.toLowerCase()) ||
      items?.pinCode?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.chemistArea?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.vfreq?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.phone?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.gender?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.contactPerson
        ?.toLowerCase()
        .includes(chemistSearch.toLowerCase()) ||
      items?.routeName?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.dob?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.chemistType?.toLowerCase().includes(chemistSearch.toLowerCase()) ||
      items?.dob?.toLowerCase().includes(chemistSearch.toLowerCase())
  );

  const handleSelectChemist = (newChemist) => {
    setSelectedChemIdx(newChemist);
    setSelectedChemist(
      chemist.filter((item, index) => newChemist.includes(index + 1))
    );
  };

  const handleSelectEmployee = (newEmployee) => {
    setSelectedEmpIdx(newEmployee);
    setSelectedEmployee(
      users.find((item, index) => item.id === newEmployee[0])
    );
  };

  const handleSave = async () => {
    let mappingObj = {
      chemistsMappingList: prepareObj(selectedChemist, selectedEmployee),
      employeeCode: user.id,
      isActive: 1,
      createdBy: 0,
    };
    try {
      console.log(mappingObj);
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

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <h1 className="text-gray-600 text-base md:text-lg font-medium">
          Chemist Mapping
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>HeadQuater:</span>
            <select
              onChange={(e) => setSelectedHeadQuater(e.target.value)}
              className="rounded-md border-neutral-200 border p-1 outline-none"
            >
              <option value="">All Headquater</option>
              {headQuater.map((item) => (
                <option value={item.hqid}>{item.hqName}</option>
              ))}
            </select>
          </div>
          <span
            onClick={() => fetchAllData}
            className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border border-slate-200 flex justify-center items-center rounded-md"
          >
            <AutorenewIcon></AutorenewIcon>
          </span>
        </div>
      </div>

      <div className="h-auto grid md:grid-cols-2 grid-cols-1 items-center gap-2">
        <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="mb-2 font-medium text-lg">Employee</h1>

            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search Employee..."
              className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <Box
            sx={{
              height: "90%",
            }}
          >
            <DataGrid
              rows={filteredEmployee}
              columns={empMapColumns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "#c8e6c9", // light green
                  color: "#2e7d32", // darker green text
                },
              }}
              // checkboxSelection
              rowSelectionModel={selectedEmpIdx}
              onRowSelectionModelChange={(newSelected) => {
                // Allow only one selection
                const selected = Array.isArray(newSelected)
                  ? newSelected[0]
                  : newSelected;
                handleSelectEmployee(selected ? [selected] : []);
              }}
            />
          </Box>
        </div>

        <div className="h-full py-4 px-3 custom-shadow rounded-md bg-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="mb-2 font-medium text-lg">Chemist</h1>
            <input
              type="text"
              value={chemistSearch}
              onChange={(e) => setChemistSearch(e.target.value)}
              placeholder="Search Chemist..."
              className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <Box
            sx={{
              height: "90%",
            }}
          >
            <DataGrid
              rows={filteredChemist}
              columns={chemistMapColumns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              rowSelectionModel={selectedChemIdx}
              onRowSelectionModelChange={(newSelected) =>
                handleSelectChemist(newSelected)
              }
            />
          </Box>
        </div>
      </div>

      <div className="flex place-content-center  items-center rounded-md custom-shadow p-2 bg-white">
        <button
          disabled={
            selectedChemist.length === 0 || selectedEmployee.length === 0
          }
          onClick={handleSave}
          className={`bg-themeblue disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md hover:bg-blue-800 transition-all duration-300 text-white w-24 p-1`}
        >
          {saveLoader ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin"></LoaderCircle>
              Loading..
            </div>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChemistMapping;
