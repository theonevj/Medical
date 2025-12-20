import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const styles = {
    container: {
        padding: "40px 20px",
        fontFamily: "'Poppins', sans-serif",
        maxWidth: "100%",
        margin: "0",
        background: "linear-gradient(135deg, #ffffffff, #ffffff)",
        minHeight: "100vh",
    },
    contentWrapper: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2px",
        // background: "rgba(255, 255, 255, 0.9)",
        // borderRadius: "20px",
        // boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(6px)",
    },
    heading: {
        color: "#7e92c9ff",
        borderBottom: "3px solid #3b82f6",
        paddingBottom: "10px",
        marginBottom: "25px",
        fontWeight: "700",
        fontSize: "28px",
        textAlign: "center",
        letterSpacing: "0.5px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    },
    th: {
        padding: "14px",
        textAlign: "left",
        background: "#dfe7f3ff",
        color: "black",
        textTransform: "uppercase",
        fontSize: "12px",
        letterSpacing: "0.7px",
    },
    td: {
        padding: "12px 14px",
        borderBottom: "1px solid #e5e7eb",
        color: "#374151",
        backgroundColor: "#fff",
        transition: "background-color 0.3s ease",
    },
    trHover: {
        backgroundColor: "#f9fafb",
    },
    actionButton: {
        padding: "8px 12px",
        marginRight: "8px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    addButton: {
        background: "linear-gradient(90deg, #10b981, #059669)",
        color: "white",
        padding: "12px 22px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        marginBottom: "20px",
        fontSize: "16px",
        fontWeight: "600",
        boxShadow: "0 4px 10px rgba(16,185,129,0.4)",
        transition: "transform 0.2s, box-shadow 0.3s",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "16px",
        width: "420px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        animation: "fadeIn 0.3s ease-out",
    },
    formInput: {
        padding: "10px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: "18px",
        fontSize: "15px",
        outline: "none",
        transition: "border-color 0.2s",
    },
    formLabel: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "600",
        color: "#1f2937",
        fontSize: "15px",
    },
};

