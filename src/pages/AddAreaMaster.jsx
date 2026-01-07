import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { toast } from "react-toastify";

const AddAreaMaster = () => {
    const [hqList, setHqList] = useState([]);

    const [form, setForm] = useState({
        hqId: "",
        areaName: "",
        inOut: 1,
        isActive: 1,
    });


    const getHQ = async () => {
        try {
            const response = await api.get('/Headquarters')
            console.log("response.data-=-=-=-", response.data)
            setHqList(response.data)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message || 'Something went wrong.')
        }
    };

    useEffect(() => {
        getHQ();
    }, []);

    // 🔹 Only text allowed
    const handleAreaNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
        setForm({ ...form, areaName: value });
    };

    // 🔹 Submit (API not provided → console only)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.hqId || !form.areaName) {
            alert("HeadQuarter & Area Name are required");
            return;
        }

        const payload = {
            areaName: form.areaName,
            hqId: Number(form.hqId),
            inOut: Number(form.inOut),
            isActive: Number(form.isActive),
        };

        console.log("SUBMIT PAYLOAD 👉", payload);
        // axios.post("API_URL", payload)
    };

    // 🔹 HQ name resolver
    const getHQName = (id) => {
        return hqList.find((h) => h.hqId === id)?.hqName || "-";
    };

    return (
        <div className="p-6 space-y-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded shadow space-y-4"
            >
                {/* Head Quarter */}
                <div>
                    <label className="block font-medium">Head Quarter *</label>
                    <select
                        className="border p-2 rounded w-full"
                        value={form.hqId}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                hqId: e.target.value ? Number(e.target.value) : "",
                            })
                        }
                    >
                        <option value="">Select HeadQuarter</option>

                        {hqList.map((hq) => (
                            <option key={hq.hqid} value={hq.hqid}>
                                {hq.hqName}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Area Name */}
                <div>
                    <label className="block font-medium">Area Name *</label>
                    <input
                        type="text"
                        value={form.areaName}
                        onChange={handleAreaNameChange}
                        className="border p-2 rounded w-full"
                        placeholder="Enter Area Name"
                    />
                </div>

                {/* Within City */}
                <div>
                    <label className="block font-medium">Within City</label>
                    <div className="flex gap-6 mt-1">
                        <label>
                            <input
                                type="radio"
                                checked={form.inOut === 1}
                                onChange={() => setForm({ ...form, inOut: 1 })}
                            />{" "}
                            In
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={form.inOut === 2}
                                onChange={() => setForm({ ...form, inOut: 2 })}
                            />{" "}
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

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                </button>
            </form>
        </div>
    );
};

export default AddAreaMaster;
