import React, { useState, useEffect } from "react";
import api from "../api";

const styles = {
    container: {
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    heading: {
        color: '#2c3e50',
        borderBottom: '3px solid #3498db',
        paddingBottom: '10px',
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#3498db',
        color: 'white',
        textTransform: 'uppercase',
        fontSize: '14px'
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left'
    },
    actionButton: {
        padding: '6px 10px',
        marginRight: '5px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
    },
    addButton: {
        backgroundColor: '#2ecc71',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '16px'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.3s ease-out'
    },
    formInput: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '15px'
    },
    formLabel: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#34495e'
    }
};


const Headquarter = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingHQ, setEditingHQ] = useState(null);

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

    const createHeadquarter = async (newHQ) => {
        try {
            const response = await api.post("/Headquarters", newHQ);
            setHeadquarters([...headquarters, response.data]);
            alert("Headquarter created successfully!");
        } catch (err) {
            console.error("Error creating headquarter:", err);
            alert("Failed to create headquarter.");
        }
    };

    const deleteHeadquarter = async (id) => {
        if (!window.confirm("Are you sure you want to delete this headquarter?")) return;
        try {
            await api.delete(`/Headquarters/${id}`);
            setHeadquarters(headquarters.filter(hq => hq.hqid !== id));
            alert("Headquarter deleted successfully!");
            fetchData()
        } catch (err) {
            console.error("Error deleting headquarter:", err);
            alert("Failed to delete headquarter.");
        }
    };

    const updateHeadquarter = async (updatedHQ) => {
        console.log("Updating headquarter with data:", updatedHQ);
        const id = updatedHQ?.hqid;
        try {
            const response = await api.put(`/Headquarters/${id}`, updatedHQ);
            setHeadquarters(headquarters.map(hq =>
                hq.hqid === id ? response.data : hq
            ));
            setEditingHQ(null);
            alert("Headquarter updated successfully!");
            fetchData()
        } catch (err) {
            console.error("Error updating headquarter:", err);
            alert("Failed to update headquarter.");
        }
    };

    const handleEdit = (hq) => {
        setEditingHQ(hq);
    };

    const EditModal = () => {
        const [formData, setFormData] = useState(editingHQ);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            updateHeadquarter(formData);
        };

        if (!editingHQ) return null;

        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <h2 style={{ color: '#f39c12', marginTop: 0 }}>Edit Headquarter</h2>
                    <form onSubmit={handleSubmit}>
                        <label style={styles.formLabel}>
                            Name:
                            <input
                                style={styles.formInput}
                                type="text"
                                name="hqName"
                                value={formData.hqName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label style={styles.formLabel}>
                            Location:
                            <input
                                style={styles.formInput}
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setEditingHQ(null)}
                                style={{ ...styles.actionButton, backgroundColor: '#7f8c8d', color: 'white' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{ ...styles.actionButton, backgroundColor: '#27ae60', color: 'white' }}
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

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>City/Location</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {headquarters?.map((hq) => (
                        <tr key={hq.hqid}>
                            <td style={styles.td}>{hq.hqid}</td>
                            <td style={styles.td}>{hq.hqName}</td>
                            <td style={styles.td}>{hq.location}</td>
                            <td style={styles.td}>
                                <button
                                    style={{ ...styles.actionButton, backgroundColor: '#f39c12', color: 'white' }}
                                    onClick={() => handleEdit(hq)}
                                    disabled={!!editingHQ}
                                >
                                    Edit
                                </button>
                                <button
                                    style={{ ...styles.actionButton, backgroundColor: '#e74c3c', color: 'white' }}
                                    onClick={() => deleteHeadquarter(hq.hqid)}
                                    disabled={!!editingHQ}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Headquarter;