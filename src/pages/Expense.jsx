// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import api from "../api";
// import { Search, Pencil, Trash2, X, LoaderCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function ExpenseList() {
//     const { user } = useSelector((state) => state.auth);
//     const [expenses, setExpenses] = useState([]);
//     const [filteredExpenses, setFilteredExpenses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [status, setStatus] = useState("All");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");
//     const [expenseTypes, setExpenseTypes] = useState([]);
//     const [editing, setEditing] = useState(null);
//     const [editData, setEditData] = useState({ amount: "", description: "", expenseId: "", expenseDate: "", status: "", expenseMasterId: "" });
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentData = filteredExpenses?.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredExpenses?.length / itemsPerPage);

//     const navigate = useNavigate();

//     const fetchExpenses = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("/UserExpense");
//             const myExpenses = res.data.filter((e) => e.userId === user?.id);
//             setExpenses(myExpenses);
//             setFilteredExpenses(res.data);

//         } catch (error) {
//             console.error("Fetch Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     useEffect(() => {
//         let data = [...expenses];

//         if (status !== "All") data = data.filter((e) => e.status === status);
//         if (fromDate) data = data.filter((e) => e.expenseDate.slice(0, 10) >= fromDate);
//         if (toDate) data = data.filter((e) => e.expenseDate.slice(0, 10) <= toDate);

//         if (searchTerm.trim()) {
//             const term = searchTerm.toLowerCase();

//             data = data.filter((e) =>
//                 e.description?.toLowerCase().includes(term) ||
//                 e.expenseMasterName?.toLowerCase().includes(term) ||
//                 e.amount.toString().toLowerCase().includes(term) ||
//                 e.status?.toLowerCase().includes(term) ||
//                 e.expenseDate?.slice(0, 10).toLowerCase().includes(term)
//             );
//         }
//         setFilteredExpenses(data);
//     }, [status, fromDate, toDate, searchTerm, expenses]);

//     const handleEdit = (exp) => {
//         setEditing(exp);
//         setEditData({
//             expenseId: exp.expenseId,
//             amount: exp.amount,
//             description: exp.description,
//             expenseDate: exp.expenseDate,
//             status: exp.status,
//             expenseMasterId: exp.expenseMasterId,
//             expenseMasterName: exp.expenseMasterName,
//             approvalBy: exp.approvalBy,
//             approvalDateTime: exp.approvalDateTime,
//             createdBy: exp.createdBy,
//             updatedBy: exp.updatedBy,
//             isActive: exp.isActive
//         });
//     };

//     const saveEdit = async () => {
//         try {
//             setLoading(true);
//             const payload = {
//                 expenseId: editData.expenseId,
//                 userId: user?.id,
//                 userName: user?.username,
//                 expenseMasterId: editData.expenseMasterId,
//                 expenseMasterName: expenseTypes.find(t => t.expenseId == editData.expenseMasterId)?.name || "",
//                 amount: editData.amount,
//                 description: editData.description,
//                 expenseDate: editData.expenseDate,
//                 status: editData.status,
//                 approvalBy: null,
//                 approvalDateTime: null,
//                 createdBy: user?.id,
//                 updatedBy: user?.id,
//                 isActive: editData.isActive
//             };

//             console.log("payload", payload)
//             await api.post(`/UserExpense/${editData.expenseId}`, payload);
//             setExpenses(prev =>
//                 prev.map(e => e.expenseId === editing.expenseId ? { ...e, ...payload } : e)
//             );
//             setEditing(null);
//             toast.success("Expense updated successfully!");
//         } catch (err) {
//             toast.error("Failed to update expense!");
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
//             await api.post(`/UserExpense/delete/${id}`);
//             fetchExpenses();
//             toast.success("Expense deleted successfully!");
//             setExpenses((prev) => prev.filter((e) => e.expenseId !== id));
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         fetchType();
//     }, []);

//     const fetchType = async () => {
//         try {
//             const response = await api.get("/ExpenseMaster");
//             setExpenseTypes(response.data);
//         } catch (err) {
//             console.log(err);
//             toast.error("Failed to load expense types.");
//         }
//     };

