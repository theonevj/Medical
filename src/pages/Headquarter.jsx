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
        padding: "30px",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
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
        background: "#e2e5ebff",
        color: "black",
        textTransform: "uppercase",
        fontSize: "13px",
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

// ------------------------- SAME LOGIC BELOW -----------------------------

const Headquarter = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingHQ, setEditingHQ] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

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

    if (loading) return <div style={styles.container}>Loading Headquarters...</div>;
    if (error) return <div style={styles.container}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <EditModal />
            <AddModal />

            <div style={styles.contentWrapper}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h1 style={{ ...styles.heading, borderBottom: "none", marginBottom: 0 }}>
                        Headquarter Management
                    </h1>

                    <button
                        style={styles.addButton}
                        onClick={() => setIsAdding(true)}
                        disabled={!!editingHQ || isAdding}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        + Add New Headquarter
                    </button>
                </div>


                <table style={styles.table}>
                    <thead>
                        <tr>
                            {/* <th style={styles.th}>ID</th> */}
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>City/Location</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {headquarters?.slice(0).reverse().map((hq) => (
                            <tr
                                key={hq.hqid}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#fff")
                                }
                            >
                                {/* <td style={styles.td}>{hq.hqid}</td> */}
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Headquarter;
