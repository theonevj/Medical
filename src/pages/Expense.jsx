import React, { useState } from "react";
import { toast } from "react-toastify";

const ExpenseForm = () => {
    const [expenseType, setExpenseType] = useState("");
    const [amount, setAmount] = useState("");
    const [details, setDetails] = useState("");
    const [proof, setProof] = useState(null);
    const [expenses, setExpenses] = useState([]);

    const handleSave = () => {
        if (!expenseType || !amount || !details) {
            toast.error("Please fill all fields before saving!");
            return;
        }

        const newExpense = {
            expenseType,
            amount,
            details,
            proof: proof ? proof.name : "No File",
        };

        setExpenses([...expenses, newExpense]);
        toast.success("Expense saved successfully!");
    };

    const handleAdd = () => {
        if (!expenseType || !amount || !details || !proof) {
            toast.error("Please fill all fields and upload proof before adding!");
            return;
        }

        console.log("Calling Add API with data:", {
            expenseType,
            amount,
            details,
            proof,
        });

        toast.success("Expense added successfully!");
        setExpenseType("");
        setAmount("");
        setDetails("");
        setProof(null);
        setExpenses([]);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 from-blue-100 via-white to-blue-200 p-2">
            <div className="mx-auto rounded-3xl transition-all duration-500">
                <div className="  p-6 rounded-xl ">
                    <h1 className="text-3xl font-bold mb-2 text-blue-500 "> Add Your Expense</h1>
                    <p className="text-sm opacity-90 text-black ">
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
                                onChange={(e) => setExpenseType(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            >
                                <option value="">Select Type</option>
                                <option value="Travel">🚗 Travel</option>
                                <option value="Food">🍴 Food</option>
                                <option value="Office Supplies">🧾 Office Supplies</option>
                                <option value="Other">📦 Other</option>
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

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Upload Proof
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setProof(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                    </div>

                    {expenses.length > 0 && (
                        <div className="overflow-x-auto">
                            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">
                                Saved Expenses
                            </h3>
                            <table className="w-full text-left border border-gray-300 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="bg-indigo-100 text-gray-800">
                                        <th className="p-3 border">Type</th>
                                        <th className="p-3 border">Amount</th>
                                        <th className="p-3 border">Details</th>
                                        <th className="p-3 border">Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-3 border">{exp.expenseType}</td>
                                            <td className="p-3 border">₹{exp.amount}</td>
                                            <td className="p-3 border">{exp.details}</td>
                                            <td className="p-3 border">{exp.proof}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-6  mt-10">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-600 text-white px-16 py-3 rounded-1xl shadow-lg transition transform hover:scale-105 font-semibold text-lg"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleAdd}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-16 py-3 rounded-1xl shadow-lg transition transform hover:scale-105 font-semibold text-lg"
                        >
                            Add
                        </button>
                    </div>


                </div>
            </div>
        </div >
    );
};

export default ExpenseForm;
