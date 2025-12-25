import React, { useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EMPLOYEES = [
    { id: 80, fullName: "SHYAMA PRASAD MOHANTY", designationName: "Regional Sales Manager", reportingTo: null, level: 0 },
    { id: 86, fullName: "PRADEEP PRASAD", designationName: "Regional Sales Manager", reportingTo: 80, level: 1 },
    { id: 91, fullName: "CHANDAN KR SINGH", designationName: "Regional Sales Manager", reportingTo: 80, level: 1 },

    { id: 91, fullName: "VISHNU PATIDAR", designationName: "Area Sales Manager", reportingTo: 90, level: 2 },
    { id: 89, fullName: "DASRATH KUMAR", designationName: "Business Executive", reportingTo: 91, level: 3 },
    { id: 92, fullName: "RAJPAL PATIDAR", designationName: "Business Executive", reportingTo: 91, level: 3 },
    { id: 93, fullName: "DURGESH BIRLA", designationName: "Business Executive", reportingTo: 91, level: 3 },
    { id: 94, fullName: "SHASHANK BHATNAGAR", designationName: "Business Executive", reportingTo: 91, level: 3 },

    { id: 71, fullName: "LOKESH RAHANGDALE", designationName: "Area Sales Manager", reportingTo: 86, level: 2 },
    { id: 72, fullName: "SANDEEP PANDEY", designationName: "Area Sales Manager", reportingTo: 86, level: 2 },

    { id: 66, fullName: "ISHWAR KUMAR JAIN", designationName: "Business Executive", reportingTo: 72, level: 3 },
    { id: 73, fullName: "RATH RAM KUMAR", designationName: "Business Executive", reportingTo: 72, level: 3 },
    { id: 88, fullName: "DHANNU RAM SAHU", designationName: "Business Executive", reportingTo: 72, level: 3 },

    { id: 67, fullName: "LOCHAN SAHU", designationName: "Business Executive", reportingTo: 71, level: 3 },
    { id: 87, fullName: "DEVENDRA SAHU", designationName: "Business Executive", reportingTo: 71, level: 3 },
];

const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach(emp => {
        map[emp.id] = { ...emp, children: [] };
    });

    list.forEach(emp => {
        if (emp.reportingTo && map[emp.reportingTo]) {
            map[emp.reportingTo].children.push(map[emp.id]);
        } else {
            roots.push(map[emp.id]); // level 0
        }
    });

    return roots;
};

const EmployeeCard = ({ emp }) => (
    <div className="bg-white border rounded-md p-1.5 shadow min-w-[120px] text-center">
        <div className="flex justify-center mb-[2px]">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-[2px]">
                <PersonIcon fontSize="inherit" style={{ fontSize: 14 }} />
            </div>
        </div>
        <div className="font-semibold text-[11px] leading-tight">
            {emp.fullName}
        </div>
        <div className="text-[9px] text-gray-500">
            {emp.designationName}
        </div>
    </div>
);

const EmployeeTreeGraph = ({ data }) => {
    if (!data?.length) return null;

    return (
        <div className="flex justify-center whitespace-nowrap">
            {data.map(emp => (
                <div key={emp.id} className="flex flex-col items-center mx-2 relative">

                    <EmployeeCard emp={emp} />

                    {emp.children.length > 0 && (
                        <>
                            {/* vertical */}
                            <div className="w-px h-3 bg-gray-400" />

                            {/* horizontal */}
                            <div className="relative w-full flex justify-center">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gray-400" />
                            </div>

                            {/* children */}
                            <div className="flex gap-3 mt-2">
                                {emp.children.map(child => (
                                    <div key={child.id} className="flex flex-col items-center">
                                        <div className="w-px h-3 bg-gray-400" />
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

const EmployeeTable = ({ data }) => {
    return (
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
                    {data.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="border px-3 py-2">{emp.id}</td>
                            <td className="border px-3 py-2">{emp.fullName}</td>
                            <td className="border px-3 py-2">{emp.designationName}</td>
                            <td className="border px-3 py-2">
                                {emp.reportingTo ?? "-"}
                            </td>
                            <td className="border px-3 py-2">{emp.level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EmployeeTreeScreen = () => {
    const treeData = useMemo(() => buildTree(EMPLOYEES), []);
    const navigate = useNavigate();

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
            <EmployeeTable data={EMPLOYEES} />
        </div>
    );
};

export default EmployeeTreeScreen;