const Headquarter = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingHQ, setEditingHQ] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/Headquarters");
            setHeadquarters(response.data);
        } catch (err) {
            setError("Failed to load headquarters data.");
        } finally {
            setLoading(false);
        }
    };

    const deleteHeadquarter = async (id) => {
        if (!window.confirm("Are you sure you want to delete this headquarter?")) return;
        try {
            await api.delete(`/Headquarters/${id}`);
            setHeadquarters(headquarters.filter((hq) => hq.hqid !== id));
            toast.success("Headquarter deleted successfully!");
            fetchData();
        } catch (err) {
            console.error("Error deleting headquarter:", err);
            toast.error("Failed to delete headquarter.");
        }
    };

    const updateHeadquarter = async (updatedHQ) => {
        const id = updatedHQ?.hqid;
        try {
            const response = await api.put(`/Headquarters/${id}`, updatedHQ);
            setHeadquarters(
                headquarters.map((hq) => (hq.hqid === id ? response.data : hq))
            );
            setEditingHQ(null);
            toast.success("Headquarter updated successfully!");
            fetchData();
        } catch (err) {
            console.error("Error updating headquarter:", err);
            toast.error("Failed to update headquarter.");
        }
    };

    const addHeadquarter = async (newHQ) => {
        try {
            const response = await api.post("/Headquarters", newHQ);
            setHeadquarters([...headquarters, response.data]);
            setIsAdding(false);
            toast.success("Headquarter added successfully!");
            fetchData();
        } catch (err) {
            console.error("Error adding headquarter:", err);
            toast.error("Failed to add headquarter.");
        }
    };

    const handleEdit = (hq) => {
        setEditingHQ(hq);
    };

    const AddModal = () => {
        const [formData, setFormData] = useState({
            hqName: "",
            location: "",
            contactNumber: "",
            isActive: 0,
            hqid: 0,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.hqName || !formData.location) {
                toast.error("Please fill in all fields.");
                return;
            }
            addHeadquarter(formData);
        };

        if (!isAdding) return null;

        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <h2 style={{ color: "#059669", marginTop: 0, textAlign: "center" }}>
                        Add New Headquarter
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <label style={styles.formLabel}>Name</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="hqName"
                            value={formData.hqName}
                            onChange={handleChange}
                            required
                        />
                        <label style={styles.formLabel}>Location</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "10px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#9ca3af",
                                    color: "white",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    ...styles.actionButton,
                                    background: "linear-gradient(90deg, #10b981, #059669)",
                                    color: "white",
                                }}
                            >
                                Add Headquarter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const EditModal = () => {
        const [formData, setFormData] = useState(editingHQ);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.hqName || !formData.location) {
                alert("Please fill in all fields.");
                return;
            }
            updateHeadquarter(formData);
        };

        if (!editingHQ) return null;

        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <h2 style={{ color: "#f59e0b", marginTop: 0, textAlign: "center" }}>
                        Edit Headquarter
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <label style={styles.formLabel}>Name</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="hqName"
                            value={formData.hqName}
                            onChange={handleChange}
                            required
                        />
                        <label style={styles.formLabel}>Location</label>
                        <input
                            style={styles.formInput}
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "10px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setEditingHQ(null)}
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#9ca3af",
                                    color: "white",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    ...styles.actionButton,
                                    background: "linear-gradient(90deg, #22c55e, #16a34a)",
                                    color: "white",
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const filteredHeadquarters = headquarters.filter((hq) =>
        hq.hqName?.toLowerCase().includes(search.toLowerCase()) ||
        hq.location?.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const paginatedHQ = filteredHeadquarters.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredHeadquarters.length / rowsPerPage);

    if (loading) return <div style={styles.container}>Loading Headquarters...</div>;
    if (error) return <div style={styles.container}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <EditModal />
            <AddModal />

            <div style={styles.contentWrapper}>

                <div className="bg-white rounded-md shadow px-4 py-3 flex justify-between items-center">
                    <h1 className="text-gray-600 font-medium text-lg">
                        Headquarter Management
                    </h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search headquarter..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border px-3 py-1.5 rounded-md text-sm w-64"
                        />

                        <button
                            onClick={() => setIsAdding(true)}
                            disabled={!!editingHQ || isAdding}
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-1.5 rounded-md"
                        >
                            + Add Headquarter
                        </button>
                    </div>
                </div>


                <div className="bg-white rounded-md shadow p-4 mt-3">
                    <table className="w-full   border-collapse">
                        <thead className="bg-blue-50 text-gray-700">
                            <tr >
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>City/Location</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHQ && paginatedHQ.length > 0 ? (
                                paginatedHQ.slice(0).reverse().map((hq) => (
                                    <tr
                                        key={hq.hqid}
                                        onMouseOver={(e) =>
                                            (e.currentTarget.style.backgroundColor = "#f3f4f6")
                                        }
                                        onMouseOut={(e) =>
                                            (e.currentTarget.style.backgroundColor = "#fff")
                                        }
                                    >
                                        <td style={styles.td}>{hq.hqName}</td>
                                        <td style={styles.td}>{hq.location}</td>
                                        <td style={styles.td}>
                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    backgroundColor: "#f59e0b",
                                                    color: "white",
                                                }}
                                                onClick={() => handleEdit(hq)}
                                                disabled={!!editingHQ || isAdding}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    backgroundColor: "#ef4444",
                                                    color: "white",
                                                }}
                                                onClick={() => deleteHeadquarter(hq.hqid)}
                                                disabled={!!editingHQ || isAdding}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        style={{
                                            textAlign: "center",
                                            padding: "20px",
                                            color: "#6b7280",
                                            fontWeight: "500",
                                        }}
                                    >
                                        No headquarters found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                paginatedHQ?.length > 0 && (
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
                            className="px-2"
                        >
                            ‹
                        </button>

                        <span>
                            {currentPage} / {totalPages || 1}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-2"
                        >
                            ›
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default Headquarter;
