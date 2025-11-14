import React, { useEffect, useState } from "react";
import api from "../api";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

const GetExpense = () => {
    const [expenseList, setExpenseList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoader(true);
            const res = await api.get("/UserExpense");
            setExpenseList(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load expenses.");
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

    return (
        <div className="min-h-screen bg-[#f4f5f7] p-4">

            <div className="bg-white border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm mb-4">
                <h1 className="text-3xl font-semibold tracking-wide">Expense Records</h1>
                <p className="text-gray-500 text-sm mt-1">
                    View all your submitted expenses in one place
                </p>
            </div>

            <div className="hidden md:block bg-white p-4 rounded-2xl shadow-md border border-gray-200 overflow-x-auto ">
                <table className="min-w-full border-collapse text-sm ">
                    <thead>
                        <tr className="bg-[#f9f9f9] text-gray-600 border-b">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenseList?.map((exp) => (
                            <tr
                                key={exp.expenseId}
                                className="border-b hover:bg-[#f6f6f6] transition-all "
                            >
                                <td className="p-3">{exp.expenseId}</td>
                                <td className="p-3 font-medium text-gray-700">
                                    {exp.expenseMasterName}
                                </td>
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden mt-6 space-y-4">
                {expenseList?.map((exp) => (
                    <div
                        key={exp.expenseId}
                        className="bg-white px-4 py-4 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-gray-800">
                                {exp.expenseMasterName}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(
                                    exp.status
                                )}`}
                            >
                                {exp.status}
                            </span>
                        </div>

                        <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Amount:</span> ₹{exp.amount}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(exp.expenseDate).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            {exp.description || "No description"}
                        </p>

                        {exp.status === "Pending" && (
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => handleStatusChange(exp.expenseId, "Approved")}
                                    className="flex-1 py-2 bg-green-400 text-white text-sm rounded-lg shadow"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleStatusChange(exp.expenseId, "Rejected")}
                                    className="flex-1 py-2 bg-red-400 text-white text-sm rounded-lg shadow"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Loader */}
            {loader && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );

};

export default GetExpense;
