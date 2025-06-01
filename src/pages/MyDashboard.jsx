import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useSelector } from "react-redux";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

//Importing icons
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ContentPasteOffOutlinedIcon from "@mui/icons-material/ContentPasteOffOutlined";

import { ClipboardMinus } from "lucide-react";
import { Beaker } from "lucide-react";

import { fetchAllUsers } from "../data/EmployeeDataTable";
import { Link } from "react-router-dom";
import { LoaderCircle, X } from "lucide-react";

export default function MyDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [chemistCount, setChemistCount] = useState(0);
  const [myTeamCount, setMyTeamCount] = useState(0);
  const [dailyAvgDocVisit, setDailyAvgDocVisit] = useState(0);
  const [dailyAvgChecmist, setDailyAvgChecmist] = useState(0);
  const [monthlyAvgDocVisit, setMonthlyAvgDocVisit] = useState(0);
  const [monthlyAvgChecmist, setMonthlyAvgChecmist] = useState(0);
  const [viewType, setViewType] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const localizer = momentLocalizer(moment);
  const views = ["month", "agenda"];
  const [events, setEvents] = useState([]);
  const [showStp, setShowStp] = useState(false);

  const getMonthYear = (date) => {
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return { month, year };
  };

  const fetchCalenderData = async (currentDate) => {
    const dateData = getMonthYear(currentDate);

    console.log("Sending date data:", dateData);
    try {
      const response = await api.post("/User/dashboard", dateData);
      console.log("Sending date data:", dateData);
      let data = response.data.data.result;
      console.log("DataFromApi", data);

      setDoctorsCount(data[0].noofdoc);
      setChemistCount(data[0].noofChemist);
      setMyTeamCount(data[0].noofTeam);
      setDailyAvgDocVisit(data[0].dailyAvgDocVisit);
      setDailyAvgChecmist(data[0].dailyAvgChecmist);
      setMonthlyAvgDocVisit(data[0].monthlyAvgDocVisit);
      setMonthlyAvgChecmist(data[0].monthlyAvgChecmist);

      setEvents(
        data.map((item) => ({
          title: item.daystatus,
          stpname: item.stpname ?? "Null",
          stptype: item.stptype ?? "Null",
          start: new Date(item.daydt),
          end: new Date(item.daydt),
          color: item.color,
          mtpID: item.mtpID,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCalenderData(currentDate);
  }, []);

  const [showPopUp, setShowPopUp] = useState(false);
  const [mtpDetails, setMtpDetails] = useState([]);
  const [mtpLoader, setMtpLoader] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchMtpDetails = async () => {
      setMtpLoader(true);
      try {
        const response = await api.post(
          `/STPMTP/GetAllByID?id=${selectedEvent.mtpID}`
        );
        console.log("FetchMTPData:", response);
        setMtpDetails(response.data.data.mtpdetails);
      } catch (err) {
        console.log(err);
        toast.error("Error while fetching mtp details.");
      } finally {
        setMtpLoader(false);
      }
    };

    if (selectedEvent) {
      fetchMtpDetails();
    }
  }, [selectedEvent]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDetails = mtpDetails.filter(
    (items) =>
      items?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items?.doctorArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items?.drName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items?.products?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items?.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items?.vfreq?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formattedDate, setFormattedDate] = useState("N/A");
  useEffect(() => {
    if (mtpDetails?.length > 0 && mtpDetails[0]?.mtpdate) {
      const [day, month, year] = mtpDetails[0].mtpdate.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } else {
      setFormattedDate("N/A");
    }
  }, [mtpDetails]);

  const handleSelectSlot = ({ start }) => {
    const clickedDate = new Date(start).toDateString();
    const foundEvent = events.find(
      (event) => new Date(event.start).toDateString() === clickedDate
    );
    if (foundEvent.mtpID) {
      setSelectedEvent(foundEvent);
      setShowPopUp(true);
    }
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
    fetchCalenderData(newDate);
  };

  const dashboardCardsData = [
    {
      title: "Doctors",
      count: doctorsCount,
      link: user.isAdmin ? "/admin/doctors" : "/employee/doctors",
      linkText: "See all doctors",
      gradient: "from-blue-400 to-blue-600",
      textColor: "text-sky-100",
      icon: (
        <LocalHospitalOutlinedIcon
          style={{ fontSize: "8rem", opacity: "0.1" }}
        />
      ),
    },
    {
      title: "Chemist",
      count: chemistCount,
      link: user.isAdmin ? "/admin/chemists" : "/employee/chemists",
      linkText: "See all chemist",
      gradient: "from-violet-400 to-violet-600",
      textColor: "text-fuchsia-100",
      icon: (
        <ScienceOutlinedIcon style={{ fontSize: "8rem", opacity: "0.1" }} />
      ),
    },
    {
      title: "My Team",
      count: myTeamCount,
      link: user.isAdmin ? "/admin/myteam" : "/employee/myteam",
      linkText: "See all Member",
      gradient: "from-emerald-400 to-teal-600",
      textColor: "text-lime-100",
      icon: (
        <Inventory2OutlinedIcon style={{ fontSize: "8rem", opacity: "0.1" }} />
      ),
    },
    {
      title: "Doctor Average",
      dailyCount: dailyAvgDocVisit,
      monthlyCount: monthlyAvgDocVisit,
      gradient: "from-sky-400 to-sky-600 col-span-3 lg:col-span-1",
      textColor: "text-sky-100",
      icon: (
        <ContentPasteOffOutlinedIcon
          style={{ fontSize: "8rem", opacity: "0.1" }}
        />
      ),
    },
    {
      title: "Chemist Average",
      dailyCount: dailyAvgChecmist,
      monthlyCount: monthlyAvgChecmist,
      gradient: "from-indigo-400 to-indigo-600 col-span-3 lg:col-span-1",
      textColor: "text-indigo-100",
      icon: (
        <ScienceOutlinedIcon style={{ fontSize: "8rem", opacity: "0.1" }} />
      ),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStp(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full overflow-y-scroll ">
      <div className="xl:gap-6 md:gap-2 gap-2 grid  mb-4  grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className={`relative flex flex-col p-4 rounded-lg bg-gradient-to-r ${card.gradient}  overflow-hidden`}
          >
            {card.icon && (
              <span
                className={`absolute top-8 right-6 ${card.textColor} text-md md:text-lg  xl:text-3xl`}
              >
                {card.icon}
              </span>
            )}
            <h1
              className={`md:text-lg  xl:text-2xl font-bold ${card.textColor} text-center lg:text-start`}
            >
              {card.title}
            </h1>
            {card.dailyCount && card.monthlyCount && (
              <div
                className={`flex justify-between items-end mt-3 lg:mt-5 ${card.textColor}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">Daily Average</span>
                  <span className="md:text-lg xl:text-3xl font-semibold text-center">
                    {card.dailyCount}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">Monthly Average</span>
                  <span className="md:text-lg xl:text-3xl font-semibold text-center">
                    {card.monthlyCount}
                  </span>
                </div>
              </div>
            )}
            {card.count && (
              <div className="flex justify-center items-center">
                <span
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-none ${card.textColor}`}
                >
                  {card.count}
                </span>
              </div>
            )}

            <div className="mt-auto">
              <Link to={card.link}>
                <span className={`text-base transition ${card.textColor}`}>
                  {card.linkText}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full relative mb-4 lg:h-[800px] h-[400px] md:[600px]">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          views={views}
          onView={(view) => {
            setViewType(view);
          }}
          view={viewType}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectSlot}
          onNavigate={handleNavigate}
          date={currentDate}
          eventPropGetter={(event) => {
            let backgroundColor = "transparent";

            return {
              style: {
                backgroundColor,
                borderRadius: "px",
                opacity: 1,
                color: event.color || "white",
                width: "100%",
                height: "100%",
                margin: 0,
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textOverflow: "ellipsis",
                fontWeight: "bold",
                fontSize: "14px",
              },
            };
          }}
          dayPropGetter={(date) => {
            const event = events.find(
              (event) =>
                new Date(event.start).toDateString() === date.toDateString()
            );
            if (!event || !event.title) return {};
            let backgroundColor = "";
            const title = event.title;
            if (title.startsWith("Week Off")) {
              backgroundColor = "#FAFAFA";
            } else if (title.startsWith("Leave - Sick")) {
              backgroundColor = "#7BAE56";
            } else if (title.startsWith("Holiday")) {
              backgroundColor = "#FFFBE6";
            } else if (title.startsWith("Absent")) {
              backgroundColor = "#FFF1F0";
            } else if (title.startsWith("Present")) {
              backgroundColor = "#E6F7FF";
            } else {
              backgroundColor = "";
            }
            return {
              style: {
                backgroundColor,
              },
            };
          }}
          components={{
            event: ({ event }) => (
              <div className="">
                <div className="flex justify-between items-center font-semibold lg:font-bold">
                  {event.title}
                </div>

                {(event.stpname || event.stptype) && (
                  <div className="text-[12px] font-normal  whitespace-normal break-words hidden lg:block">
                    <p className="flex  break-words">{event.stpname}</p>
                    <p>
                      {event.stptype === "0" ||
                        event.stptype === "1" ||
                        (event.stptype === "2" && "Tour Type: ")}
                      {event.title === "Present" &&
                        (event.stptype === "0"
                          ? "Local"
                          : event.stptype === "1"
                          ? "Outstation"
                          : event.stptype === "2"
                          ? "Ex - Station"
                          : "")}
                    </p>
                  </div>
                )}
              </div>
            ),
          }}
        />

        {showPopUp && selectedEvent && (
          <div className="fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-40">
            <div className="w-5/6 max-h-[90vh] z-50 rounded-md overflow-hidden shadow-sm bg-white border flex flex-col">
              <div className="flex bg-neutral-400 text-black p-4 border-b border-neutral-200 justify-between items-center">
                <h1 className="font-medium text-lg">MTP Details</h1>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setShowPopUp(false)}
                >
                  <X />
                </button>
              </div>
              <div className="p-4 space-x-4 gap-3 lg:gap-0 bg-neutral-100 flex flex-col md:justify-between md:items-center">
                <div className="lg:leading-7 gap-3 lg:gap-0 flex flex-col md:justify-between md:items-center">
                  <p className="font-semibold text-md text-nowrap">
                    Date:- {formattedDate}
                  </p>
                  <p className="font-semibold text-md  text-nowrap">
                    <span className="">STP:-</span>{" "}
                    {filteredDetails.length > 0 && filteredDetails[0].stp}
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[300px] mr-4 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-none  placeholder-neutral-400 shadow-sm "
                />
              </div>
              <div className="flex-1 overflow-auto bg-neutral-100 py-2">
                {mtpLoader ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <LoaderCircle className="animate-spin" />
                  </div>
                ) : filteredDetails.length > 0 ? (
                  <table className="w-full border border-neutral-300 shadow-lg rounded-lg mb-4">
                    <thead className="bg-neutral-400 text-black">
                      <tr>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Id
                        </th>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Speciality
                        </th>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Qualification
                        </th>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Doctor Area
                        </th>
                        <th className="border border-neutral-300 p-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Products
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDetails.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-indigo-100 odd:bg-neutral-100 even:bg-white transition duration-200 ease-in-out text-start"
                        >
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {index + 1}
                          </td>
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {item?.drName || "N/A"}
                          </td>
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {item?.speciality || "N/A"}
                          </td>
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {item?.qualification || "N/A"}
                          </td>
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {item?.doctorArea || "N/A"}
                          </td>
                          <td className="border border-neutral-300 p-3 text-neutral-700 align-top">
                            {item?.products.split(",").map((p, index) => (
                              <span key={index} className="mr-4">
                                {p.trim()},
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-neutral-500">No records found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 
      <div className="flex flex-col gap-4 py-4 px-4 ">
        <h1 className="font-semibold text-xl text-gray-800">Key Indicators</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative p-4 rounded-lg flex flex-col gap-4 bg-gradient-to-r from-blue-200 to-cyan-300">
            <div className="flex items-center gap-3 text-blue-900">
              <span className="absolute top-3 right-6">
                <ContentPasteOffOutlinedIcon
                  style={{ fontSize: "3rem", opacity: "0.1" }}
                />
              </span>
              <h2 className="text-2xl font-bold">Doctor Average</h2>
            </div>
            <div className="flex justify-between items-center text-blue-900">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Daily Average</span>
                <span className="text-2xl font-bold text-center">
                  {dailyAvgDocVisit}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Monthly Average</span>
                <span className="text-2xl font-bold text-center">
                  {monthlyAvgDocVisit}
                </span>
              </div>
            </div>
          </div>

          <div className=" relative p-4 rounded-lg flex flex-col gap-4 bg-gradient-to-r from-teal-200 to-teal-500">
            <div className="flex items-center gap-3 text-teal-900">
              <span className="absolute top-3 right-6 text-xl">
                <ScienceOutlinedIcon
                  style={{ fontSize: "3rem", opacity: "0.1" }}
                />
              </span>
              <h2 className="text-2xl font-bold">Chemist Average</h2>
            </div>
            <div className="flex justify-between items-center text-teal-900">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Daily Average</span>
                <span className="text-2xl font-bold text-center">
                  {dailyAvgChecmist}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">Monthly Average</span>
                <span className="text-2xl font-bold text-center">
                  {monthlyAvgChecmist}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> 
      */}
    </div>
  );
}
