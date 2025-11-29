import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
//Importing images
import IMG1 from "../assets/asset7.png";
import IMG2 from "../assets/asset8.png";
import Loader from "../assets/loader.svg";
import NODATA from "../assets/computer.png";

import { toast } from "react-toastify";

//Importing icons
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import api from "../api";

function Leave() {
  const { user } = useSelector((state) => state.auth);
  const [leaves, setLeaves] = useState([]);
  const [activeState, setActiveState] = useState("approve");
  const [loading, setLoading] = useState(false);
  const [activeCounts, setActiveCounts] = useState(0);
  const [pendingCounts, setPendingCounts] = useState(0);
  const [rejectCounts, setRejectCounts] = useState(0);

  const [selectedId, setSelectedId] = useState(null)
  const [openRemovePopUp, setOpenRemovePopUp] = useState(false)


  const getImage = (leaveType) => {
    if (leaveType.toLowerCase() === "sick") {
      return IMG2;
    } else {
      return IMG1;
    }
  };

  const getDate = (orgdate) => {
    if (!orgdate) return "";
    const dateObj = new Date(orgdate);

    // Format the date as dd-MM-yyyy
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);

    return formattedDate;
  };

  const fetchData = async () => {
    setLoading(true);
    const customData = {
      pageNumber: 0,
      pageSize: 0,
      criteria: "none",
      reportingID: 0,
    };
    try {
      const response = await api.post(`/Leave/GetAll`, customData);
      setLeaves(response.data.data);
      console.log(response.data.data);
      setActiveCounts(
        response.data.data.filter((leave) => leave.leaveStatus === "Approved")
          .length
      );
      setPendingCounts(
        response.data.data.filter((leave) => leave.leaveStatus === "Pending")
          .length
      );
      setRejectCounts(
        response.data.data.filter((leave) => leave.leaveStatus === "Rejected")
          .length
      );
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenLeavePopUp = (id) => {
    console.log(id)
    setSelectedId(id)
    setOpenRemovePopUp(true)
  }

  const handleCloseOpenLeavePopUp = () => {
    setSelectedId(null)
    setOpenRemovePopUp(false)

  }

  const handleRemoveLeave = async () => {
    if (selectedId) {
      try {
        await api.post(`/Leave/${selectedId}`)
        fetchData()
        handleCloseOpenLeavePopUp()
        toast.success("Leave deleted successfully")
      } catch (err) {
        console.log(err)
      }
    }
  }

  const renderLeaves = () => {
    switch (activeState) {
      case "approve":
        return activeCounts > 0 ? (
          leaves
            .filter((leave) => leave.leaveStatus === "Approved")
            .map((item, index) => (
              <div
                key={index}
                className="w-full scale-[1] mb-4 hover:scale-[1.01] transition-all duration-300 shadow-sm overflow-hidden  grid grid-cols-1 md:grid-cols-10 border border-slate-100 rounded-md"
              >
                <div className="relative  md:col-span-2">
                  <div className="absolute md:-left-5 -right-12 -top-14 bg-sky-300/75 md:w-52 w-40 h-40 custom-round md:h-52 flex justify-center items-center">
                    <img
                      src={getImage(item.leaveType)}
                      alt="sick"
                      className="md:w-16 w-9 h-9 md:h-16"
                    ></img>
                  </div>
                </div>
                <div className="p-4 flex flex-col col-span-4 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1 items-center">
                      <span className="font-medium">
                        <DateRangeIcon></DateRangeIcon>
                      </span>
                      <span className="text-gray-700 text-[15px]">
                        {getDate(item.startDate || item.endDate)}
                      </span>
                    </div>
                    {item.startDate !== item.endDate && (
                      <>
                        <span>to</span>
                        <div className="flex gap-1 items-center">
                          <span className="font-medium">
                            <DateRangeIcon></DateRangeIcon>
                          </span>
                          <span className="text-gray-700 text-[15px]">
                            {getDate(item.endDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Approved By:</span>
                      <span className="text-gray-700 text-[15px]">
                        {item.approver}
                      </span>
                    </div>
                    <span className="bg-green-600 text-white text-sm p-1 rounded-md">
                      Approved
                    </span>
                  </div>
                </div>
                <div className="p-4 col-span-4 gap-2 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Leave Type:</span>
                    <span className="text-gray-700 text-[15px]">
                      {item.leaveType}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Comments:{" "}
                      <span className="font-normal text-gray-700 text-[15px]">
                        {item.comments}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Pending Leaves
              </span>
            </div>
          </div>
        );

      case "pending":
        return pendingCounts > 0 ? (
          leaves
            .filter((leave) => leave.leaveStatus === "Pending")
            .map((item, index) => (
              <div
                key={index}
                className="w-full mb-4 scale-[1] hover:scale-[1.01] transition-all duration-300 shadow-sm overflow-hidden  grid grid-cols-1 md:grid-cols-10 border border-slate-100 rounded-md"
              >
                <div className="relative  md:col-span-2">
                  <div className="absolute md:-left-5 -right-12 -top-14 bg-sky-300/75 md:w-52 w-40 h-40 custom-round md:h-52 flex justify-center items-center">
                    <img
                      src={getImage(item.leaveType)}
                      alt="sick"
                      className="md:w-16 w-9 h-9 md:h-16"
                    ></img>
                  </div>
                </div>
                <div className="p-4 flex flex-col col-span-3 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1 items-center">
                      <span className="font-medium">
                        <DateRangeIcon></DateRangeIcon>
                      </span>
                      <span className="text-gray-700 text-[15px]">
                        {getDate(item.startDate || item.endDate)}
                      </span>
                    </div>
                    {item.startDate !== item.endDate && (
                      <>
                        <span>to</span>
                        <div className="flex gap-1 items-center">
                          <span className="font-medium">
                            <DateRangeIcon></DateRangeIcon>
                          </span>
                          <span className="text-gray-700 text-[15px]">
                            {getDate(item.endDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-yellow-500 text-white text-sm p-1 rounded-md">
                      Pending
                    </span>
                    <div className="flex justify-center gap-1 items-center">
                      <span className="font-medium">Approver:</span>{" "}
                      <span className="text-gray-700 text-[15px]">
                        {item.approver}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 col-span-3 gap-2 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Leave Type:</span>
                    <span className="text-gray-700 text-[15px]">
                      {item.leaveType}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Comments:{" "}
                      <span className="font-normal text-gray-700 text-[15px]">
                        {item.comments}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="py-4 px-4 col-span-2 flex gap-2 flex-col items-start">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-medium">Raised On:</span>
                    <span>{getDate(item.requestDate)}</span>
                  </div>
                  <div className="">
                    <button className="text-white hover:bg-red-600 rounded-md transition-colors duration-300 flex gap-1 items-center bg-red-500 shadow-sm p-1 text-sm">
                      <span>
                        <DeleteOutlineOutlinedIcon
                          style={{ fontSize: "1.2rem" }}
                        ></DeleteOutlineOutlinedIcon>
                      </span>{" "}
                      <span onClick={() => handleOpenLeavePopUp(item.id)} className="md:text-[15px] text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Pending Leaves
              </span>
            </div>
          </div>
        );

      case "rejected":
        return rejectCounts > 0 ? (
          leaves
            .filter((leave) => leave.leaveStatus === "Rejected")
            .map((item, index) => (
              <div
                key={index}
                className="w-full mb-4 scale-[1] hover:scale-[1.01] transition-all duration-300 shadow-sm overflow-hidden  grid grid-cols-1 md:grid-cols-10 border border-slate-100 rounded-md"
              >
                <div className="relative  md:col-span-2">
                  <div className="absolute md:-left-5 -right-12 -top-14 bg-sky-300/75 md:w-52 w-40 h-40 custom-round md:h-52 flex justify-center items-center">
                    <img
                      src={getImage(item.leaveType)}
                      alt="sick"
                      className="md:w-16 w-9 h-9 md:h-16"
                    ></img>
                  </div>
                </div>
                <div className="p-4 flex flex-col col-span-4 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1 items-center">
                      <span className="font-medium">
                        <DateRangeIcon></DateRangeIcon>
                      </span>
                      <span className="text-gray-700 text-[15px]">
                        {getDate(item.startDate || item.endDate)}
                      </span>
                    </div>
                    {item.startDate !== item.endDate && (
                      <>
                        <span>to</span>
                        <div className="flex gap-1 items-center">
                          <span className="font-medium">
                            <DateRangeIcon></DateRangeIcon>
                          </span>
                          <span className="text-gray-700 text-[15px]">
                            {getDate(item.endDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-red-500 text-white text-sm p-1 rounded-md">
                      Rejected
                    </span>
                    <div className="flex justify-center gap-1 items-center">
                      <span className="font-medium">Rejected By:</span>{" "}
                      <span className="text-gray-700 text-[15px]">
                        {item.approver}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 col-span-4 gap-2 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Leave Type:</span>
                    <span className="text-gray-700 text-[15px]">
                      {item.leaveType}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Comments:{" "}
                      <span className="font-normal text-gray-700 text-[15px]">
                        {item.comments}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-1 items-center">
              <img src={NODATA} alt="nodata" className="w-24 h-24"></img>
              <span className="text-gray-600 font-medium">
                No Rejected Leaves
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {
        openRemovePopUp && (
          <div className="fixed z-50 flex justify-center items-center inset-0 bg-black/50">
            <div className="bg-white w-96 rounded-md p-4 flex flex-col">
              <h1 className="font-medium text-lg">Confirmation</h1>
              <span>Are you sure to remove this leave?</span>
              <div className="w-full mt-4 flex place-content-end gap-2">
                <button onClick={handleCloseOpenLeavePopUp} className="font-medium text-white rounded-md p-1 w-20 bg-blue-500 hover:bg-blue-600">Cancel</button>
                <button onClick={handleRemoveLeave} className="font-medium text-white rounded-md p-1 w-20 bg-red-500 hover:bg-red-600">Remove</button>
              </div>
            </div>
          </div>
        )
      }
      <div className="flex h-full flex-col gap-3 md:gap-4">
        <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-600 text-base md:text-lg font-medium">
              Leaves
            </h1>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveState("approve")}
                className={`w-20 ${activeState === "approve"
                  ? "bg-themeblue text-white"
                  : "text-gray-600"
                  } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
              >
                Approved
              </span>
              <span
                onClick={() => setActiveState("pending")}
                className={`w-20 ${activeState === "pending"
                  ? "bg-themeblue text-white"
                  : "text-gray-600"
                  } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
              >
                Pending
              </span>
              <span
                onClick={() => setActiveState("rejected")}
                className={`w-20 ${activeState === "rejected"
                  ? "bg-themeblue text-white"
                  : "text-gray-600"
                  } cursor-pointer hover:bg-themeblue hover:text-white transition-colors duration-300 flex justify-center items-center text-sm p-1 border rounded-md`}
              >
                Rejected
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              onClick={fetchData}
              className="cursor-pointer md:w-9 md:h-9 w-8 h-8 border-slate-200 border flex justify-center items-center rounded-md"
            >
              <AutorenewIcon></AutorenewIcon>
            </span>
            <Link
              to={user.isAdmin ? "/admin/myleaves/add" : "/employee/myleaves/add"}
            >
              <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
                Add Leave
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white h-full overflow-auto rounded-md md:py-4 py-3 px-3">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <img src={Loader} alt="loader" className="w-10 h-10"></img>
            </div>
          ) : (
            renderLeaves()
          )}
        </div>
      </div>
    </>
  );
}

//<CloseOutlinedIcon style={{fontSize:'1.1rem'}}></CloseOutlinedIcon>
export default Leave;
