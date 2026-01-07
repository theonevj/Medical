import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AreaMaster = () => {
    const [areas, setAreas] = useState([]);
    const [hqList, setHqList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loader, setLoader] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        areaId: null,
        areaName: "",
        hqId: "",
        inOut: 1,
    });
    const navigate = useNavigate()

    const getAreas = async () => {
        try {
            setLoader(true)
            const res = await api.get("/areas");
            setAreas(res.data || []);
        } catch (err) {
            console.error("Area API Error", err);
        }
        finally {
            setLoader(false)
        }
    };

    const getHQ = async () => {
        try {
            setLoader(true)
            const res = await api.get("/headquarters");
            setHqList(res.data || []);
        } catch (err) {
            console.error("HQ API Error", err);
        }
        finally {
            setLoader(false)
        }
    };

    useEffect(() => {
        getAreas();
        getHQ();
    }, []);

    const getHQName = (id) => {
        return hqList.find((h) => h.hqid === id)?.hqName || "";
    };

    const filteredData = areas.filter((a) => {
        const text = searchText.toLowerCase();
        return (
            a.areaName?.toLowerCase().includes(text) ||
            getHQName(a.hqId).toLowerCase().includes(text)
        );
    });

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleDelete = async (areaId) => {
        console.log("areaId", areaId)
        if (window.confirm("Are you sure you want to delete this area?")) {
            try {
                setLoader(true);
                await api.delete(`/areas/${areaId}`);
                getAreas();
            } catch (err) {
                console.error("Delete Error", err);
            } finally {
                setLoader(false);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            setLoader(true);

            const payload = {
                areaName: editForm?.areaName,
                hqId: Number(editForm.hqId),
                inOut: Number(editForm.inOut),
            };
            console.log("payload", payload)
            await api.post(`/areas/Update`, payload);
            setIsEditOpen(false);
            getAreas();
        } catch (err) {
            console.error("Update Error", err);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="p-6 space-y-4">

            <div className="bg-white p-4 rounded shadow flex justify-between items-center">
                <h1 className="text-xl font-semibold">Area Master</h1>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search Area / Head Quarter"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border px-3 py-2 rounded text-sm w-72"
                    />
                    <button
                        onClick={() => navigate("/admin/AreaMaster/AddAreaMaster")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                        + Area Master
                    </button>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-sm">
                        <tr>
                            <th className="border p-2">Area Name</th>
                            <th className="border p-2 text-center">Within City</th>
                            <th className="border p-2">Head Quarter</th>
                            <th className="border p-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {paginatedData.map((a) => (
                            <tr key={a.areaId} className="hover:bg-gray-50">
                                <td className="border p-2">{a.areaName}</td>
                                <td className="border p-2 text-center">
                                    {a.inOut === 1 ? "Yes" : "No"}
                                </td>
                                <td className="border p-2">
                                    {getHQName(a.hqId)}
                                </td>
                                <td className="border p-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditForm({
                                                areaId: a.areaId,
                                                areaName: a.areaName,
                                                hqId: a.hqId,
                                                inOut: a.inOut,
                                                isActive: a.isActive ?? true,
                                            });
                                            setIsEditOpen(true);
                                        }}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(a.areaId)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center p-4 text-gray-500">
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredData?.length > 0 && (
                <div className="flex justify-end items-center gap-5 bg-white p-3 rounded shadow text-sm">

                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border px-2 py-1 rounded"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <span>
                        {(currentPage - 1) * pageSize + 1}–
                        {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                        {filteredData.length}
                    </span>

                    <div className="flex gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            ❮
                        </button>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            ❯
                        </button>
                    </div>
                </div>
            )}
            {loader && (
                <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] rounded shadow p-6 space-y-4">

                        <h2 className="text-lg font-semibold">Edit Area</h2>

                        {/* HQ */}
                        <div>
                            <label className="block text-sm font-medium">Head Quarter</label>
                            <select
                                value={editForm.hqId}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, hqId: e.target.value })
                                }
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Select HQ</option>
                                {hqList.map((hq) => (
                                    <option key={hq.hqid} value={hq.hqid}>
                                        {hq.hqName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Area Name */}
                        <div>
                            <label className="block text-sm font-medium">Area Name</label>
                            <input
                                type="text"
                                value={editForm.areaName}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, areaName: e.target.value })
                                }
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* In / Out */}
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={editForm.inOut === 1}
                                    onChange={() =>
                                        setEditForm({ ...editForm, inOut: 1 })
                                    }
                                />
                                In
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={editForm.inOut === 2}
                                    onChange={() =>
                                        setEditForm({ ...editForm, inOut: 2 })
                                    }
                                />
                                Out
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreaMaster;
