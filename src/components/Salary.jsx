import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jsPDF from "jspdf";
import "jspdf-autotable";

//importing icons
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const generatePayslipPDF = (data) => {
    const doc = new jsPDF();
    let y = 10; // Start position
  
    doc.setFontSize(14);
    doc.text("Employee Payslip", 105, y, { align: "center" });
    y += 10;
  
    // Employee Details
    doc.setFontSize(10);
    const employeeDetails = [
      ["Employee Name:", data.EmployeeName],
      ["Date of Joining:", data.DateofJoining],
      ["Employee ID:", data.EmployeeN],
      ["Gender:", data.Gender],
      ["Designation:", data.Designation],
      ["Headquarter:", data.Headquarter],
      ["Department:", data.Department],
      ["State:", data.State],
      ["PAN Number:", data.PANN],
      ["Mode of Payment:", data.ModeofPayment],
      ["PF Account No:", data.PFAccountN],
      ["Bank Name:", data.BankName],
      ["UAN:", data.UAN],
      ["Bank Account No:", data.BankAccNo],
      ["Payslip Month & Year:", data.PayslipMonthYear],
    ];
  
    employeeDetails.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, 10, y);
      y += 7;
    });
  
    y += 5;
  
    // Earnings Table
    const earnings = data.Earnings.map((item) => [
      Object.keys(item)[0],
      item[Object.keys(item)[0]],
    ]);
    
    doc.autoTable({
      startY: y,
      head: [["Earnings", "Amount"]],
      body: earnings,
      theme: "grid",
    });
  
    y = doc.lastAutoTable.finalY + 10;
  
    // Deductions Table
    const deductions = data.Deductions.map((item) => [
      Object.keys(item)[0],
      item[Object.keys(item)[0]],
    ]);
  
    doc.autoTable({
      startY: y,
      head: [["Deductions", "Amount"]],
      body: deductions,
      theme: "grid",
    });
  
    y = doc.lastAutoTable.finalY + 10;
  
    // Summary
    doc.text(`Total Earnings: ${data.totalEarning}`, 10, y);
    y += 7;
    doc.text(`Total Deductions: ${data.totalDeductions}`, 10, y);
    y += 7;
    doc.text(`Net Salary: ${data.NetSalary}`, 10, y);
  
    // Save PDF
    doc.save(`Payslip_${data.EmployeeName}.pdf`);
  };

const rows = [
  createData("BASIC", 21802.0, 6.0, 24, 4.0),
  createData("HRA", 6544.0, 9.0, 37, 4.3),
  createData("CONVEYANCE", 4000.0, 16.0,),
  createData("EDUCATIONAL ALLOWANCE", 5000.0, 3.7),
  createData("SPECIAL ALLOWANCE", 2000.0, 2000.0),
  createData("COMPENSATORY ALLOWANCE", 3000.0, 3000.0),
  createData("Total Earnings",40000.00,42343.00,"Total Deductions",2340)
];

function Salary() {

    const payslipData = {
        EmployeeName: "John Doe",
        DateofJoining: "2020-05-15",
        EmployeeN: "EMP12345",
        Gender: "Male",
        Designation: "Software Engineer",
        Headquarter: "New York",
        Department: "IT",
        State: "NY",
        PANN: "ABCDE1234F",
        ModeofPayment: "Bank Transfer",
        PFAccountN: "PF987654321",
        BankName: "Bank of America",
        UAN: "UAN123456789",
        BankAccNo: "123456789012",
        totalEarning: "7500",
        totalDeductions: "1500",
        NetSalary: "6000",
        PayslipMonthYear: "January 2025",
        Earnings: [
          { Basic: "4000", Amount: "4000" },
          { HRA: "2000", Amount: "2000" },
          { CONVEYANCE: "500", Amount: "500" },
          { EDUCATIONALALLOWANCE: "300", Amount: "300" },
          { SPECIALALLOWANCE: "500", Amount: "500" },
          { COMPENSATORYALLOWANCE: "200", Amount: "200" }
        ],
        Deductions: [
          { "EMPLOYEE PF": "1000", Amount: "1000" },
          { PT: "500", Amount: "500" }
        ]
      };
      
  return (
    <div className="w-full rounded-md custom-shadow pb-4 bg-white flex flex-col gap-6">
      <div className="flex p-4 px-6 border-b items-center justify-between">
        <h1>Salary Slip</h1>
        <button onClick={() => generatePayslipPDF(payslipData)} className="bg-themeblue hover:bg-blue-800 transition-colors text-white px-1.5 py-1 rounded-md flex items-center gap-1.5">
          <span>
            <DownloadOutlinedIcon
              style={{ fontSize: "1rem" }}
            ></DownloadOutlinedIcon>
          </span>
          <span className="text-sm font-semibold">Download</span>
        </button>
      </div>
      <div className="flex flex-col py-2 px-6 gap-4">
        <div className="grid p-4 rounded-md bg-gray-100 grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[18px]">Employee Name:</span>
            <span>Vivek Mesuriya</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Date Of Joining:</span>
            <span>1 Jan 2024</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Employee No:</span>
            <span>EP 002</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Gender:</span>
            <span>Male</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Designation:</span>
            <span>Manager</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Headquater:</span>
            <span>Jabalpur</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Department:</span>
            <span>Sales & Marketing</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">State:</span>
            <span>Gujarat</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Pan No:</span>
            <span>AYDTR524242</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Mode Of Payment:</span>
            <span>Bank Advise</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">PF Account N:</span>
            <span>MHDFERDFERDF</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Bank Name:</span>
            <span>CANRA BANK</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">UAN:</span>
            <span>1002524242323</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className="font-semibold text-[16px]">Bank Acc N:</span>
            <span>11025242312</span>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Earnings</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Gross Salary</TableCell>
                <TableCell align="left">Deductions</TableCell>
                <TableCell align="left">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell  component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.calories}</TableCell>
                  <TableCell align="left">{row.fat}</TableCell>
                  <TableCell align="left">{row.carbs}</TableCell>
                  <TableCell align="left">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex mt-2 w-full md:w-1/2 flex-col gap-3">
           <div className="grid grid-cols-2">
             <span className="text-xl font-semibold">Toatal Earnings</span>
             <span className="font-medium">324342.00</span>
           </div>
           <div className="grid grid-cols-2">
             <span className="text-xl font-semibold">Net Salary</span>
             <span className="font-medium">40,000.00</span>
           </div>
           <div className="grid grid-cols-2">
             <span className="text-xl font-semibold">Net Pay In Words</span>
             <span className="font-medium">Fourty Thousand Only</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Salary;
