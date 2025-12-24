import React, { useMemo } from "react";
import PersonIcon from "@mui/icons-material/Person";

/* =======================
   1️⃣ TABLE DATA (IMAGE WALA)
======================= */
const EMPLOYEES = [
    { id: 80, fullName: "SHYAMA PRASAD MOHANTY", designationName: "Regional Sales Manager", reportingTo: null },
    { id: 86, fullName: "PRADEEP PRASAD", designationName: "Regional Sales Manager", reportingTo: 80 },
    { id: 90, fullName: "CHANDAN KR SINGH", designationName: "Regional Sales Manager", reportingTo: 80 },

    { id: 91, fullName: "VISHNU PATIDAR", designationName: "Area Sales Manager", reportingTo: 90 },
    { id: 89, fullName: "DASRATH KUMAR", designationName: "Business Executive", reportingTo: 91 },
    { id: 92, fullName: "RAJPAL PATIDAR", designationName: "Business Executive", reportingTo: 91 },
    { id: 93, fullName: "DURGESH BIRLA", designationName: "Business Executive", reportingTo: 91 },
    { id: 94, fullName: "SHASHANK BHATNAGAR", designationName: "Business Executive", reportingTo: 91 },

    { id: 71, fullName: "LOKESH RAHANGDALE", designationName: "Area Sales Manager", reportingTo: 86 },
    { id: 72, fullName: "SANDEEP PANDEY", designationName: "Area Sales Manager", reportingTo: 86 },

    { id: 66, fullName: "ISHWAR KUMAR JAIN", designationName: "Business Executive", reportingTo: 72 },
    { id: 70, fullName: "RATH RAM KUMAR", designationName: "Business Executive", reportingTo: 72 },
    { id: 88, fullName: "DHANNU RAM SAHU", designationName: "Business Executive", reportingTo: 72 },

    { id: 67, fullName: "LOCHAN SAHU", designationName: "Business Executive", reportingTo: 71 },
    { id: 87, fullName: "DEVENDRA SAHU", designationName: "Business Executive", reportingTo: 71 },
];

/* =======================
   2️⃣ BUILD TREE LOGIC
======================= */
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


const EmployeeTreeScreen = () => {
    const treeData = useMemo(() => buildTree(EMPLOYEES), []);

    return (
        <div className="bg-gray-100 min-h-screen p-6 overflow-auto">
            <h1 className="text-xl font-semibold mb-6">
                Employee Hierarchy (Org Chart)
            </h1>

            <div className="bg-white p-6 rounded-md overflow-x-auto overflow-y-auto">
                <div className="inline-block min-w-max">
                    <EmployeeTreeGraph data={treeData} />
                </div>
            </div>
        </div>
    );
};

export default EmployeeTreeScreen;
