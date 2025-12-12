import React, { useEffect, useState } from "react";
import api from "../api";
import { LoaderCircle } from "lucide-react";
import XLSX from "xlsx-js-style";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";

const AttendanceReport = () => {
    const [users, setUsers] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedExpenseType, setSelectedExpenseType] = useState("");
    const [otherExpenses, setOtherExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        loadUsers();
        loadExpenseTypes();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/User/GetAllUsers");
            console.log("Expense user: ", res?.data);
            setUsers(res?.data?.data);
        } catch (err) {
            console.error(err);
        }
    };

    //  chenages
    const loadExpenseTypes = async () => {
        try {
            const res = await api.get("/ExpenseMaster");
            setExpenseTypes(res?.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetData = async () => {
        try {
            setLoading(true);
            const body = {
                userid: user?.isAdmin ? selectedUser ? Number(selectedUser) : 0 : user?.id,
                expensestatus: selectedStatus === "All" ? "" : selectedStatus,
                expenseId: selectedExpenseType ? Number(selectedExpenseType) : 0,
                month: selectedMonth ? Number(selectedMonth) : 0,
                year: selectedYear ? Number(selectedYear) : 0,
            };
            const res = await api.post("/ExpenseMaster/GetExpense", body);
            console.log("res ", res?.data)
            setOtherExpenses(res.data.expenseData || []);
            setFilteredData(res.data.workExpenseReport || []);
        } catch (err) {
            console.error(err);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    // const handleDownloadExcel = () => {
    //     const ws1 = XLSX.utils.json_to_sheet(
    //         filteredData.map(d => ({
    //             Date: d.date?.split("T")[0],
    //             Day: d.day,
    //             Place: d.placeOfWork,
    //             DoctorCalls: d.numberOfDoctorCalls,
    //             ChemistCalls: d.numberOfChemistCalls,
    //             Kilometers: d.kilometers,
    //             TravelAmount: d.travelAmount,
    //             Allowance: d.allowance,
    //             TotalAmount: d.totalAmount,
    //         }))
    //     );

    //     const totalOtherExpense =
    //         otherExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    //     const ws2 = XLSX.utils.json_to_sheet([
    //         ...otherExpenses.map(e => ({
    //             ExpenseType: e.expenseType,
    //             Amount: e.amount,
    //         })),
    //         { ExpenseType: "TOTAL", Amount: totalOtherExpense },
    //     ]);

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws1, "Work Report");
    //     XLSX.utils.book_append_sheet(wb, ws2, "Other Expenses");

    //     XLSX.writeFile(wb, "ExpenseReport.xlsx");
    // };

    const handleDownloadExcel = () => {
        const ws = XLSX.utils.aoa_to_sheet([]);
        let row = 1;

        // 👉 Safe Style Setter (MOST IMPORTANT)
        const setCellStyle = (cell) => {
            if (!ws[cell]) ws[cell] = {};  // create cell if missing
            return ws[cell];
        };

        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const normalCell = {
            border: {
                top: { style: "thin", color: { rgb: "DDDDDD" } },
                bottom: { style: "thin", color: { rgb: "DDDDDD" } },
                left: { style: "thin", color: { rgb: "DDDDDD" } },
                right: { style: "thin", color: { rgb: "DDDDDD" } },
            },
        };

        const totalStyle = {
            font: { bold: true },
            fill: { fgColor: { rgb: "FFF2CC" } },
            border: normalCell.border,
        };

        // -----------------------------------
        // TABLE HEADERS
        // -----------------------------------
        const headers = [
            "Date", "Day", "Place", "DoctorCalls", "ChemistCalls",
            "Kilometers", "TravelAmount", "Allowance", "TotalAmount"
        ];

        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${row}` });

        headers.forEach((_, i) => {
            const cell = XLSX.utils.encode_cell({ r: row - 1, c: i });
            setCellStyle(cell).s = headerStyle;
        });

        row++;

        // -----------------------------------
        // MAIN DATA ROWS
        // -----------------------------------
        filteredData.forEach((d) => {
            const arr = [
                d.date?.split("T")[0],
                d.day,
                d.placeOfWork,
                d.numberOfDoctorCalls,
                d.numberOfChemistCalls,
                d.kilometers,
                d.travelAmount,
                d.allowance,
                d.totalAmount,
            ];

            XLSX.utils.sheet_add_aoa(ws, [arr], { origin: `A${row}` });

            arr.forEach((_, i) => {
                const cell = XLSX.utils.encode_cell({ r: row - 1, c: i });
                setCellStyle(cell).s = {
                    ...normalCell,
                    alignment: { horizontal: "center" },
                };
            });

            row++;
        });

        // -----------------------------------
        // TOTAL ROW
        // -----------------------------------
        XLSX.utils.sheet_add_aoa(
            ws,
            [[
                "Total",
                "",
                "",
                filteredData.reduce((s, x) => s + (x.numberOfDoctorCalls || 0), 0),
                filteredData.reduce((s, x) => s + (x.numberOfChemistCalls || 0), 0),
                filteredData.reduce((s, x) => s + (x.kilometers || 0), 0),
                filteredData.reduce((s, x) => s + (x.travelAmount || 0), 0),
                filteredData.reduce((s, x) => s + (x.allowance || 0), 0),
                filteredData.reduce((s, x) => s + (x.totalAmount || 0), 0),
            ]],
            { origin: `A${row}` }
        );

        for (let i = 0; i < 9; i++) {
            const cell = XLSX.utils.encode_cell({ r: row - 1, c: i });
            setCellStyle(cell).s = totalStyle;
        }

        row += 2;

        // -----------------------------------
        // EXPENSE SECTION HEADER
        // -----------------------------------
        const expenseStartCol = 7;

        XLSX.utils.sheet_add_aoa(
            ws,
            [["ExpenseType", "Amount"]],
            { origin: { r: row - 1, c: expenseStartCol } }
        );

        setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol })).s = headerStyle;
        setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol + 1 })).s = headerStyle;

        row++;

        // -----------------------------------
        // OTHER EXPENSE ROWS
        // -----------------------------------
        otherExpenses.forEach((e) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [[e.expenseType, e.amount]],
                { origin: { r: row - 1, c: expenseStartCol } }
            );

            setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol })).s =
                { ...normalCell, alignment: { horizontal: "left" } };

            setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol + 1 })).s =
                { ...normalCell, alignment: { horizontal: "right" } };

            row++;
        });

        const otherTotal = otherExpenses.reduce((s, x) => s + x.amount, 0);
        const mainTotal = filteredData.reduce((s, x) => s + x.totalAmount, 0);

        // TOTAL ROW
        XLSX.utils.sheet_add_aoa(
            ws,
            [["TOTAL", otherTotal]],
            { origin: { r: row - 1, c: expenseStartCol } }
        );

        setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol })).s = totalStyle;
        setCellStyle(XLSX.utils.encode_cell({ r: row - 1, c: expenseStartCol + 1 })).s = totalStyle;

        row++;

        // -----------------------------------
        // COLUMN WIDTHS
        // -----------------------------------
        ws["!cols"] = [
            { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
            { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
            {}, {}, // skip until col K
            { wch: 25 },  // Expense Type
            { wch: 15 },  // Amount
        ];

        // -----------------------------------
        // SAVE FILE
        // -----------------------------------
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, "ExpenseReport.xlsx");
    };

    const handleRefresh = () => {
        setSelectedUser("");
        setSelectedStatus("All");
        const today = new Date();
        setSelectedExpenseType("");
        setFilteredData([]);
        setOtherExpenses([]);
        setSelectedYear("");
        setSelectedMonth("");
    };

    return (
        <div style={page}>
            <h2 style={heading}>Expense Report</h2>
            <div style={filterCard}>
                {user?.isAdmin && (
                    <select
                        style={dropdown}
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users?.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u?.firstName} {u?.lastName}
                            </option>
                        ))}
                    </select>
                )}

                {/* <select
                    style={dropdown}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select> */}

                {/* <select
                    style={dropdown}
                    value={selectedExpenseType}
                    onChange={(e) => setSelectedExpenseType(e.target.value)}
                >
                    <option value="">All Expense Types</option>
                    {expenseTypes?.map((t, index) => (
                        <option key={t.name + "_" + index} value={t.expenseId}>
                            {t.name}
                        </option>
                    ))}
                </select> */}

                <div className="relative">
                    <input
                        style={dropdown}
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                    {!selectedMonth && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                            Select Month & Year
                        </span>
                    )}
                </div>


                <button
                    className="bg-blue-500 text-white p-2  rounded hover:bg-blue-600"
                    onClick={handleGetData}
                >
                    Get Data
                </button>
                <button
                    className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
                    onClick={handleRefresh}
                >
                    Refresh
                </button>

                {otherExpenses?.length > 0 && (
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        onClick={handleDownloadExcel}
                    >
                        Download Excel
                    </button>
                )}
            </div>

            {filteredData?.length > 0 ? (
                <div style={card}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerStyle}>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Place</th>
                                <th>Doctor Calls</th>
                                <th>Chemist Calls</th>
                                <th>KMs</th>
                                <th>Travel</th>
                                <th>Allowance</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((r, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        backgroundColor:
                                            r.placeOfWork?.toLowerCase() === "holiday" ||
                                                r.day?.toLowerCase() === "sunday"
                                                ? "#ffeeb4"
                                                : i % 2 === 0
                                                    ? "#ffffff"
                                                    : "#f9f9f9",
                                    }}
                                >
                                    <td style={cell}>{r?.date?.split("T")[0]}</td>
                                    <td style={cell}>{r?.day}</td>
                                    <td style={cell}>{r?.placeOfWork}</td>
                                    <td style={cell}>{r?.numberOfDoctorCalls}</td>
                                    <td style={cell}>{r?.numberOfChemistCalls}</td>
                                    <td style={cell}>{r?.kilometers}</td>
                                    <td style={cell}>{r?.travelAmount}</td>
                                    <td style={cell}>{r?.allowance}</td>
                                    <td style={cell}>{r?.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={noDataBox}>Click "Get Data" to view report</div>
            )}

            {otherExpenses?.length > 0 && (
                <div style={card}>
                    <h3 style={{ marginBottom: 10 }}>Other Expenses</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerStyle}>
                                <th>Expense Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherExpenses?.map((e, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#fff" : "#f7f7f7",
                                    }}
                                >
                                    <td style={cell}>{e?.expenseType}</td>
                                    <td style={cell}>{e?.amount}</td>
                                </tr>
                            ))}
                            <tr style={{ fontWeight: "bold", background: "#e1fff0" }}>
                                <td style={cell}>TOTAL</td>
                                <td style={cell}>
                                    {otherExpenses.reduce(
                                        (acc, curr) => acc + (curr.amount || 0),
                                        0
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {loading && (
                <div style={loader}>
                    <LoaderCircle className="animate-spin text-white" size={60} />
                </div>
            )}
        </div>
    );
};

export default AttendanceReport;

const page = {
    padding: 20,
    fontFamily: "Arial",
    background: "#f5f6fa",
    minHeight: "100vh",
};

const heading = {
    // textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
    fontSize: 20,
};

const filterCard = {
    background: "#ffffff",
    padding: 15,
    borderRadius: 8,
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
    border: "1px solid #eee",
};

const card = {
    background: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    border: "1px solid #ddd",
};

const dropdown = {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    minWidth: "25%",
    color: "black",
};

const btnPrimary = {
    background: "#16a085",
    color: "white",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10,
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
};

const headerStyle = {
    backgroundColor: "#d0cff6ff",
    color: "white",
    height: 40,
};

const cell = {
    border: "1px solid #ccc",
    padding: 8,
    textAlign: "center",
};

const noDataBox = {
    textAlign: "center",
    fontSize: 18,
    padding: 30,
    background: "white",
    borderRadius: 8,
    color: "#777",
    border: "1px solid #eee",
};

const loader = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
};

const btnSecondary = {
    background: "#7f8c8d",
    color: "white",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10,
};

