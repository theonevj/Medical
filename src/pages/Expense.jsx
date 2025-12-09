import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import { Search, Pencil, Trash2, X } from "lucide-react";
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
    const [date, setDate] = useState("");
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({ amount: "", description: "", expenseId: "", expenseDate: "", status: "" });

    const navigate = useNavigate();

    const groupByName = (data) => {
        return data.reduce((acc, exp) => {
            if (!acc[exp.userName]) acc[exp.userName] = [];
            acc[exp.userName].push(exp);
            return acc;
        }, {});
    };

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
    }, []);

    useEffect(() => {
        let data = [...expenses];

        if (status !== "All") data = data.filter((e) => e.status === status);
        if (date) data = data.filter((e) => e.expenseDate.slice(0, 10) === date);

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();

            data = data.filter((e) =>
                e.description?.toLowerCase().includes(term) ||
                e.expenseMasterName?.toLowerCase().includes(term)
            );
        }
        setFilteredExpenses(data);
    }, [status, date, searchTerm, expenses]);

    const grouped = groupByName(filteredExpenses);
    const names = Object.keys(grouped);

    const handleEdit = (exp) => {
        setEditing(exp);
        setEditData({
            amount: exp.amount,
            description: exp.description,
            expenseId: exp.expenseId,
            expenseDate: exp.expenseDate,
            status: exp.status
        });
    };

    const saveEdit = async () => {
        console.log("Editing Data:", editData);
        try {
            const payload = {
                UserName: user?.name || "",
                amount: editData.amount,
                description: editData.description,
                expenseId: editData.expenseId,
                expenseDate: editData.expenseDate,
                status: editData.status || "Pending"
            };

            await api.post(`/UserExpense/${editing.expenseId}`, payload);

            // Update local state
            setExpenses(prev =>
                prev.map(e => e.expenseId === editing.expenseId ? { ...e, ...payload } : e)
            );

            setEditing(null);
            toast.success("Expense updated successfully!");
        } catch (err) {
            console.log(err.response?.data || err);
            toast.error("Failed to update expense!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await api.post(`/UserExpense/delete/${id}`);
            setExpenses((prev) => prev.filter((e) => e.expenseId !== id));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchType();
    }, []);

    const fetchType = async () => {
        try {
            const response = await api.get("/ExpenseMaster");
            setExpenseTypes(response.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load expense types.");
        }
    };

    const downloadExcel = () => {
        const sheetData = filteredExpenses.map((e) => ({
            Date: e.expenseDate.slice(0, 10),
            Type: e.expenseMasterName,
            Description: e.description,
            Amount: e.amount,
            Status: e.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Expense_Report.xlsx");
    };

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-semibold">Expense Management</h1>
                <button
                    onClick={() => navigate("addExpense")}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Add Expense
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded"
                />

                <div className="flex items-center border p-2 rounded">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => {
                        setStatus("All");
                        setDate("");
                        setSearchTerm("");
                        fetchExpenses();
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Refresh
                </button>

                {filteredExpenses?.length > 0 && (
                    <button
                        onClick={downloadExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Download Excel
                    </button>
                )}

            </div>

            {loading ? (
                <p>Loading...</p>
            ) : names.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                names.map((name) => (
                    <div key={name} className="mb-8">
                        <h2 className="text-xl font-bold mb-2">{name}</h2>

                        <table className="w-full border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Type</th>
                                    <th className="border p-2">Description</th>
                                    <th className="border p-2">Amount</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {grouped[name].map((exp) => (
                                    <tr key={exp.expenseId}>
                                        <td className="border p-2">
                                            {exp.expenseDate.slice(0, 10)}
                                        </td>
                                        <td className="border p-2">{exp.expenseMasterName}</td>
                                        <td className="border p-2">{exp.description}</td>
                                        <td className="border p-2">₹{exp.amount}</td>
                                        <td className="border p-2">{exp.status}</td>

                                        <td className="border p-2 text-center">
                                            {exp.status === "Pending" ? (
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(exp)}
                                                        className="text-blue-600"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(exp.expenseId)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}

            {editing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl w-80 relative">
                        <button
                            className="absolute right-3 top-3"
                            onClick={() => setEditing(null)}
                        >
                            <X />
                        </button>

                        <h2 className="text-lg font-bold mb-4">Edit Expense</h2>

                        {/* Amount */}
                        <label>Amount</label>
                        <input
                            className="border p-2 w-full rounded mb-3"
                            type="number"
                            value={editData.amount}
                            onChange={(e) =>
                                setEditData({ ...editData, amount: e.target.value })
                            }
                        />

                        {/* Description */}
                        <label>Description</label>
                        <textarea
                            className="border p-2 w-full rounded mb-3"
                            rows={3}
                            value={editData.description}
                            onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                            }
                        />

                        {/* Expense Type */}
                        <label>Expense Type</label>
                        <select
                            value={editData.expenseId || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, expenseId: e.target.value })
                            }
                            className="border p-2 w-full rounded mb-3"
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

                        {/* Date */}
                        <label>Date</label>
                        <input
                            type="date"
                            className="border p-2 w-full rounded mb-4"
                            value={editData.expenseDate?.slice(0, 10)}
                            onChange={(e) =>
                                setEditData({ ...editData, expenseDate: e.target.value })
                            }
                        />

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                            onClick={saveEdit}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