//     const downloadExcel = () => {
//         const sheetData = filteredExpenses.map((e) => ({
//             Date: e.expenseDate.slice(0, 10),
//             Type: e.expenseMasterName,
//             Description: e.description,
//             Amount: e.amount,
//             Status: e.status
//         }));

//         const worksheet = XLSX.utils.json_to_sheet(sheetData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "array",
//         });

//         const blob = new Blob([excelBuffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         saveAs(blob, "Expense_Report.xlsx");
//     };

//     return (
//         <div className="p-5">
//             <h1 className="text-xl font-semibold text-gray-800">Expense Management</h1>
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-5 mb-6 gap-4">
//                 <div className="flex flex-wrap items-center gap-3">
//                     <select
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value)}
//                         className="border p-2 rounded-md"
//                     >
//                         <option>All</option>
//                         <option>Pending</option>
//                         <option>Approved</option>
//                         <option>Rejected</option>
//                     </select>

//                     <input
//                         type="date"
//                         value={fromDate}
//                         max={new Date().toISOString().split("T")[0]}
//                         onChange={(e) => setFromDate(e.target.value)}
//                         className="border p-2 rounded-md"
//                     />

//                     <input
//                         type="date"
//                         value={toDate}
//                         max={new Date().toISOString().split("T")[0]}
//                         onChange={(e) => setToDate(e.target.value)}
//                         className="border p-2 rounded-md"
//                     />

//                     <div className="flex items-center border p-2 rounded-md">
//                         <Search size={18} className="text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="ml-2 outline-none"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>

//                     <button
//                         onClick={() => {
//                             setStatus("All");
//                             setFromDate("");
//                             setToDate("");
//                             setSearchTerm("");
//                             fetchExpenses();
//                         }}
//                         className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
//                     >
//                         Refresh
//                     </button>

//                     {filteredExpenses?.length > 0 && (
//                         <button
//                             onClick={downloadExcel}
//                             className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//                         >
//                             Download Excel
//                         </button>
//                     )}

//                     <button
//                         onClick={() => navigate("addExpense")}
//                         className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//                     >
//                         Add
//                     </button>
//                 </div>
//             </div>

//             {currentData?.length === 0 ? (
//                 <p>No expenses found.</p>
//             ) : (
//                 <table className="w-full border">
//                     <thead>
//                         <tr className="bg-blue-50">
//                             <th className="border p-2">Date</th>
//                             <th className="border p-2">Type</th>
//                             <th className="border p-2">Description</th>
//                             <th className="border p-2">Amount</th>
//                             <th className="border p-2">Status</th>
//                             <th className="border p-2 text-center">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {currentData?.map((exp) => (
//                             <tr key={exp.expenseId}>
//                                 <td className="border p-2">{exp.expenseDate?.slice(0, 10)}</td>
//                                 <td className="border p-2">{exp.expenseMasterName}</td>
//                                 <td className="border p-2">{exp.description}</td>
//                                 <td className="border p-2">₹{exp.amount}</td>
//                                 <td className="border p-2">{exp.status}</td>
//                                 <td className="border p-2 text-center">
//                                     {exp.status === "Pending" ? (
//                                         <div className="flex justify-center gap-3">
//                                             <button
//                                                 onClick={() => handleEdit(exp)}
//                                                 className="text-blue-600"
//                                             >
//                                                 <Pencil size={18} />
//                                             </button>

//                                             <button
//                                                 onClick={() => handleDelete(exp.expenseId)}
//                                                 className="text-red-600"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         "—"
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}


//             {editing && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/50">
//                     <div className="bg-white p-6 rounded-xl w-80 relative">
//                         <button
//                             className="absolute right-3 top-3"
//                             onClick={() => setEditing(null)}
//                         >
//                             <X />
//                         </button>

//                         <h2 className="text-lg font-bold mb-4">Edit Expense</h2>

//                         <label>Amount</label>
//                         <input
//                             className="border p-2 w-full rounded mb-3"
//                             type="number"
//                             value={editData.amount}
//                             onChange={(e) =>
//                                 setEditData({ ...editData, amount: e.target.value })
//                             }
//                         />

