import React, { useEffect, useState } from "react";
import api from "../api";
import { LoaderCircle } from "lucide-react";

const ErrorLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchErrorLogs();
    }, []);

    const fetchErrorLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/ErrorLogs`);
            console.log("Fetched Logs:", response.data);
            setLogs(response.data);
        } catch (err) {
            console.error("Error:", err);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Error Logs</h2>

            <div style={{ marginTop: "20px" }}>
                {logs?.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #aaa",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                        }}
                    >
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Message:</strong> {item.message}</p>
                        <p><strong>Path:</strong> {item.path}</p>
                        <p><strong>Method:</strong> {item.method}</p>
                    </div>
                ))}
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );
};

export default ErrorLogs;
