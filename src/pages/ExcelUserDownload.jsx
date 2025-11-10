// import React from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// // --- Styles for the Button and Display ---
// const styles = {
//     container: {
//         padding: '30px',
//         textAlign: 'center',
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         backgroundColor: '#f4f7f6',
//         borderRadius: '10px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         maxWidth: '800px',
//         margin: '20px auto'
//     },
//     downloadButton: {
//         padding: '12px 25px',
//         backgroundColor: '#16a085', // Excel Green
//         color: 'white',
//         border: 'none',
//         borderRadius: '8px',
//         cursor: 'pointer',
//         fontWeight: 'bold',
//         fontSize: '16px',
//         marginTop: '20px',
//         transition: 'background-color 0.2s'
//     },
//     successMessage: {
//         marginTop: '30px',
//         padding: '15px',
//         backgroundColor: '#e6ffe6',
//         border: '1px solid #16a085',
//         borderRadius: '5px',
//         color: '#16a085',
//         fontWeight: '600'
//     }
// };

// const ExcelUserDownload = () => {
//     const [downloadSuccess, setDownloadSuccess] = React.useState(false);

//     const generateAndDownloadExcel = () => {

//         // --- 1. Define the Data (Mapping the entire table) ---
//         // '0' in the data represents an empty cell in the image where a number should be.
//         const excelData = [
//             // Row 1
//             ['Rajendra', '', '', '', 'Oct-25', '', '', '', '', 'H.Q. - Jabalpur'],
//             // Row 2: Headers
//             ['Date', 'Day', 'Place Of Worked', 'N. of Dr. call', 'n. Chemisttall', 'KM (One Way)', 'Travel Amount', 'Allowance HQ/EX/OS', 'Total Amt'],
//             // Row 3 to Row 34: Data Rows (32 rows)
//             ['01-10-2025', 'Wednesday', 'holiday', 0, 0, 0, 0, 300, 0],
//             ['02-10-2025', 'Thursday', 'holiday', 0, 0, 0, 0, 800, 0],
//             ['03-10-2025', 'Friday', 'jabalpur', 8, 4, 145, 450, 300, 800],
//             ['04-10-2025', 'saturday', 'seoni', 0, 0, 0, 0, 325, 775],
//             ['05-10-2025', 'Sunday', '', 0, 0, 0, 0, 0, 0],
//             ['06-10-2025', 'Monday', '', 0, 0, 0, 0, 300, 300],
//             ['07-10-2025', 'Tuesday', '', 0, 0, 0, 0, 300, 300],
//             ['08-10-2025', 'Wednesday', '', 0, 0, 650, 1200, 1850],
//             ['09-10-2025', 'Thursday', '', 0, 0, 650, 325, 975],
//             ['10-10-2025', 'Friday', '', 0, 0, 0, 0, 300, 500],
//             ['11-10-2025', 'saturday', '', 0, 0, 0, 0, 300, 300],
//             ['12-10-2025', 'Sunday', '', 0, 0, 0, 0, 0, 0],
//             ['13-10-2025', 'Monday', '', 0, 0, 0, 0, 300, 300],
//             ['14-10-2025', 'Tuesday', '', 0, 0, 500, 1200, 1700],
//             ['15-10-2025', 'Wednesday', '', 0, 0, 0, 0, 1200, 1200],
//             ['16-10-2025', 'Thursday', '', 0, 0, 500, 325, 825],
//             ['17-10-2025', 'Friday', '', 0, 0, 0, 0, 300, 500],
//             ['18-10-2025', 'saturday', '', 0, 0, 0, 0, 300, 300],
//             ['19-10-2025', 'Sunday', '', 0, 0, 0, 0, 0, 0],
//             ['20-10-2025', 'Monday', '', 0, 0, 0, 0, 0, 0],
//             ['21-10-2025', 'Tuesday', '', 0, 0, 0, 0, 0, 0],
//             ['22-10-2025', 'Wednesday', '', 0, 0, 0, 0, 300, 300],
//             ['23-10-2025', 'Thursday', '', 0, 0, 0, 0, 300, 300],
//             ['24-10-2025', 'Friday', '', 0, 0, 0, 0, 300, 300],
//             ['25-10-2025', 'saturday', '', 0, 0, 0, 0, 300, 300],
//             ['26-10-2025', 'Sunday', '', 0, 0, 0, 0, 0, 0],
//             ['27-10-2025', 'Monday', '', 0, 0, 0, 0, 300, 300],
//             ['28-10-2025', 'Tuesday', '', 0, 0, 600, 1200, 1800],
//             ['29-10-2025', 'Wednesday', '', 0, 0, 600, 325, 925],
//             ['30-10-2025', 'Thursday', '', 0, 0, 0, 0, 300, 300],
//             ['31-10-2025', 'Friday', '', 0, 0, 0, 0, 300, 300],

