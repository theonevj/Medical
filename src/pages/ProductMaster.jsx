import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        background: "#f3f4f6",
    },
    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    heading: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#1f2937",
    },
    searchInput: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        outline: "none",
    },
    addButton: {
        background: "#1d4ed8",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "12px",
        textAlign: "left",
        background: "#d4dff1ff",
        color: "#000",
        fontWeight: "600",
        fontSize: "13px",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px",
        color: "#374151",
    },
    actionButton: {
        padding: "6px 12px",
        marginRight: "6px",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        color: "#fff",
    },
    pagination: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "10px",
    },
    pageButton: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        cursor: "pointer",
    },
};

const ProductMaster = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            setLoader(true)
            const response = await api.get("/Product");
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        }
        finally {
            setLoader(false)
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.productName.toLowerCase().includes(search.toLowerCase()) ||
            (p.prodId + "").includes(search) ||
            (p.isActive ? "active" : "inactive").includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <span style={styles.heading}>Product Master</span>
                    <div style={{ display: "flex" }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Product Name</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loader ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentData?.length > 0 ? (
                                currentData?.map((p) => (
                                    <tr key={p.prodId}>
                                        <td style={styles.td}>{p.prodId}</td>
                                        <td style={styles.td}>{p.productName}</td>
                                        <td style={styles.td}>{p.isActive ? "Active" : "Inactive"}</td>
                                        <td style={styles.td}>
                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    backgroundColor: "#f59e0b",
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    backgroundColor: "#ef4444",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {currentData.length > 0 &&
                    <div style={styles.pagination}>
                        <span>Rows per page: </span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[5, 10, 15, 20].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>

                        <button
                            style={styles.pageButton}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Prev
                        </button>
                        <span>
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            style={styles.pageButton}
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                }
            </div>

        </div>
    );
};

export default ProductMaster;
