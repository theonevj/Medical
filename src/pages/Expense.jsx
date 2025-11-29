// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { Pencil, Trash2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const ExpenseForm = () => {
//     const { user } = useSelector((state) => state.auth);
//     const [expenses, setExpenses] = useState([]);
//     const [filteredExpenses, setFilteredExpenses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [editingExpense, setEditingExpense] = useState(null);
//     const [updatedData, setUpdatedData] = useState({
//         amount: "",
//         description: "",
//     });
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     const fetchExpenses = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("/UserExpense");
//             console.log("res data", res?.data)
//             setExpenses(res.data);
//             setFilteredExpenses(res.data);
//         } catch (err) {
//             console.error(err);
//             // toast.error("Failed to load expenses.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (expense) => {
//         setEditingExpense(expense);
//         setUpdatedData({
//             amount: expense.amount,
//             description: expense.description,
//         });
//     };

//     const handleUpdate = async () => {
//         try {
//             const updatedExpense = {
//                 ...editingExpense,
//                 amount: updatedData.amount,
//                 description: updatedData.description,
//             };
//             await api.post(`/UserExpense/${editingExpense.expenseId}`, updatedExpense);
//             toast.success("Expense updated successfully!");
//             setExpenses((prev) =>
//                 prev.map((exp) =>
//                     exp.expenseId === editingExpense.expenseId ? updatedExpense : exp
//                 )
//             );
//             setFilteredExpenses((prev) =>
//                 prev.map((exp) =>
//                     exp.expenseId === editingExpense.expenseId ? updatedExpense : exp
//                 )
//             );

//             setEditingExpense(null);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to update expense.");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this expense?")) return;
//         try {
//             await api.post(`/UserExpense/delete/${id}`);
//             toast.success("Expense deleted successfully!");
//             setExpenses((prev) => prev.filter((item) => item.expenseId !== id));
//             setFilteredExpenses((prev) => prev.filter((item) => item.expenseId !== id));
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to delete expense!");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-blue-500">All Expenses</h1>
//                 <div className="flex items-center gap-4 mt-4 sm:mt-0">
//                     <span className="text-gray-700 font-semibold text-lg">
//                         Welcome, {user?.firstName || "User"} 👋
//                     </span>
//                     <button
//                         onClick={() => navigate("addExpense")}
//                         className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xs shadow-md transition-transform transform hover:scale-105"
//                     >
//                         Add Expense
//                     </button>
//                 </div>
//             </div>

//             {filteredExpenses?.length > 0 ? (
//                 <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
//                     <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
//                         <thead className="bg-indigo-100">
//                             <tr>
//                                 <th className="p-3 border text-gray-700 font-semibold">Id</th>
//                                 <th className="p-3 border text-gray-700 font-semibold">Name</th>
//                                 <th className="p-3 border text-gray-700 font-semibold">Type</th>
//                                 <th className="p-3 border text-gray-700 font-semibold">Amount</th>
//                                 <th className="p-3 border text-gray-700 font-semibold">Details</th>
//                                 <th className="p-3 border text-gray-700 font-semibold text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredExpenses?.map((exp) => (
//                                 <tr key={exp.expenseId} className="hover:bg-gray-50 transition-all">
//                                     <th className="p-3 border text-gray-700 font-semibold">{exp?.userId}</th>
//                                     <td className="p-3 border">{exp?.userName}</td>
//                                     <td className="p-3 border">{exp.expenseMasterName}</td>
//                                     <td className="p-3 border">₹{exp.amount}</td>
//                                     <td className="p-3 border">{exp.description}</td>
//                                     <td className="p-3 border">
//                                         <td className="p-3 text-center">

//                                             {exp.status === "Pending" || exp.status === "pending" ? (
//                                                 <div className="flex justify-center gap-4">
//                                                     <button
//                                                         onClick={() => handleEdit(exp)}
//                                                         className="text-blue-600 hover:text-blue-800 transition"
//                                                         title="Edit"
//                                                     >
//                                                         <Pencil size={20} />
//                                                     </button>

//                                                     <button
//                                                         onClick={() => handleDelete(exp.expenseId)}
//                                                         className="text-red-600 hover:text-red-800 transition"
//                                                         title="Delete"
//                                                     >
//                                                         <Trash2 size={20} />
//                                                     </button>
//                                                 </div>

//                                             ) : (
//                                                 <span
//                                                     className={`px-3 py-1 rounded text-sm font-medium ${exp.status === "Approved"
//                                                         ? "bg-green-100 text-green-700"
//                                                         : exp.status === "Rejected"
//                                                             ? "bg-red-100 text-red-700"
//                                                             : "bg-yellow-50 text-yellow-700"
//                                                         }`}
//                                                 >
//                                                     {exp.status}
//                                                 </span>
//                                             )}
//                                         </td>

//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : loading ? (
//                 <p className="text-center text-gray-600 mt-10 text-lg">
//                     Loading expenses...
//                 </p>
//             ) : (
//                 <p className="text-center text-gray-600 mt-10 text-lg">
//                     No expenses found.
//                 </p>
//             )
//             }

