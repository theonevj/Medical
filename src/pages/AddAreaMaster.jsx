import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import axios from "axios";

const AddAreaMaster = () => {
    const navigate = useNavigate();

    const [hqList, setHqList] = useState([]);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        hqId: "",
        areaName: "",
        inOut: 1,     // Default In
        isActive: 1,  // Default checked
    });

    const getHQ = async () => {
        try {
            const res = await api.get("/Headquarters");
            setHqList(res.data);
        } catch (err) {
            toast.error("Failed to load Headquarters");
        }
    };

    useEffect(() => {
        getHQ();
    }, []);

    /* ================= Text Only ================= */
    const handleAreaNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
        setForm({ ...form, areaName: value });
        setErrors({ ...errors, areaName: "" });
    };

    /* ================= Validation ================= */
    const validate = () => {
        let temp = {};

        if (!form.hqId) temp.hqId = "Head Quarter is required";
        if (!form.areaName.trim()) temp.areaName = "Area Name is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    /* ================= Submit ================= */
    console.log("form", form)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload = {
                hqId: Number(form.hqId),
                areaName: form.areaName,
                inOut: form.inOut,
                isActive: form.isActive
            };

            const res = await api.post("/areas", payload);
            console.log("API RESPONSE 👉", res);
            toast.success("Area added successfully");
            navigate("/admin/AreaMaster");

        } catch (err) {
            console.error("API ERROR 👉", err);
            toast.error(
                err?.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow space-y-5"
            >

                {/* Head Quarter */}
                <div>
                    <label className="block font-medium mb-1">
                        Head Quarter <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="border rounded w-full p-2"
                        value={form.hqId}
                        onChange={(e) =>
                            setForm({ ...form, hqId: e.target.value })
                        }
                    >
                        <option value="">Select HeadQuarter</option>
                        {hqList.map((hq) => (
                            <option key={hq.hqid} value={hq.hqid}>
                                {hq.hqName}
                            </option>
                        ))}
                    </select>
                    {errors.hqId && (
                        <p className="text-red-500 text-sm">{errors.hqId}</p>
                    )}
                </div>

                {/* Area Name */}
                <div>
                    <label className="block font-medium mb-1">
                        Area Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.areaName}
                        onChange={handleAreaNameChange}
                        className="border rounded w-full p-2"
                        placeholder="Enter Area Name"
                    />
                    {errors.areaName && (
                        <p className="text-red-500 text-sm">{errors.areaName}</p>
                    )}
                </div>

                {/* Within City */}
                <div>
                    <label className="block font-medium mb-1">Within City</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={form.inOut === 1}
                                onChange={() => setForm({ ...form, inOut: 1 })}
                            />
                            In
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={form.inOut === 2}
                                onChange={() => setForm({ ...form, inOut: 2 })}
                            />
                            Out
                        </label>
                    </div>
                </div>

                {/* Is Active */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.isActive === 1}
                            onChange={(e) =>
                                setForm({ ...form, isActive: e.target.checked ? 1 : 0 })
                            }
                        />
                        Is Active
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded"
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/AreaMaster")}
                        className="border px-6 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAreaMaster;