//                         <label>Description</label>
//                         <textarea
//                             className="border p-2 w-full rounded mb-3"
//                             rows={3}
//                             value={editData.description}
//                             onChange={(e) =>
//                                 setEditData({ ...editData, description: e.target.value })
//                             }
//                         />

//                         <label>Expense Type</label>
//                         <select
//                             value={editData.expenseMasterId || ""}
//                             onChange={(e) =>
//                                 setEditData({ ...editData, expenseMasterId: e.target.value })
//                             }
//                             className="border p-2 w-full rounded mb-3"
//                         >
//                             <option value="" disabled>
//                                 -- Select Expense Type --
//                             </option>

//                             {expenseTypes?.map((type) => (
//                                 <option key={type.expenseId} value={type.expenseId}>
//                                     {type.name}
//                                 </option>
//                             ))}
//                         </select>

//                         <label>Date</label>
//                         <input
//                             type="date"
//                             className="border p-2 w-full rounded mb-4"
//                             max={new Date().toISOString().split("T")[0]}
//                             value={editData.expenseDate?.slice(0, 10)}
//                             onChange={(e) =>
//                                 setEditData({ ...editData, expenseDate: e.target.value })
//                             }
//                         />

//                         <button
//                             className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//                             onClick={() => saveEdit()}
//                         >
//                             {loading ? "loading" : "Save Changes"}
//                         </button>
//                     </div>
//                 </div>
//             )
//             }

//             {filteredExpenses?.length > itemsPerPage && (
//                 <div className="flex justify-center items-center gap-3 mt-4">
//                     <button
//                         className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                         disabled={currentPage === 1}
//                         onClick={() => setCurrentPage(prev => prev - 1)}
//                     >
//                         Prev
//                     </button>

//                     <span className="font-semibold">
//                         Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                         className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                         disabled={currentPage === totalPages}
//                         onClick={() => setCurrentPage(prev => prev + 1)}
//                     >
//                         Next
//                     </button>
//                 </div>

//             )}

