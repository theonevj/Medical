import React, { useEffect, useState } from "react";
import api from "../api";

const ProductMaster = () => {
    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(false);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
        productCategory: "",
        therapeuticClass: "",
        productType: "",
        dosageForm: "",
        scheduleType: "",
    });

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setLoader(true);
            const res = await api.get("/Product");
            setProducts(res.data.data || []);
        } catch {
            // toast.error("Failed to fetch products");
        } finally {
            setLoader(false);
        }
    };

    const filteredProducts = products.filter((p) => {
        return (
            p.productName?.toLowerCase().includes(search.toLowerCase()) &&
            (!filters.productCategory || p.productCategory === filters.productCategory) &&
            (!filters.therapeuticClass || p.therapeuticClass === filters.therapeuticClass) &&
            (!filters.productType || p.productType === filters.productType) &&
            (!filters.dosageForm || p.dosageForm === filters.dosageForm) &&
            (!filters.scheduleType || p.scheduleType === filters.scheduleType)
        );
    });

    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filteredProducts?.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filteredProducts?.length / rowsPerPage);

    const handleRefresh = () => {
        setSearch("");
        setFilters({
            productCategory: "",
            therapeuticClass: "",
            productType: "",
            dosageForm: "",
            scheduleType: "",
        });
        setCurrentPage(1);
        getProducts();
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="p-5 bg-gray-100 min-h-screen font-[Poppins]">
            <div className="bg-white rounded-xl p-5 shadow-sm">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Product Master
                    </h2>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="px-3 py-2 border rounded-lg text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-200 text-gray-800 px-4 rounded-lg"
                        >
                            Refresh
                        </button>

                        {/* <button className="bg-indigo-500 text-white px-4 rounded-lg">
                            Upload File
                        </button>
                        <button className="bg-green-500 text-white px-4 rounded-lg">
                            Download File
                        </button> */}
                    </div>
                </div>

                {/* FILTERS */}
                <div className="grid grid-cols-5 gap-3 mb-4 text-sm">
                    {[
                        { key: "productCategory", label: "Category", options: ["Tablet", "Syrup", "Injection", "Ointment"] },
                        { key: "therapeuticClass", label: "Therapeutic", options: ["Cardiac", "Diabetic", "Antibiotic"] },
                        { key: "productType", label: "Type", options: ["Ethical", "OTC", "Generic"] },
                        { key: "dosageForm", label: "Dosage", options: ["Tablet", "Capsule"] },
                        { key: "scheduleType", label: "Schedule", options: ["H", "H1", "X"] },
                    ].map(({ key, label, options }) => (
                        <select
                            key={key}
                            className="border rounded-lg px-2 py-2"
                            value={filters[key]}
                            onChange={(e) =>
                                setFilters({ ...filters, [key]: e.target.value })
                            }
                        >
                            <option value="">{label}</option>
                            {options?.map((o) => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    ))}
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-50 text-gray-700">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Product Name</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Therapeutic</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Dosage</th>
                                <th className="p-3 text-left">Schedule</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loader ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-6">
                                        Loading...
                                    </td>
                                </tr>
                            ) : paginated?.length > 0 ? (
                                paginated?.map((p) => (
                                    <tr key={p.prodId} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{p.prodId}</td>
                                        <td className="p-3 font-medium">{p.productName || "-"}</td>
                                        <td className="p-3">{p.productCategory || "-"}</td>
                                        <td className="p-3">{p.therapeuticClass || "-"}</td>
                                        <td className="p-3">{p.productType || "-"}</td>
                                        <td className="p-3">{p.dosageForm || "-"}</td>
                                        <td className="p-3">{p.scheduleType || "-"}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${p.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {p.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center p-6">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-end items-center gap-4 mt-4 text-sm">
                    <span>Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1"
                    >
                        {[5, 10, 20].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        ‹
                    </button>

                    <span>{currentPage} / {totalPages || 1}</span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        ›
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductMaster;
