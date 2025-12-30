import React, { useEffect, useState } from "react";
import api from "../api";
import { Search, LoaderCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Tooltip from "@mui/material/Tooltip";

export default function MessageInfo() {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // current page number
    const [itemsPerPage, setItemsPerPage] = useState(10); // rows per page

    // Fetch messages function
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get("/MessageLog");
            const data = res.data || [];

            // Convert employeeName to camelCase if coming differently
            const normalizedData = data.map((msg) => ({
                ...msg,
                employeeName: msg.employeeName || msg.EmployeeName || "",
            }));

            setMessages(normalizedData);
            setFilteredMessages(normalizedData);
            setCurrentPage(1); // reset page on fetch
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Search logic
    useEffect(() => {
        if (!searchTerm) {
            setFilteredMessages(messages);
            setCurrentPage(1);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = messages.filter(
            (msg) =>
                msg.mobileNumber?.includes(term) ||
                msg.msg?.toLowerCase().includes(term) ||
                msg.employeeID?.toString().includes(term) ||
                msg.sentFailed?.toString().includes(term) ||
                msg.employeeName?.toLowerCase().includes(term)
        );

        setFilteredMessages(filtered);
        setCurrentPage(1);
    }, [searchTerm, messages]);

    const totalPages = Math.ceil(filteredMessages?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredMessages?.slice(indexOfFirstItem, indexOfLastItem);

    const exportToExcel = () => {
        if (filteredMessages.length === 0) return;

        const exportData = filteredMessages.map((msg) => ({
            "Emp Name": msg.employeeName,
            Mobile: msg.mobileNumber,
            Message: msg.msg,
            "Sent Date": msg.sentDate
                ? new Date(msg.sentDate).toLocaleString("en-IN")
                : "",
            Status: msg.sentFailed ? "Failed" : "Sent",
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Messages");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "MessageLogs.xlsx");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-800">Message Logs</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg p-2 w-60">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="ml-2 outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={fetchMessages}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                    {currentData?.length > 0 && (
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Export to Excel
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-50 text-gray-700">
                        <tr>
                            {["Emp-Name", "Mobile", "Message", "Sent Date", "Status"].map(
                                (header) => (
                                    <th key={header} className="p-3 border-b font-medium">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {currentData?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center">
                                    No messages found.
                                </td>
                            </tr>
                        ) : (
                            currentData?.map((msg) => (
                                <tr
                                    key={msg.messageLogId}
                                    className="hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <td className="p-3 border-b">{msg.employeeName}</td>
                                    <td className="p-3 border-b">{msg.mobileNumber}</td>
                                    <td className="p-3 border-b">
                                        <Tooltip title={msg.msg.replace(/\*/g, "")}>
                                            <span>
                                                {msg.msg.length > 50
                                                    ? msg.msg.slice(0, 50).replace(/\*/g, "") + "..."
                                                    : msg.msg.replace(/\*/g, "")}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td className="p-3 border-b">
                                        {msg.sentDate
                                            ? new Date(msg.sentDate).toLocaleString("en-IN")
                                            : "—"}
                                    </td>
                                    <td className="p-3 border-b">{msg.sentFailed ? "true" : "false"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredMessages.length > 0 && (
                <div className="flex justify-end items-center bg-white p-3 gap-5 rounded-xl mt-4 text-sm border">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border px-2 py-1 rounded"
                        >
                            {[10, 20, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-gray-700">
                        {`${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                            currentPage * itemsPerPage,
                            filteredMessages.length
                        )} of ${filteredMessages.length}`}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="p-2 rounded disabled:opacity-30 hover:bg-gray-200"
                        >
                            ❮
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="p-2 rounded disabled:opacity-30 hover:bg-gray-200"
                        >
                            ❯
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );
}