//             {loading &&
//                 <div className="flex items-center gap-2 bg-gray-100">
//                     <LoaderCircle className="animate-spin" />
//                 </div>}
//         </div >
//     );
// }


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import { Search, Pencil, Trash2, X, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExpenseList() {
    const { user } = useSelector((state) => state.auth);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredExpenses?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredExpenses?.length / itemsPerPage);
    const navigate = useNavigate();

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await api.get("/UserExpense");
            const myExpenses = res.data.filter((e) => e.userId === user?.id);
            setExpenses(myExpenses);
            setFilteredExpenses(myExpenses);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchType();
    }, []);

    useEffect(() => {
        let data = [...expenses];
        if (status !== "All") data = data.filter((e) => e.status === status);
        if (fromDate) data = data.filter((e) => e.expenseDate.slice(0, 10) >= fromDate);
        if (toDate) data = data.filter((e) => e.expenseDate.slice(0, 10) <= toDate);
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            data = data.filter(
                (e) =>
                    e.description?.toLowerCase().includes(term) ||
                    e.expenseMasterName?.toLowerCase().includes(term) ||
                    e.amount.toString().toLowerCase().includes(term) ||
                    e.status?.toLowerCase().includes(term) ||
                    e.expenseDate?.slice(0, 10).toLowerCase().includes(term)
            );
        }
        setFilteredExpenses(data);
        setCurrentPage(1);
    }, [status, fromDate, toDate, searchTerm, expenses]);

    const fetchType = async () => {
        try {
            const response = await api.get("/ExpenseMaster");
            setExpenseTypes(response.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load expense types.");
        }
    };

    const handleEdit = (exp) => {
        setEditing(exp);
        setEditData(exp);
    };

    const saveEdit = async () => {
        try {
            setLoading(true);
            const payload = { ...editData, userId: user?.id };
            await api.post(`/UserExpense/${editData.expenseId}`, payload);
            setExpenses((prev) =>
                prev.map((e) => (e.expenseId === editing.expenseId ? { ...e, ...payload } : e))
            );
            setEditing(null);
            toast.success("Expense updated successfully!");
            fetchExpenses()
        } catch (err) {
            toast.error("Failed to update expense!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.post(`/UserExpense/delete/${id}`);
            setExpenses((prev) => prev.filter((e) => e.expenseId !== id));
            toast.success("Expense deleted successfully!");
        } catch (err) {
            console.log(err);
        }
    };

    const downloadExcel = () => {
        const sheetData = filteredExpenses.map((e) => ({
            Date: e.expenseDate.slice(0, 10),
            Type: e.expenseMasterName,
            Description: e.description,
            Amount: e.amount,
            Status: e.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Expense_Report.xlsx");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen bg-white">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Expense Management</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow flex flex-wrap items-center gap-3 mb-6">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-lg p-2 w-32"
                >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>

                <input
                    type="date"
                    value={fromDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border rounded-lg p-2"
                />
                <input
                    type="date"
                    value={toDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border rounded-lg p-2"
                />

                <div className="flex items-center border rounded-lg p-2 w-60">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => {
                        setStatus("All");
                        setFromDate("");
                        setToDate("");
                        setSearchTerm("");
                        fetchExpenses();
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    Refresh
                </button>
                <button
                    onClick={downloadExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Download Excel
                </button>
                <button
                    onClick={() => navigate("addExpense")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-50 text-gray-700">
                        <tr>
                            {["Date", "Type", "Description", "Amount", "Status", "Actions"].map(
                                (header) => (
                                    <th key={header} className="p-3 border-b font-medium">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center">
                                    No expenses found.
                                </td>
                            </tr>
                        ) : (
                            currentData.map((exp) => (
                                <tr
                                    key={exp.expenseId}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3 border-b">{exp.expenseDate?.slice(0, 10)}</td>
                                    <td className="border p-2">{exp.expenseMasterName}</td>
                                    <td className="p-3 border-b">{exp.description}</td>
                                    <td className="p-3 border-b">₹{exp.amount}</td>
                                    <td className="p-3 border-b">{exp.status}</td>
                                    <td className="p-3 border-b flex justify-center gap-2">
                                        {exp.status === "Pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(exp)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exp.expenseId)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredExpenses?.length > 0 && (
                <div className="flex justify-end items-center bg-white p-3 gap-5 rounded-xl mt-4 text-sm border">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);
                                setCurrentPage(1);
                                setItemsPerPage(newSize);
                            }}
                            className="border px-2 py-1 rounded"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* Page info */}
                    <span className="text-gray-700">
                        {filteredExpenses.length === 0
                            ? "0–0 of 0"
                            : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                                currentPage * itemsPerPage,
                                filteredExpenses.length
                            )} of ${filteredExpenses.length}`}
                    </span>

                    {/* Navigation arrows */}
                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="p-2 rounded disabled:opacity-30 hover:bg-gray-200"
                        >
                            ❮
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="p-2 rounded disabled:opacity-30 hover:bg-gray-200"
                        >
                            ❯
                        </button>
                    </div>
                </div>
            )}


            {/* Loading */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-xl w-96 relative">
                        <button
                            className="absolute top-3 right-3"
                            onClick={() => setEditing(null)}
                        >
                            <X />
                        </button>
                        <h2 className="text-lg font-bold mb-4">Edit Expense</h2>

                        <label className="block mb-1">Amount</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full mb-3"
                            value={editData.amount}
                            onChange={(e) =>
                                setEditData({ ...editData, amount: e.target.value })
                            }
                        />

                        <label className="block mb-1">Description</label>
                        <textarea
                            className="border p-2 rounded w-full mb-3"
                            rows={3}
                            value={editData.description}
                            onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                            }
                        />

                        <label className="block mb-1">Expense Type</label>
                        <select
                            value={editData.expenseMasterId || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, expenseMasterId: e.target.value })
                            }
                            className="border p-2 rounded w-full mb-3"
                        >
                            <option value="" disabled>
                                -- Select Expense Type --
                            </option>
                            {expenseTypes?.map((type) => (
                                <option key={type.expenseId} value={type.expenseId}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-1">Date</label>
                        <input
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            className="border p-2 rounded w-full mb-4"
                            value={editData.expenseDate?.slice(0, 10)}
                            onChange={(e) =>
                                setEditData({ ...editData, expenseDate: e.target.value })
                            }
                        />

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                            onClick={saveEdit}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
