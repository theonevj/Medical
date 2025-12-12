import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
    const [expenseType, setExpenseType] = useState("");
    const [amount, setAmount] = useState("");
    const [details, setDetails] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [proof, setProof] = useState(null);
    const [expenseDate, setExpenseDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastCreatedExpenseId, setLastCreatedExpenseId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

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

    const handleSave = async (id) => {
        if (!proof || proof.length === 0) {
            toast.error("Please upload at least 1 file");
            return;
        }
        try {
            setLoading(true);
            for (let file of proof) {
                const formData = new FormData();
                formData.append("file", file);
                await api.post(`/UserExpense/${id}/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            toast.success("Files Uploaded Successfully");
            setLastCreatedExpenseId(null)
            setProof([]);
        } catch (err) {
            console.error(err);
            toast.error("File Upload Failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleAdd = async () => {
        if (!expenseType || !amount || !details || !expenseDate) {
            toast.error("Please fill all fields before saving!");
            return;
        }
        const expenseData = {
            expenseId: 0,
            userId: user?.id,
            expenseMasterId: Number(selectedExpense?.expenseId),
            amount: Number(amount),
            description: details,
            expenseDate: expenseDate,
            status: "Pending",
            approvalBy: 0,
            approvalDateTime: new Date().toISOString(),
            createdBy: user?.id || 0,
            updatedBy: user?.id || 0,
            isActive: true,
            expenseMasterName: selectedExpense?.name || "",
            userName: user?.name || "",
        };

        try {
            setLoading(true);
            const response = await api.post("/UserExpense", expenseData);
            setLastCreatedExpenseId(response.data.expenseId);
            toast.success("Expense added! Now uploading files...");
            handleSave(response.data.expenseId);
            setExpenses((prev) => [...prev, expenseData]);
            setExpenseType("");
            setAmount("");
            setDetails("");
            setExpenseDate("");

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 p-4">
            <div className="mx-auto rounded-3xl transition-all duration-500">
                <div className="mx-auto rounded-3xl transition-all duration-500">
                    <div className="p-6 rounded-xl flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded bg-indigo-100
                             hover:bg-indigo-200 text-indigo-600"
                        >
                            ←
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-black">Add Your Expense</h1>
                            <p className="text-sm opacity-90 text-black">
                                Keep track of your business & personal spending effortlessly
                            </p>
                        </div>

                    </div>
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
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
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
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (/[^0-9]/.test(val)) return;
                                    if (val.length > 4) return;
                                    if (Number(val) > 1000) return;
                                    setAmount(val);
                                }}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
                                placeholder="Enter amount (max 1000)"
                            />

                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Expense Date
                        </label>
                        <input
                            type="date"
                            value={expenseDate}
                            max={new Date().toISOString().split("T")[0]}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            className="w-[40%] border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
                        />
                    </div>

                    <div className="mb-2 mt-5">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Details
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
                            placeholder="Write short description..."
                            rows="3"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Upload Documents (Images + PDF)
                        </label>

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setProof((prev) => [...(prev || []), ...files]);
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm"
                        />

                        {proof && proof?.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {proof.map((file, index) => {
                                    const isImage = file.type.startsWith("image/");
                                    const isPdf = file.type === "application/pdf";

                                    return (
                                        <div
                                            key={index}
                                            className="relative border rounded-xl bg-white p-3 shadow-md"
                                        >
                                            <button
                                                onClick={() => {
                                                    setProof((prev) =>
                                                        prev.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
                                            >
                                                ×
                                            </button>

                                            {isImage && (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                            )}

                                            {isPdf && (
                                                <div className="flex flex-col items-center justify-center h-40 bg-red-50 rounded-lg border border-red-200">
                                                    <span className="text-red-600 text-4xl">📄</span>
                                                    <p className="text-sm mt-2 text-gray-700 font-medium text-center px-2">
                                                        {file.name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-6 mt-10">
                        <button
                            onClick={handleAdd}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-16 py-3 rounded-xl shadow-lg"
                        >
                            Add Expense
                        </button>
                    </div>

                    {lastCreatedExpenseId && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => handleSave(lastCreatedExpenseId)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl shadow-lg"
                            >
                                Re-upload Files
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );
};

export default AddExpense;
