import React, { useEffect, useState } from "react";
import api from "../api";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const GetExpense = () => {
    const [expenseList, setExpenseList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchExpenses();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoader(true);
        try {
            const response = await api.get("/User/GetUserReport");
            setUsers(response.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            setLoader(true);
            const res = await api.get("/UserExpense");
            setExpenseList(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoader(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-700";
            case "Rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setLoader(true);
            await api.post(`/UserExpense/${id}/${newStatus}`);
            fetchExpenses()
            toast.success(`Expense ${newStatus}!`);
            setExpenseList((prev) =>
                prev.map((exp) =>
                    exp.expenseId === id ? { ...exp, status: newStatus } : exp
                )
            );

        } catch (err) {
            console.error(err);
            toast.error("Failed to update status!");
        } finally {
            setLoader(false);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchText("");
        setSelectedUser("");
        setStatusFilter("");
        setFromDate("");
        setToDate("");
        fetchExpenses();
    };

    // Filter & search
    const filteredData = expenseList
        .filter((exp) => !selectedUser || exp.userName === selectedUser)
        .filter((exp) => !statusFilter || exp.status === statusFilter)
        .filter((exp) => {
            if (!fromDate) return true;
            return new Date(exp.expenseDate) >= new Date(fromDate);
        })
        .filter((exp) => {
            if (!toDate) return true;
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999); // end of the day
            return new Date(exp.expenseDate) <= to;
        })
        .filter((exp) => {
            if (!searchText) return true;

            const text = searchText.toLowerCase();

            const fields = [
                exp.expenseId,
                exp.userName,
                exp.expenseMasterName,
                exp.amount,
                exp.status,
                exp.description,
                new Date(exp.expenseDate).toLocaleDateString()
            ];

            return fields.some((field) =>
                String(field).toLowerCase().includes(text)
            );
        })
    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Excel Export
    const exportToExcel = () => {
        const data = filteredData.map((exp) => ({
            ID: exp.expenseId,
            Name: exp.userName,
            Type: exp.expenseMasterName,
            Amount: exp.amount,
            Date: new Date(exp.expenseDate).toLocaleDateString(),
            Status: exp.status,
            Description: exp.description || "-",
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "expenses.xlsx");
    };

    // Grouped data
    const groupedData = paginatedData.reduce((acc, exp) => {
        if (!acc[exp.userName]) acc[exp.userName] = [];
        acc[exp.userName].push(exp);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4"> <div className="text-gray-800 p-2 mb-2">
            {/* <h1 className="text-xl font-semibold tracking-wide">Expense Records</h1> */}
        </div>
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 flex flex-wrap gap-3 items-end mb-4">
                <div>
                    <label className="text-sm font-medium">User:</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    >
                        <option value="">All</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.name}>
                                {user.codeName || user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">From:</label>
                    <input
                        type="date"
                        value={fromDate}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">To:</label>
                    <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Search:</label>
                    <input
                        type="text"
                        placeholder="Search.."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="ml-2 p-2 border rounded"
                    />
                </div>
                <button onClick={handleRefresh} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Refresh
                </button>
                {filteredData?.length > 0 && (
                    <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">
                        Export Excel
                    </button>
                )}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
                {paginatedData.length === 0 ? (
                    <p className="p-4 text-gray-500">No expenses found.</p>
                ) : (
                    <table className="min-w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-50 text-gray-600 border-b">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((exp) => (
                                <tr key={exp.expenseId} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{exp.expenseId}</td>
                                    <td className="p-3">{exp.userName}</td>
                                    <td className="p-3 font-medium text-gray-700">{exp.expenseMasterName}</td>
                                    <td className="p-3 text-gray-700">₹{exp.amount}</td>
                                    <td className="p-3 text-gray-700">
                                        {new Date(exp.expenseDate).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        {exp.status === "Pending" ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(exp.expenseId, "approve")}
                                                    className="px-4 py-1.5 bg-green-400 hover:bg-green-500 text-white text-xs rounded-lg shadow-sm"
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    onClick={() => handleStatusChange(exp.expenseId, "reject")}
                                                    className="px-4 py-1.5 bg-red-400 hover:bg-red-500 text-white text-xs rounded-lg shadow-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className={`px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(
                                                    exp.status
                                                )}`}
                                            >
                                                {exp.status}
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {exp.description || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {paginatedData?.length > 0 && (
                <div className="flex justify-end items-center bg-white p-3 gap-5 rounded-xl shadow mt-4 text-sm border">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);
                                setPageSize(newSize);
                                setCurrentPage(1);
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
                        {filteredData.length === 0
                            ? "0–0 of 0"
                            : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                                currentPage * pageSize,
                                filteredData.length
                            )} of ${filteredData.length}`}
                    </span>

                    {/* Arrows */}
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

            {loader && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );
};

export default GetExpense;
