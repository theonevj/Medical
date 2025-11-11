import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";

//importing images
import NODATA from "../assets/computer.png";
import Loader from "../assets/loader.svg";

//Importing icons
import {
  CalendarDays,
  Car,
  CircleCheck,
  CircleX,
  Clock,
  DollarSign,
  IndianRupee,
  Navigation,
  Route,
  Rows2,
} from "lucide-react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { MapPin } from "lucide-react";
import { toast } from "react-toastify";

function StourPlan() {
  const { user } = useSelector((state) => state.auth);
  const [stpPlan, setStpPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(0);
  const [headQuater, setHeadQuater] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [stpId, setStpId] = useState(null);
  const [stpIdDetail, setStpIdDetail] = useState([]);

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

  const getAllTourPlan = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/STPMTP/GetAll`, {
        pageNumber: 0,
        pageSize: 0,
        criteria: "string",
        headquarter: Number(searchQuery),
        reportingTo: 0,
        tourType: 0,
      });
      setStpPlan(response.data.data);
    } catch (err) {
      toast.error("Something went wrong.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTourPlan();
  }, [searchQuery]);

  const fetchHeadquater = async () => {
    try {
      const response = await api.get("/Headquarters");
      setHeadQuater(response.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (stpId !== null) {
      const fetchStpDetail = async () => {
        try {
          const response = await api.get(`/STPMTP/${stpId}`);
          setStpIdDetail(response.data);
        } catch (err) {
          toast.error(err?.response?.data?.message || "Something went wrong.");
        }
      };
      fetchStpDetail();
    }
  }, [stpId]);

  useEffect(() => {
    fetchHeadquater();
  }, []);

  const modalShow = (tourID) => {
    setShowModal(true);
    setStpId(tourID);
  };

  const closeModal = () => {
    setShowModal(false);
    setStpId(null);
  };

  return (
    <div className="flex h-full flex-col gap-3 md:gap-4">
      <div className="bg-white custom-shadow rounded-md md:py-4 py-3 px-3 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-600 text-base md:text-lg font-medium">
            Standard Tour Plan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 md:flex  p-1.5 rounded-md hidden gap-1 items-center">
            <label className="text-neutral-600">Search By Headquarters: </label>
            <select
              className="outline-none p-1.5 "
              onChange={(e) => setSearchQuery(e.target.value)}
            >
              <option value={0}>--- Select Headquarters ---</option>
              {headQuater.map((hd) => (
                <option value={hd.hqid}>{hd.hqName}</option>
              ))}
            </select>
          </div>
          <Link
            to={user.isAdmin ? "/admin/stpplan/add" : "/employee/stpplan/add"}
          >
            <button className="md:p-2 p-1.5 bg-themeblue md:text-base text-sm text-white rounded-md">
              Add Tour Plan
            </button>
          </Link>
        </div>
      </div>

      <div className="h-full w-full overflow-scroll gap-4">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <img src={Loader} alt="loader" className="w-10 h-10"></img>
          </div>
        ) : stpPlan.length === 0 ? (
          <div className="flex w-full h-full justify-center items-center">
            No Stp Found
          </div>
        ) : (
          <div className="h-full gap-4 w-full grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 items-start">
            {[...stpPlan]?.reverse().map((stp, index) => (
              <button
                onClick={() => {
                  console.log("Clicked:", stp.tourID);
                  modalShow(stp.tourID);
                }}
              >
                <div
                  key={index}
                  className="flex  bg-white rounded-lg  shadow flex-col"
                >
                  <div className="flex justify-between items-center rounded-t-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4 text-white relative">
                    <div className="flex items-center w-[50%]">
                      <div className="w-5 h-5 mr-1">
                        <Route className="w-5 h-5 text-blue-800 font-bold" />
                      </div>
                      <h1
                        title={stp.tourName}
                        className="truncate text-blue-800 font-bold cursor-pointer"
                      >
                        {stp.tourName
                          .split("-")
                          .map((i) => i.trim())
                          .map((i) => i.slice(0, 3).toUpperCase())
                          .join(" → ")}
                      </h1>
                    </div>

                    <span
                      className={`${stp.tourType === 0
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : stp.tourType === 1
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                          : "bg-sky-100 text-sky-700 border border-sky-300"
                        } inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 transition-opacity duration-150 cursor-pointer`}
                    >
                      <Car className="w-4 h-4 mr-1" />
                      {stp.tourType === 0
                        ? "Local"
                        : stp.tourType === 1
                          ? "Out Station"
                          : "Ex-Station"}
                    </span>
                  </div>
                  <div className="flex gap-3 flex-col p-3 mx-3">
                    <div className="flex flex-col md:flex-col lg:flex-row justify-between items-start gap-4">
                      {stp?.tourLocation && (
                        <div className="flex items-start space-x-3 sm:flex-1">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900 text-left">
                              Location:
                            </p>
                            <p
                              className="text-sm text-gray-600 truncate"
                              title={stp?.tourLocation}
                            >
                              {stp?.tourLocation}
                            </p>
                          </div>
                        </div>
                      )}

                      {stp.addedDate && (
                        <div className="flex lg:justify-end items-start space-x-3 sm:flex-1">
                          <CalendarDays className="w-5 h-5 text-gray-500" />
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900 text-left">
                              Added On:
                            </p>
                            <p className="text-sm text-gray-600">
                              {getDate(stp.addedDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-start items-start  space-x-3">
                      <Navigation className="w-5 h-5 text-gray-500 " />
                      <div className="flex flex-col md:flex-col lg:flex-row justify-between items-start">
                        <p className="text-sm font-medium text-gray-900 text-left">
                          Distance:
                        </p>
                        <p className="text-sm text-gray-600 text-left">
                          {stp?.tourAllowance?.split(",")}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        {stp?.tourAllowance && (
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Allowance
                              </p>
                              <p
                                className="text-sm text-gray-900 font-medium truncate"
                                title={stp.perKm}
                              >
                                {stp.perKm}
                              </p>
                            </div>
                          </div>
                        )}
                        {stp?.status && (
                          <div className="flex items-center space-x-2">
                            {stp.status === "Approved" ? (
                              <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : stp.status === "Pending" ? (
                              <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            ) : (
                              <CircleX className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                status
                              </p>
                              <p
                                className="text-sm text-gray-900 font-medium truncate"
                                title={stp.status}
                              >
                                {stp.status}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold ">
                Details for STP ID: {stpId}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 "
              >
                <CloseOutlinedIcon />
              </button>
            </div>
            <p className="mb-6">
              Changing the Headquarter will reset all added data. Do you want to
              continue?
            </p>

            <table className="w-full border-collapse border border-neutral-300 bg-white  overflow-hidden my-4">
              <tbody>
                <tr className="hover:bg-neutral-50">
                  <th className="border border-neutral-300 px-4 py-3 uppercase text-left text-sm font-semibold text-neutral-700 bg-neutral-50 w-1/3">
                    HQ
                  </th>
                  <td className="border border-neutral-300 px-4 py-3 uppercase text-sm text-neutral-600">
                    {stpIdDetail.hqName}
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <th className="border border-neutral-300 px-4 py-3 uppercase text-left text-sm font-semibold text-neutral-700 bg-neutral-50 w-1/3">
                    Tour
                  </th>
                  <td
                    className="border border-neutral-300 px-4  py-3 uppercase text-sm text-neutral-600"
                    title={stpIdDetail.tourName}
                  >
                    {stpIdDetail.tourName &&
                      stpIdDetail.tourName
                        .split("-")
                        .map((i) => i.trim())
                        .map((i) => i.slice(0, 3).toUpperCase())
                        .join("   →   ")}
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <th className="border border-neutral-300 px-4 py-3 text-left uppercase text-sm font-semibold text-neutral-700 bg-neutral-50 w-1/3">
                    Location
                  </th>
                  <td className="border border-neutral-300 px-4 py-3 text-sm uppercase text-neutral-600">
                    {stpIdDetail.tourLocations
                      ?.map((loc) => loc.locationName)
                      .join(", ")}
                  </td>
                </tr>

                <tr className="hover:bg-neutral-50">
                  <th className="border border-neutral-300 px-4 py-3 text-left uppercase text-sm font-semibold text-neutral-700 bg-neutral-50 w-1/3">
                    Tour Type
                  </th>
                  <td className="border border-neutral-300 px-4 py-3 text-sm uppercase text-neutral-600">
                    {stpIdDetail.tourType === 0
                      ? "Local"
                      : stpIdDetail.tourType === 1
                        ? "Outstation"
                        : stpIdDetail.tourType === 2
                          ? "Ex - Station"
                          : ""}
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <th className="border border-neutral-300 px-4 py-3 uppercase text-left text-sm font-semibold text-neutral-700 bg-neutral-50 w-1/3">
                    Allowance
                  </th>
                  <td className="border border-neutral-300 px-4 py-3 uppercase text-sm text-neutral-600">
                    {stpIdDetail.tourAllowance || "Not Provided"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center gap-4">
              <Link to={`update/${stpId}`}>
                <button className="px-4 py-2 bg-blue-900 text-white rounded">
                  Update
                </button>
              </Link>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => { }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StourPlan;
