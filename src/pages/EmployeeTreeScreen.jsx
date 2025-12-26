import React, { useEffect, useState, useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";

const EmployeeCard = ({ emp }) => (
    <div className="bg-white border rounded-md p-2 shadow min-w-[120px] text-center">
        <div className="flex justify-center mb-1">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-1">
                <PersonIcon fontSize="inherit" style={{ fontSize: 16 }} />
            </div>
        </div>
        <div className="font-semibold text-[12px] leading-tight">{emp.username}</div>
        <div className="text-[10px] text-gray-500">{emp.designationName}</div>
    </div>
);

// Recursive Employee Tree
const EmployeeTreeGraph = ({ data }) => {
    if (!data?.length) return null;

    return (
        <div className="flex justify-center whitespace-nowrap">
            {data.map((emp) => (
                <div key={emp.id} className="flex flex-col items-center relative">

                    <EmployeeCard emp={emp} />

                    {emp.children.length > 0 && (
                        <>
                            {/* Vertical connector */}
                            <div className="w-px h-4 bg-gray-400" />
                            {/* Horizontal connector */}
                            <div className="relative flex justify-center w-full">
                                <div className="absolute top-4 h-px bg-gray-400 w-[calc(100%-40px)]" />
                            </div>

                            <div className="w-px h-4 bg-gray-400" />
                            <div className="flex gap-2 mt-4 relative">
                                {emp.children.map((child) => (
                                    <div key={child.id} className="flex flex-col items-center">
                                        <div className="w-px h-4 bg-gray-400" />
                                        <EmployeeTreeGraph data={[child]} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

// Employee table
const EmployeeTable = ({ data }) => (
    <div className="mt-10 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Employee List</h2>
        <table className="min-w-full border text-sm">
            <thead className="bg-blue-100">
                <tr>
                    <th className="border px-3 py-2 text-left">ID</th>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Designation</th>
                    <th className="border px-3 py-2 text-left">Reporting To</th>
                    <th className="border px-3 py-2 text-left">Level</th>
                </tr>
            </thead>
            <tbody>
                {data.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{emp.id}</td>
                        <td className="border px-3 py-2">{emp.username}</td>
                        <td className="border px-3 py-2">{emp.designationName}</td>
                        <td className="border px-3 py-2">{emp.reportingTo ?? "-"}</td>
                        <td className="border px-3 py-2">{emp.level}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((emp) => {
        map[emp.id] = { ...emp, children: [] };
    });

    list.forEach((emp) => {
        if (emp.reportingTo && map[emp.reportingTo]) {
            map[emp.reportingTo].children.push(map[emp.id]);
        } else {
            roots.push(map[emp.id]);
        }
    });

    return roots;
};

const EmployeeTreeScreen = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await api.get("User/MyTeam");
                console.log("Fetched employees:", response.data.data);
                setEmployees(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTeam();
    }, []);

    const treeData = useMemo(() => buildTree(employees), [employees]);

    return (
        <div className="bg-gray-100 min-h-screen p-6 overflow-auto">
            <div className="flex items-center gap-3 bg-white p-3 rounded-md shadow mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    title="Back"
                >
                    <ArrowBackIcon fontSize="small" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">
                    Employee Hierarchy (Org Chart)
                </h1>
            </div>

            {/* Tree */}
            <div className="bg-white p-6 rounded-md overflow-x-auto">
                <div className="inline-block min-w-max">
                    <EmployeeTreeGraph data={treeData} />
                </div>
            </div>

            {/* Table */}
            <EmployeeTable data={employees} />
        </div>
    );
};

export default EmployeeTreeScreen;
