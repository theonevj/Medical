// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { toast } from "react-toastify";

// const styles = {
//     container: {
//         padding: "20px",
//         fontFamily: "'Poppins', sans-serif",
//         minHeight: "100vh",
//         background: "#f3f4f6",
//     },
//     card: {
//         background: "#fff",
//         borderRadius: "12px",
//         padding: "20px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px",
//     },
//     heading: {
//         fontSize: "20px",
//         fontWeight: "600",
//         color: "#1f2937",
//     },
//     searchInput: {
//         padding: "8px 12px",
//         borderRadius: "8px",
//         border: "1px solid #d1d5db",
//         outline: "none",
//     },
//     addButton: {
//         background: "#1d4ed8",
//         color: "#fff",
//         padding: "8px 16px",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontWeight: "600",
//     },
//     tableWrapper: {
//         overflowX: "auto",
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//     },
//     th: {
//         padding: "12px",
//         textAlign: "left",
//         background: "#d4dff1ff",
//         color: "#000",
//         fontWeight: "600",
//         fontSize: "13px",
//     },
//     td: {
//         padding: "12px",
//         borderBottom: "1px solid #e5e7eb",
//         fontSize: "14px",
//         color: "#374151",
//     },
//     actionButton: {
//         padding: "6px 12px",
//         marginRight: "6px",
//         borderRadius: "6px",
//         fontWeight: "600",
//         cursor: "pointer",
//         color: "#fff",
//     },
//     pagination: {
//         marginTop: "15px",
//         display: "flex",
//         justifyContent: "flex-end",
//         alignItems: "center",
//         gap: "10px",
//     },
//     pageButton: {
//         padding: "6px 12px",
//         borderRadius: "6px",
//         border: "1px solid #d1d5db",
//         cursor: "pointer",
//     },
// };

// const ProductMaster = () => {
//     const [products, setProducts] = useState([]);
//     const [search, setSearch] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [loader, setLoader] = useState(false);

//     console.log("Products:", products);

//     useEffect(() => {
//         getProducts();
//     }, []);

//     const getProducts = async () => {
//         try {
//             setLoader(true)
//             const response = await api.get("/Product");
//             setProducts(response.data.data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//             toast.error("Failed to fetch products");
//         }
//         finally {
//             setLoader(false)
//         }
//     };

//     const filteredProducts = products.filter(
//         (p) =>
//             p.productName.toLowerCase().includes(search.toLowerCase()) ||
//             (p.prodId + "").includes(search) ||
//             (p.isActive ? "active" : "inactive").includes(search.toLowerCase())
//     );

//     const indexOfLast = currentPage * rowsPerPage;
//     const indexOfFirst = indexOfLast - rowsPerPage;
//     const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

//     return (
//         <div style={styles.container}>
//             <div style={styles.card}>
//                 <div style={styles.header}>
//                     <span style={styles.heading}>Product Master</span>
//                     <div style={{ display: "flex" }}>
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             style={styles.searchInput}
//                         />
//                     </div>
//                 </div>

//                 <div style={styles.tableWrapper}>
//                     <table style={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th style={styles.th}>ID</th>
//                                 <th style={styles.th}>Product Name</th>
//                                 <th style={styles.th}>Status</th>
//                                 <th style={styles.th}>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>

//                             {loader ? (
//                                 <tr>
//                                     <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : currentData?.length > 0 ? (
//                                 currentData?.map((p) => (
//                                     <tr key={p.prodId}>
//                                         <td style={styles.td}>{p.prodId}</td>
//                                         <td style={styles.td}>{p.productName}</td>
//                                         <td style={styles.td}>{p.isActive ? "Active" : "Inactive"}</td>
//                                         <td style={styles.td}>
//                                             <button
//                                                 style={{
//                                                     ...styles.actionButton,
//                                                     backgroundColor: "#f59e0b",
//                                                 }}
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 style={{
//                                                     ...styles.actionButton,
//                                                     backgroundColor: "#ef4444",
//                                                 }}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
//                                         No products found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {currentData.length > 0 &&
//                     <div style={styles.pagination}>
//                         <span>Rows per page: </span>
//                         <select
//                             value={rowsPerPage}
//                             onChange={(e) => {
//                                 setRowsPerPage(Number(e.target.value));
//                                 setCurrentPage(1);
//                             }}
//                         >
//                             {[5, 10, 15, 20].map((n) => (
//                                 <option key={n} value={n}>
//                                     {n}
//                                 </option>
//                             ))}
//                         </select>

//                         <button
//                             style={styles.pageButton}
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage((prev) => prev - 1)}
//                         >
//                             Prev
//                         </button>
//                         <span>
//                             {currentPage} of {totalPages}
//                         </span>
//                         <button
//                             style={styles.pageButton}
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage((prev) => prev + 1)}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 }
//             </div>

//         </div>
//     );
// };

// export default ProductMaster;


import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

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
    const paginated = filteredProducts.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

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
                            {options.map((o) => (
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
                            ) : paginated.length > 0 ? (
                                paginated.map((p) => (
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