//             // Row 35: Summary Row
//             ['31-07-2025', 'Friday', '', 0, 0, 0, 0, 0, 0], // The last row in the image
//             // Row 36: Empty
//             ['', '', '', '', '', '', '', '', ''],
//             // Row 37: Totals Row
//             ['', '', '', 8, 4, 0, 3850, 10000, 13950],
//             // Row 38: Additional Totals (K38 and L38)
//             ['', '', '', 0.32, '', '', '', '', '', '', '', 145],
//             // Row 39: Empty
//             ['', '', '', '', '', '', '', '', ''],
//             // Row 40: Other Expenses Header
//             ['', 'Courier', '', '', '', '', '', '', ''],
//             ['', 'Printing, Stationery & Xerox', '', '', '', '', '', '', ''],
//             ['', 'Sample Clearing', '', '', '', '', '', '', ''],
//             ['', 'Fax', '', '', '', '', '', '', ''],
//             ['', 'Internet', '', '', '', '', '', '', '', '', 200],
//             ['', 'Mobile/Landline', '', '', '', '', '', '', ''],
//             // Row 47: Grand Total
//             ['', '', '', '', '', '', 0, 13950, ''],
//         ];

//         // --- 2. Create a Worksheet ---
//         const ws = XLSX.utils.aoa_to_sheet(excelData);

//         // --- 3. Set Column Widths (A-I are the main columns) ---
//         ws['!cols'] = [
//             { wch: 12 }, // A (Date)
//             { wch: 12 }, // B (Day)
//             { wch: 20 }, // C (Place Of Worked)
//             { wch: 15 }, // D (N. of Dr. call)
//             { wch: 15 }, // E (n. Chemisttall)
//             { wch: 15 }, // F (KM)
//             { wch: 18 }, // G (Travel Amount)
//             { wch: 20 }, // H (Allowance)
//             { wch: 15 }  // I (Total Amt)
//         ];

//         // --- 4. Merge Cells (Based on Image Layout) ---
//         if (!ws['!merges']) ws['!merges'] = [];

//         // Rajendra and Oct-25 (A1:B1 and E1:F1)
//         ws['!merges'].push(XLSX.utils.decode_range('A1:B1'));
//         ws['!merges'].push(XLSX.utils.decode_range('E1:F1'));
//         // H.Q. - Jabalpur (J1 to the end of the data columns)
//         ws['!merges'].push(XLSX.utils.decode_range('J1:M1')); // Assuming M is the last column

//         // Total Box Merges (L37:M37, etc.)
//         ws['!merges'].push(XLSX.utils.decode_range('G37:H37'));
//         ws['!merges'].push(XLSX.utils.decode_range('G47:H47'));

//         /* // --- 5. Custom Styling (Requires SheetJS Pro or a different library like exceljs) ---
//         // To apply background color (e.g., yellow for A3:I3 for the holiday row)
//         // This is pseudo-code for SheetJS:
//         // ws['A3'].s = { fill: { fgColor: { rgb: "FFFF00" } } };
//         // Since we can't use SheetJS Pro, we skip cell styling. 
//         */


//         // --- 6. Create Workbook and Trigger Download ---
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "October Report");

//         const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

//         saveAs(
//             new Blob([wbout], { type: 'application/octet-stream' }),
//             'Rajendra_Oct_25_Report.xlsx'
//         );

//         // Set success state to show confirmation message
//         setDownloadSuccess(true);
//     };

//     return (
//         <div style={styles.container}>
//             <h2>Excel Report Generation</h2>
//             <p>Generate a static Excel file with the exact data structure and layout as the Rajendra October report.</p>

//             <button
//                 onClick={generateAndDownloadExcel}
//                 style={styles.downloadButton}
//             >
//                 ⬇️ Generate & Download Report
//             </button>

//             {downloadSuccess && (
//                 <div style={styles.successMessage}>
//                     ✅ Report generated and download initiated successfully! You can now open the file in Excel.
//                     <p style={{ fontSize: '0.9em', color: '#0a644c' }}>
//                         **Note:** Cell coloring (yellow background) is a complex styling feature and is not included in the free version of the library used. The data, structure, and column widths are exact.
//                     </p>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ExcelUserDownload;


