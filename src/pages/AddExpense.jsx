import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useSelector } from "react-redux";

const AddExpense = () => {
    const [expenseType, setExpenseType] = useState("");
    const [amount, setAmount] = useState("");
    const [details, setDetails] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [proof, setProof] = useState(null);

    const { user } = useSelector((state) => state.auth);

    const handleExpenseChange = (e) => {
        const selectedId = e.target.value;
        setExpenseType(selectedId);
        const selected = expenseTypes.find(
            (item) => item.expenseId === Number(selectedId)
        );
        setSelectedExpense(selected || null);
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

    // ✅ Save button click
    const handleSave = async () => {
        if (!expenseType || !amount || !details) {
            toast.error("Please fill all fields before saving!");
            return;
        }

        const expenseData = {
            expenseId: 0,
            userId: user?.id,
            expenseMasterId: Number(selectedExpense?.expenseId),
            amount: Number(amount),
            description: details,
            expenseDate: new Date().toISOString(),
            status: "Pending",
            approvalBy: 0,
            approvalDateTime: new Date().toISOString(),
            createdBy: user?.id || 0,
            updatedBy: user?.id || 0,
            isActive: true,
            expenseMasterName: selectedExpense?.name || "",
        };

        setIsSaving(true);
        try {
            const response = await api.post("/UserExpense", expenseData);
            toast.success("Expense saved successfully!");
            console.log("Expense saved:", response.data);

            // update local list
            setExpenses((prev) => [...prev, expenseData]);
            setIsSaved(true); // ✅ show Add button now

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong while saving expense.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = () => {
        toast.success("Expense added successfully!");
        setExpenseType("");
        setAmount("");
        setDetails("");
        setIsSaved(false);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 p-4">
            <div className="mx-auto rounded-3xl transition-all duration-500">
                <div className="p-6 rounded-xl">
                    <h1 className="text-3xl font-bold mb-2 text-blue-500">
                        Add Your Expense
                    </h1>
                    <p className="text-sm opacity-90 text-black">
                        Keep track of your business & personal spending effortlessly
                    </p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">
                                Expense Type
                            </label>
                            <select
                                value={expenseType}
                                onChange={handleExpenseChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            >
                                <option value="" disabled>
                                    -- Select Expense Type --
                                </option>
                                {expenseTypes?.map((item) => (
                                    <option key={item.expenseId} value={item.expenseId}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">
                                Expense Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Details
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Write short description..."
                            rows="3"
                        />
                    </div>

                    {expenses?.length > 0 && (
                        <div className="overflow-x-auto mt-6">
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">
                                Saved Expenses
                            </h3>
                            <table className="w-full text-left border border-gray-300 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-indigo-100 text-gray-800">
                                        <th className="p-3 border">Type</th>
                                        <th className="p-3 border">Amount</th>
                                        <th className="p-3 border">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-3 border">{exp.expenseMasterName}</td>
                                            <td className="p-3 border">₹{exp.amount}</td>
                                            <td className="p-3 border">{exp.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}



                    <div className="flex flex-col sm:flex-row justify-end gap-6 mt-10">
                        {!isSaved && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`px-20 py-3 rounded-xl shadow-lg font-semibold text-lg transition transform 
                                    hover:scale-105 text-white ${isSaving
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600"
                                    }`}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        )}

                        {isSaved && (
                            <button
                                onClick={handleAdd}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-16 py-3 rounded-xl shadow-lg transition transform hover:scale-105 font-semibold text-lg"
                            >
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
