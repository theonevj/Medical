import React, { useEffect, useState } from "react";
import api from "../api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExpenseForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        amount: "",
        description: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await api.get("/UserExpense");
            setExpenses(res.data);
            setFilteredExpenses(res.data);
        } catch (err) {
            console.error(err);
            // toast.error("Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = expenses.filter(
            (item) =>
                item?.expenseMasterName?.toLowerCase().includes(value) ||
                item?.description?.toLowerCase().includes(value) ||
                String(item?.amount)?.includes(value)
        );
        setFilteredExpenses(filtered);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setUpdatedData({
            amount: expense.amount,
            description: expense.description,
        });
    };

    const handleUpdate = async () => {
        try {
            const updatedExpense = {
                ...editingExpense,
                amount: updatedData.amount,
                description: updatedData.description,
            };
            await api.post(`/UserExpense/${editingExpense.expenseId}`, updatedExpense);
            toast.success("Expense updated successfully!");
            setExpenses((prev) =>
                prev.map((exp) =>
                    exp.expenseId === editingExpense.expenseId ? updatedExpense : exp
                )
            );
            setFilteredExpenses((prev) =>
                prev.map((exp) =>
                    exp.expenseId === editingExpense.expenseId ? updatedExpense : exp
                )
            );

            setEditingExpense(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update expense.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.post(`/UserExpense/delete/${id}`);
            toast.success("Expense deleted successfully!");
            setExpenses((prev) => prev.filter((item) => item.expenseId !== id));
            setFilteredExpenses((prev) => prev.filter((item) => item.expenseId !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete expense!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-500">All Expenses</h1>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <span className="text-gray-700 font-semibold text-lg">
                        Welcome, {user?.firstName || "User"} 👋
                    </span>
                    <button
                        onClick={() => navigate("addExpense")}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xs shadow-md transition-transform transform hover:scale-105"
                    >
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, description, or amount..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
            </div>

            {filteredExpenses?.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                    <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="p-3 border text-gray-700 font-semibold">Type</th>
                                <th className="p-3 border text-gray-700 font-semibold">Amount</th>
                                <th className="p-3 border text-gray-700 font-semibold">Details</th>
                                <th className="p-3 border text-gray-700 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses?.map((exp) => (
                                <tr key={exp.expenseId} className="hover:bg-gray-50 transition-all">
                                    <td className="p-3 border">{exp.expenseMasterName}</td>
                                    <td className="p-3 border">₹{exp.amount}</td>
                                    <td className="p-3 border">{exp.description}</td>
                                    <td className="p-3 border">
                                        <td className="p-3 text-center">

                                            {exp.status === "Pending" || exp.status === "pending" ? (
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() => handleEdit(exp)}
                                                        className="text-blue-600 hover:text-blue-800 transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={20} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(exp.expenseId)}
                                                        className="text-red-600 hover:text-red-800 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>

                                            ) : (
                                                <span
                                                    className={`px-3 py-1 rounded text-sm font-medium ${exp.status === "Approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : exp.status === "Rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-50 text-yellow-700"
                                                        }`}
                                                >
                                                    {exp.status}
                                                </span>
                                            )}
                                        </td>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : loading ? (
                <p className="text-center text-gray-600 mt-10 text-lg">
                    Loading expenses...
                </p>
            ) : (
                <p className="text-center text-gray-600 mt-10 text-lg">
                    No expenses found.
                </p>
            )
            }

            {
                editingExpense && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                            <button
                                onClick={() => setEditingExpense(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={22} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-indigo-600">
                                Edit Expense
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={updatedData.amount}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, amount: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Details
                                    </label>
                                    <textarea
                                        value={updatedData.description}
                                        onChange={(e) =>
                                            setUpdatedData({
                                                ...updatedData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ExpenseForm;