import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AttendanceReport = () => {
    const data = [
        { date: "01-10-2025", day: "Wednesday", place: "holiday", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "", total: "0" },
        { date: "02-10-2025", day: "Thursday", place: "holiday", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "", total: "0" },
        { date: "03-10-2025", day: "Friday", place: "jabalpur", drCalls: 8, chemistCalls: 4, km: "145", travel: "450", allowance: "300", total: "775" },
        { date: "04-10-2025", day: "Saturday", place: "seoni", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "", total: "" },
        { date: "05-10-2025", day: "Sunday", place: "", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "", total: "" },
        { date: "06-10-2025", day: "Monday", place: "", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "300", total: "300" },
        { date: "07-10-2025", day: "Tuesday", place: "", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "300", total: "300" },
        { date: "08-10-2025", day: "Wednesday", place: "", drCalls: "", chemistCalls: "", km: "650", travel: "650", allowance: "1200", total: "1850" },
        { date: "09-10-2025", day: "Thursday", place: "", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "", total: "" },
        { date: "10-10-2025", day: "Friday", place: "", drCalls: "", chemistCalls: "", km: "", travel: "", allowance: "300", total: "300" },
    ];

    const totalKM = 145 + 650;
    const totalTravel = 3950;
    const totalAllowance = 10000;
    const grandTotal = 13950;

    const handleDownload = () => {
        const excelData = [
            ["Rajendra", "", "", "", "Oct-25", "", "", "", "", "", "", "", ""],
            ["Date", "Day", "Place Of Worked", "n. of Dr. call", "n. Chemist call", "KM (One Way)", "Travel Amount", "Allowance HQ/EX/OS", "Total Amt", "", "", "", ""],
            ...data.map((r) => [
                r.date,
                r.day,
                r.place,
                r.drCalls,
                r.chemistCalls,
                r.km,
                r.travel,
                r.allowance,
                r.total,
            ]),
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", totalTravel, totalAllowance, "", "", "", "", ""],
            ["", "", "", "", "", "", grandTotal, "", "", "", "", "", ""],
            ["", "Courier", "", "", "", "", "", "", ""],
            ["", "Printing, Stationery & Xerox", "", "", "", "", "", "", ""],
            ["", "Sample Clearing", "", "", "", "", "", "", ""],
            ["", "Internet", "", "", "", "", "", "", "200"],
            ["", "Mobile/Landline", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", grandTotal],
        ];

        const ws = XLSX.utils.aoa_to_sheet(excelData);
        ws["!cols"] = [
            { wch: 15 },
            { wch: 12 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 12 },
            { wch: 15 },
            { wch: 18 },
            { wch: 15 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rajendra Report");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Rajendra_Report.xlsx");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Rajendra - Oct 2025 Report (H.Q. - Jabalpur)</h2>
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        fontFamily: "Arial",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#16a085", color: "white" }}>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Place Of Worked</th>
                            <th>No. of Dr. Call</th>
                            <th>No. of Chemist Call</th>
                            <th>KM (One Way)</th>
                            <th>Travel Amount</th>
                            <th>Allowance HQ/EX/OS</th>
                            <th>Total Amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((r, i) => (
                            <tr
                                key={i}
                                style={{
                                    backgroundColor:
                                        r.place?.toLowerCase() === "holiday" || r.day?.toLowerCase() === "sunday"
                                            ? "#f9e79f"
                                            : "white",
                                }}
                            >
                                <td style={cell}>{r.date}</td>
                                <td style={cell}>{r.day}</td>
                                <td style={cell}>{r.place}</td>
                                <td style={cell}>{r.drCalls}</td>
                                <td style={cell}>{r.chemistCalls}</td>
                                <td style={cell}>{r.km}</td>
                                <td style={cell}>{r.travel}</td>
                                <td style={cell}>{r.allowance}</td>
                                <td style={cell}>{r.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px", fontWeight: "bold" }}>
                Total KM: {totalKM} | Travel: ₹{totalTravel} | Allowance: ₹{totalAllowance} | Grand Total: ₹{grandTotal}
            </div>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button
                    onClick={handleDownload}
                    style={{
                        backgroundColor: "#16a085",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    📗 Download Excel
                </button>
            </div>
        </div>
    );
};

const cell = {
    border: "1px solid #ccc",
    padding: "6px",
    textAlign: "center",
};

export default AttendanceReport;
