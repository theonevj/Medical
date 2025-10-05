import React, { useEffect, useState } from "react";
import api from "../api";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//Importing icons
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
  
// Generate columns dynamically
const generateColumns = (data) => {
  if (data.length === 0) return [];
  return Object.keys(data[0]).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    selector: (row) =>
      typeof row[key] === "object" ? JSON.stringify(row[key]) : row[key],
    sortable: true,
  }));
};

const DynamicDataTable = ({ data, searchTerm, setSearchTerm }) => {
  const columns = generateColumns(data);

  const handleClearSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex justify-between mb-2">
        <div className=" p-2 space-x-2  min-w-60  border border-gray-500 rounded flex justify-between">
          <SearchOutlinedIcon className=" text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:ring-none focus:outline-none"
          />
          {searchTerm.length > 0 && (
            <button onClick={handleClearSearchTerm}>
              <CloseOutlinedIcon className=" text-red-500 text-[10px]" />
            </button>
          )}
        </div>
        <button
          onClick={() => exportToExcel(data)}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Export to Excel
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        noDataComponent="No data available"
      />
    </div>
  );
};

function DownloadReport() {
  const [HeadQuater, setHeadQuater] = useState([]);
  const [reportType, setReportType] = useState(null);
  const [reportTypeData, setReportTypeData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedHeadQuater, setSelectedHeadQuater] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReportData, setFilteredReportData] = useState([]);

  const fetchHeadQuaterData = async () => {
    try {
      const response = await api.get("/Headquarters");
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHeadQuaterData();
  }, []);

  const validateData = () => {
    let newErrors = {};

    if (!selectedHeadQuater) newErrors.HeadQuater = "Please select headquater.";
    if (!fromDate) newErrors.fromDate = "Please select from date.";
    if (!reportType) newErrors.reportType = "Please select report type.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchReportTypeData = async () => {
      try {
        const response = await api.get("/Report/ReportTypes");
        setReportTypeData(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await api.get("/User/GetUserReport");
        setUsers(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReportTypeData();
    fetchUserData();
  }, []);

  const fetchReport = async () => {
    if (validateData()) {
      setLoading(true);
      let obj = {
        hqId: selectedHeadQuater,
        reportType: reportType,
        fromDate: fromDate,
        toDate: toDate,
        userid: selectedUser,
      };
      try {
        const response = await api.post(`/Report/Report`, obj);
        let data = response.data.data;
        if (data.length > 0) {
          setReportData(data);
        } else {
          toast.error("There is no any data available.");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredReportData(reportData);
    }
    const filteredData = reportData.filter((row) => {
      return Object.values(row).some((value) => {
        const stringValue =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
    setFilteredReportData(filteredData);
  }, [searchTerm, reportData]);

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <h1 className="text-gray-600 text-base md:text-lg font-medium">
          Report
        </h1>
      </div>

      <div className="bg-white p-4 custom-shadow rounded-md flex flex-col gap-4">
        <h1 className="text-lg font-medium">Report Details</h1>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label>
              Report Type <span className="text-sm text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 outline-none border rounded-md border-neutral-400"
            >
              <option value={""}>--- Select Report Type ---</option>
              {reportTypeData.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
            {errors.reportType && (
              <span className="text-sm text-red-500">{errors.reportType}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label>
              HeadQuater <span className="text-sm text-red-500">*</span>
            </label>
            <select
              value={selectedHeadQuater}
              onChange={(e) => setSelectedHeadQuater(e.target.value)}
              className="p-2 outline-none border rounded-md border-neutral-400"
            >
              <option value={""}>--- Select HeadQuater ---</option>
              {HeadQuater.map((item, index) => (
                <option key={index} value={item.hqid}>
                  {item.hqName}
                </option>
              ))}
            </select>
            {errors.HeadQuater && (
              <span className="text-sm text-red-500">{errors.HeadQuater}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label>From Date</label>
            <input
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              type="date"
              className="p-2 outline-none border rounded-md border-neutral-400"
            ></input>
            {errors.fromDate && (
              <span className="text-sm text-red-500">{errors.fromDate}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label>To Date</label>
            <input
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              type="date"
              className="p-2 outline-none border rounded-md border-neutral-400"
            ></input>
          </div>
          <div className="flex flex-col gap-1">
            <label>User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="p-2 outline-none border rounded-md border-neutral-400"
            >
              <option value={""}>--- Select User ---</option>
              {user.map((item) => (
                <option value={item.codeID}>{item.codeName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full  flex justify-center items-center">
          <button
            onClick={fetchReport}
            className="text-white w-36 flex justify-center items-center p-2 font-medium rounded-md bg-themeblue"
          >
            {loading ? (
              <LoaderCircle className="animate-spin"></LoaderCircle>
            ) : (
              <span>Get Report</span>
            )}
          </button>
        </div>
      </div>

      <div>
        {reportData.length > 0 && (
          <DynamicDataTable
            data={filteredReportData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </div>
    </div>
  );
}

export default DownloadReport;