//             {
//                 editingExpense && (
//                     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
//                             <button
//                                 onClick={() => setEditingExpense(null)}
//                                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                             >
//                                 <X size={22} />
//                             </button>
//                             <h2 className="text-2xl font-bold mb-6 text-indigo-600">
//                                 Edit Expense
//                             </h2>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-gray-700 font-semibold mb-2">
//                                         Amount
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={updatedData.amount}
//                                         onChange={(e) =>
//                                             setUpdatedData({ ...updatedData, amount: e.target.value })
//                                         }
//                                         className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-gray-700 font-semibold mb-2">
//                                         Details
//                                     </label>
//                                     <textarea
//                                         value={updatedData.description}
//                                         onChange={(e) =>
//                                             setUpdatedData({
//                                                 ...updatedData,
//                                                 description: e.target.value,
//                                             })
//                                         }
//                                         className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                                         rows="3"
//                                     />
//                                 </div>

//                                 <div className="flex justify-end mt-6">
//                                     <button
//                                         onClick={handleUpdate}
//                                         className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
//                                     >
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )
//             }
//         </div >
//     );
// };

// export default ExpenseForm;

import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Pencil, Trash2, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExpenseForm = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingExpense, setEditingExpense] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        amount: "",
        description: "",
    });

    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
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
        } finally {
            setLoading(false);
        }
    };

    const groupByName = (data) => {
        const grouped = {};
        data?.forEach((exp) => {
            if (!grouped[exp.userName]) grouped[exp.userName] = [];
            grouped[exp.userName].push(exp);
        });
        return grouped;
    };

    const applyFilters = () => {
        let data = [...expenses];

        const search = searchText.trim().toLowerCase();
        const status = selectedStatus.trim().toLowerCase();

        if (search !== "") {
            data = data.filter((exp) =>
                exp.userName?.toLowerCase().includes(search) ||
                exp.expenseMasterName?.toLowerCase().includes(search) ||
                exp.description?.toLowerCase().includes(search)
            );
        }

        if (selectedStatus !== "All") {
            data = data.filter(
                (exp) => exp.status?.trim().toLowerCase() === status
            );
        }

        setFilteredExpenses(data);
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
            applyFilters();
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
            applyFilters();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete expense!");
        }
    };

    const grouped = groupByName(filteredExpenses);

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-wide">
                    Expense Management
                </h1>

                <button
                    onClick={() => navigate("addExpense")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition duration-300"
                >
                    + Add Expense
                </button>
            </div>

            {/* FILTER BOX */}
            <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">

                {/* SEARCH */}
                <div className="relative w-full sm:w-1/3">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, type, details..."
                        className="border pl-10 px-4 py-2 w-full rounded-xl bg-gray-50 outline-blue-400"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                {/* STATUS DROPDOWN */}
                <select
                    className="border px-4 py-2 rounded-xl bg-gray-50 outline-blue-400"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                {/* GET DATA BUTTON */}
                <button
                    onClick={applyFilters}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
                >
                    Get Data
                </button>

                {/* RESET BUTTON */}
                <button
                    onClick={() => {
                        setSearchText("");
                        setSelectedStatus("All");
                        fetchExpenses();
                    }}
                    className="bg-gray-700 text-white px-5 py-2 rounded-xl hover:bg-gray-800"
                >
                    Reset
                </button>
            </div>

            {/* TABLE GROUPED BY USER */}
            {Object.keys(grouped).length > 0 ? (
                Object.keys(grouped).map((name) => (
                    <div key={name} className="bg-white p-6 rounded-2xl shadow-lg mb-6">

                        <h2 className="text-xl font-bold text-blue-500 mb-4">
                            {name}
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border text-left rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 border">Type</th>
                                        <th className="p-3 border">Amount</th>
                                        <th className="p-3 border">Details</th>
                                        <th className="p-3 border">Status</th>
                                        <th className="p-3 border text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {grouped[name].map((exp) => (
                                        <tr
                                            key={exp.expenseId}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="p-3 border">{exp.expenseMasterName}</td>
                                            <td className="p-3 border font-semibold">₹{exp.amount}</td>
                                            <td className="p-3 border">{exp.description}</td>

                                            <td className="p-3 border">
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium 
                                                        ${exp.status === "Approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : exp.status === "Rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {exp.status}
                                                </span>
                                            </td>

                                            <td className="p-3 border text-center">
                                                {exp.status.toLowerCase() === "pending" ? (
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => handleEdit(exp)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(exp.expenseId)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 size={20} />
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

                    </div>
                ))
            ) : loading ? (
                <p className="text-center mt-10 text-gray-500 text-lg">Loading expenses...</p>
            ) : (
                <p className="text-center mt-10 text-gray-500 text-lg">No expenses found.</p>
            )}

            {/* EDIT POPUP */}
            {editingExpense && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">

                        <button
                            onClick={() => setEditingExpense(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={22} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
                            Edit Expense
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-2">Amount</label>
                                <input
                                    type="number"
                                    value={updatedData.amount}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, amount: e.target.value })
                                    }
                                    className="w-full border px-4 py-2 rounded-xl bg-gray-50 outline-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">Details</label>
                                <textarea
                                    value={updatedData.description}
                                    onChange={(e) =>
                                        setUpdatedData({
                                            ...updatedData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows="3"
                                    className="w-full border px-4 py-2 rounded-xl bg-gray-50 outline-blue-400"
                                />
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ExpenseForm;
