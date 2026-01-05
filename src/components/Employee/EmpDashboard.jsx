import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";

import LOGO from "../../assets/ELVIRA LOGO.png";
import PERSON from "../../assets/asset4.jpg";

//importing icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { useLocation, Outlet, useNavigate } from "react-router-dom";

//importing icons
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SearchIcon from "@mui/icons-material/Search";
import { BiTrip } from "react-icons/bi";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Download } from "lucide-react";
import { ChartColumnBig } from "lucide-react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function EmpDashboard() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openLeave, setOpenLeave] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);

  const isActive = (pathname) => {
    return location.pathname.includes(pathname);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavigate = (pathname) => {
    setIsMenuOpen(true);
    navigate(pathname);
  };

  const handleNavigateAddDoc = (pathname) => {
    setIsMenuOpen(true);
    navigate(pathname);
  };

  const sidebarRef = useRef(null);

  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }

    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsMenuOpen(true);
    }
  };

  const getName = (name) => {
    if (!name) return "Unknown";
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-lightgray">
      <div className="fixed bg-white z-40 top-0 right-0 left-0 md:h-24 h-20 flex items-center">
        <div
          className={`${isMenuOpen ? "md:w-72" : "md:w-28"
            } w-28 duration-300 transition-all px-5 h-full flex items-center gap-2`}
        >
          {isMenuOpen ? (
            <img className="md:w-36  md:h-14 h-8" alt="logo" src={LOGO}></img>
          ) : (
            <span className="text-2xl text-green-500">Elvira</span>
          )}
        </div>
        <div className="flex justify-between px-2 md:px-8 h-full w-full items-center">
          <div className="flex items-center gap-3">
            <span
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-themeblue cursor-pointer"
            >
              {isMenuOpen ? (
                <MenuIcon style={{ fontSize: "2rem" }}></MenuIcon>
              ) : (
                <ArrowRightAltIcon
                  style={{ fontSize: "2rem" }}
                ></ArrowRightAltIcon>
              )}
            </span>
            <span className="text-2xl md:block hidden font-bold">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 md:gap-8">
              <span className="bg-gray-100 text-themeblue rounded-md flex justify-center items-center w-12 h-12">
                <NotificationsNoneOutlinedIcon
                  style={{ fontSize: "1.8rem" }}
                ></NotificationsNoneOutlinedIcon>
              </span>
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative flex cursor-pointer items-center gap-3"
              >
                {/* <img
                className="w-12 h-12 rounded-full"
                src={PERSON}
                alt="profile"
              ></img> */}
                <div className="w-12 h-12 rounded-full flex justify-center items-center  bg-blue-600 text-gray-200 font-bold">
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </div>
                <div className="md:flex hidden flex-col">
                  <h4 className="text-base leading-4 font-bold">
                    {getName(user?.firstName)}
                  </h4>
                  <h4 className="text-sm">
                    {user?.isAdmin ? "Admin" : "Member"}
                  </h4>
                </div>
                {isProfileOpen && (
                  <div
                    ref={popupRef}
                    className="absolute z-40 w-36 md:w-48 shadow rounded-md border bg-white top-[120%] right-0 flex flex-col "
                  >
                    <Link to="/employee/profile">
                      <div className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500">
                        <span className="text-blue-500">
                          <AccountCircleIcon></AccountCircleIcon>
                        </span>{" "}
                        Profile
                      </div>
                    </Link>
                    <div
                      onClick={logoutUser}
                      className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500"
                    >
                      <span className="text-red-500">
                        <LogoutIcon></LogoutIcon>
                      </span>{" "}
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="w-full relative flex md:mt-24 mt-20">
        {/* Sidebar For Web screen */}
        <div
          className={`${isMenuOpen ? "w-72" : "w-28"
            } z-40 md:block hidden transition-all duration-300 shadow-lg bg-white`}
        >
          <div
            onClick={() => handleNavigate("dashboard")}
            className={`group flex ${isActive("dashboard") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("dashboard")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <DashboardOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></DashboardOutlinedIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("dashboard") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                Dashboard
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavigate("doctors")}
            className={`group flex ${isActive("doctors") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("doctors")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <LocalHospitalOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></LocalHospitalOutlinedIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("doctors") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                Map Doctors
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavigate("addDoctors")}
            className={`group flex ${isActive("addDoctors") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("addDoctors")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <LocalHospitalOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></LocalHospitalOutlinedIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("addDoctors") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                Add Doctors
              </span>
            )}
          </div>

          <div
            onClick={() => handleNavigate("chemists")}
            className={`group flex ${isActive("chemists") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("chemists")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <ScienceOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></ScienceOutlinedIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("chemist") && "text-themeblue"
                  } group-hover:text-themeblue font-medium  text-lg`}
              >
                Map Chemist
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavigate("addChemist")}
            className={`group flex ${isActive("addChemist") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("addChemist")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <ScienceOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></ScienceOutlinedIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("addChemist") && "text-themeblue"
                  } group-hover:text-themeblue font-medium  text-lg`}
              >
                Add Chemist
              </span>
            )}
          </div>
          <div
            onClick={() => handleNavigate("myteam")}
            className={`group flex ${isActive("myteam") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("myteam")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <PersonOutlineIcon
                style={{ fontSize: "1.5rem" }}
              ></PersonOutlineIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("myteam") && "text-themeblue"
                  } group-hover:text-themeblue font-medium  text-lg`}
              >
                My Team
              </span>
            )}
          </div>

          {user.designation !== "6" ? (
            <div className="relative">
              <div
                onClick={() => setOpenLeave((prev) => !prev)}
                className={`group flex ${isActive("leaves") && "bg-blue-50 border-r-2 border-themeblue"
                  } hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${isActive("leaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <ExitToAppIcon
                      style={{ fontSize: "1.5rem" }}
                    ></ExitToAppIcon>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("leaves") && "text-themeblue"
                        } group-hover:text-themeblue font-medium  text-lg`}
                    >
                      Leaves
                    </span>
                  )}
                </div>
                {isMenuOpen && (
                  <span className="text-gray-700">
                    {openLeave ? (
                      <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                    ) : (
                      <ChevronRightIcon></ChevronRightIcon>
                    )}
                  </span>
                )}
              </div>
              <div
                className={`px-2 flex flex-col ${openLeave ? "h-20" : "h-0"
                  } transition-all duration-300 overflow-hidden`}
              >
                <div
                  onClick={() => handleNavigate("myleaves")}
                  className={`group flex ${isActive("myleaves") && "text-blue-600"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("myleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("myleaves") && "text-themeblue"
                        } group-hover:text-themeblue font-medium`}
                    >
                      My Leaves
                    </span>
                  )}
                </div>
                <div
                  onClick={() => handleNavigate("pendingleaves")}
                  className={`group flex ${isActive("pendingleaves") && "text-blue-600"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("pendingleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("pendingleaves") && "text-themeblue"
                        } group-hover:text-themeblue font-medium`}
                    >
                      Pending On Me
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleNavigate("myleaves")}
              className={`group flex ${isActive("myleaves") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("myleaves")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <ExitToAppIcon style={{ fontSize: "1.5rem" }}></ExitToAppIcon>
              </span>
              {isMenuOpen && (
                <span
                  className={`${isActive("leaves") && "text-themeblue"
                    } group-hover:text-themeblue font-medium  text-lg`}
                >
                  Leaves
                </span>
              )}
            </div>
          )}

          {user.designation !== "6" ? (
            <div className="relative">
              <div
                onClick={() => setOpenPlan((prev) => !prev)}
                className={`group flex ${isActive("plan") && "bg-blue-50 border-r-2 border-themeblue"
                  } hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${isActive("plan")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <BiTrip style={{ fontSize: "1.5rem" }}></BiTrip>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("plan") && "text-themeblue"
                        } group-hover:text-themeblue font-medium  text-lg`}
                    >
                      Tour Plans
                    </span>
                  )}
                </div>
                {isMenuOpen && (
                  <span className="text-gray-700">
                    {openPlan ? (
                      <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                    ) : (
                      <ChevronRightIcon></ChevronRightIcon>
                    )}
                  </span>
                )}
              </div>
              <div
                className={`px-2 flex flex-col ${openPlan ? "h-30" : "h-0"
                  } transition-all duration-300 overflow-hidden`}
              >
                <div
                  onClick={() => handleNavigate("mtpplan")}
                  className={`group flex ${isActive("mtpplan") && "text-blue-600"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("mtpplan")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("mtpplan") && "text-themeblue"
                        } group-hover:text-themeblue font-medium`}
                    >
                      Reporting and Plan
                    </span>
                  )}
                </div>
                <div
                  onClick={() => handleNavigate("pendingmtp")}
                  className={`group flex ${isActive("pendingmtp") && "text-blue-600"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("pendingmtp")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  {isMenuOpen && (
                    <span
                      className={`${isActive("pendingmtp") && "text-themeblue"
                        } group-hover:text-themeblue font-medium`}
                    >
                      DCR Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleNavigate("mtpplan")}
              className={`group flex ${isActive("mtpplan") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("mtpplan")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <BiTrip style={{ fontSize: "1.5rem" }}></BiTrip>
              </span>
              {isMenuOpen && (
                <span
                  className={`${isActive("leaves") && "text-themeblue"
                    } group-hover:text-themeblue font-medium  text-lg`}
                >
                  Reporting and Plan
                </span>
              )}
            </div>
          )}

          {user.designation !== "6" && (
            <div
              onClick={() => handleNavigate("download")}
              className={`group flex ${isActive("download") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("download")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <Download className="w-5 h-5"></Download>
              </span>
              {isMenuOpen && (
                <span
                  className={`${isActive("download") && "text-themeblue"
                    } group-hover:text-themeblue font-medium  text-lg`}
                >
                  Download Report
                </span>
              )}
            </div>
          )}

          {/* <div
            onClick={() => handleNavigate("expensereport")}
            className={`group flex ${isActive("expensereport") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("expensereport")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <Download
                style={{ fontSize: "1.5rem" }}
              ></Download>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("expensereport") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                Expenses Report
              </span>
            )}
          </div> */}

          {/* <div
            onClick={() => handleNavigate("errorlogs")}
            className={`group flex ${isActive("errorlogs") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("errorlogs")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <ErrorOutlineIcon
                style={{ fontSize: "1.5rem" }}
              ></ErrorOutlineIcon>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("errorlogs") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                error logs
              </span>
            )}
          </div> */}

          <div
            onClick={() => handleNavigate("expense")}
            className={`group flex ${isActive("expense") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("expense")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <ChartColumnBig className="w-5 h-5"></ChartColumnBig>
            </span>
            {isMenuOpen && (
              <span
                className={`${isActive("expense") && "text-themeblue"
                  } group-hover:text-themeblue font-medium  text-lg`}
              >
                Expense
              </span>
            )}
          </div>
        </div>


        <div
          ref={sidebarRef}
          className={`${isMenuOpen ? "-left-96" : "left-0"
            } z-40 w-64 bottom-0 top-0 md:hidden absolute transition-all duration-300 shadow-lg bg-white`}
        >
          <div
            onClick={() => handleNavigate("dashboard")}
            className={`group flex ${isActive("dashboard") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("dashboard")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <DashboardOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></DashboardOutlinedIcon>
            </span>
            <span
              className={`${isActive("dashboard") && "text-themeblue"
                } group-hover:text-themeblue font-medium text-lg`}
            >
              Dashboard
            </span>
          </div>
          <div
            onClick={() => handleNavigate("doctors")}
            className={`group flex ${isActive("doctors") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("doctors")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <LocalHospitalOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></LocalHospitalOutlinedIcon>
            </span>
            <span
              className={`${isActive("doctors") && "text-themeblue"
                } group-hover:text-themeblue font-medium text-lg`}
            >
              Doctors
            </span>
          </div>
          <div
            onClick={() => handleNavigate("chemists")}
            className={`group flex ${isActive("chemists") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("chemists")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <ScienceOutlinedIcon
                style={{ fontSize: "1.5rem" }}
              ></ScienceOutlinedIcon>
            </span>
            <span
              className={`${isActive("chemists") && "text-themeblue"
                } group-hover:text-themeblue font-medium  text-lg`}
            >
              Chemist
            </span>
          </div>
          <div
            onClick={() => handleNavigate("myteam")}
            className={`group flex ${isActive("myteam") && "bg-blue-50 border-r-2 border-themeblue"
              } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
          >
            <span
              className={`${isActive("myteam")
                ? "text-themeblue"
                : "text-gray-700 group-hover:text-themeblue"
                } `}
            >
              <PersonOutlineIcon
                style={{ fontSize: "1.5rem" }}
              ></PersonOutlineIcon>
            </span>
            <span
              className={`${isActive("myteam") && "text-themeblue"
                } group-hover:text-themeblue font-medium  text-lg`}
            >
              My Team
            </span>
          </div>
          {user.designation !== "6" ? (
            <div className="relative">
              <div
                onClick={() => setOpenLeave((prev) => !prev)}
                className={`group flex ${isActive("leaves") && "bg-blue-50 border-r-2 border-themeblue"
                  } hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${isActive("myleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <ExitToAppIcon
                      style={{ fontSize: "1.5rem" }}
                    ></ExitToAppIcon>
                  </span>
                  <span
                    className={`${isActive("myleaves") && "text-themeblue"
                      } group-hover:text-themeblue font-medium  text-lg`}
                  >
                    Leaves
                  </span>
                </div>
                <span className="text-gray-700">
                  {openLeave ? (
                    <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                  ) : (
                    <ChevronRightIcon></ChevronRightIcon>
                  )}
                </span>
              </div>
              <div
                className={`flex flex-col ${openLeave ? "h-20" : "h-0"
                  } px-2 transition-all duration-300 overflow-hidden`}
              >
                <div
                  onClick={() => handleNavigate("myleaves")}
                  className={`group flex ${isActive("myleaves") && "text-themeblue"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("myleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  <span
                    className={`${isActive("myleaves") && "text-themeblue"
                      } group-hover:text-themeblue font-medium`}
                  >
                    My Leaves
                  </span>
                </div>
                <div
                  onClick={() => handleNavigate("pendingleaves")}
                  className={`group flex ${isActive("pendingleaves") && "text-themeblue"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("pendingleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  <span
                    className={`${isActive("pendingleaves") && "text-themeblue"
                      } group-hover:text-themeblue font-medium`}
                  >
                    Pending On Me
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleNavigate("myleaves")}
              className={`group flex ${isActive("myleaves") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("myleaves")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <ExitToAppIcon style={{ fontSize: "1.5rem" }}></ExitToAppIcon>
              </span>
              <span
                className={`${isActive("myleaves") && "text-themeblue"
                  } group-hover:text-themeblue font-medium  text-lg`}
              >
                Leaves
              </span>
            </div>
          )}
          {user.designation !== "6" ? (
            <div className="relative">
              <div
                onClick={() => setOpenPlan((prev) => !prev)}
                className={`group flex ${isActive("plan") && "bg-blue-50 border-r-2 border-themeblue"
                  } hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${isActive("myleaves")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <BiTrip style={{ fontSize: "1.5rem" }}></BiTrip>
                  </span>
                  <span
                    className={`${isActive("myleaves") && "text-themeblue"
                      } group-hover:text-themeblue font-medium  text-lg`}
                  >
                    Tour Plans
                  </span>
                </div>
                <span className="text-gray-700">
                  {openPlan ? (
                    <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                  ) : (
                    <ChevronRightIcon></ChevronRightIcon>
                  )}
                </span>
              </div>
              <div
                className={`flex flex-col ${openPlan ? "h-30" : "h-0"
                  } px-2 transition-all duration-300 overflow-hidden`}
              >
                <div
                  onClick={() => handleNavigate("mtpplan")}
                  className={`group flex ${isActive("mtpplan") && "text-themeblue"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("mtpplan")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  <span
                    className={`${isActive("mtpplan") && "text-themeblue"
                      } group-hover:text-themeblue font-medium`}
                  >
                    MTP Plan
                  </span>
                </div>
                <div
                  onClick={() => handleNavigate("pendingmtp")}
                  className={`group flex ${isActive("pendingmtp") && "text-themeblue"
                    } hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}
                >
                  <span
                    className={`${isActive("pendingmtp")
                      ? "text-themeblue"
                      : "text-gray-700 group-hover:text-themeblue"
                      } `}
                  >
                    <HorizontalRuleIcon
                      style={{ fontSize: "1.5rem" }}
                    ></HorizontalRuleIcon>
                  </span>
                  <span
                    className={`${isActive("pendingmtp") && "text-themeblue"
                      } group-hover:text-themeblue font-medium`}
                  >
                    DCR Pending
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleNavigate("mtpplan")}
              className={`group flex ${isActive("mtpplan") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("mtpplan")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <BiTrip style={{ fontSize: "1.5rem" }}></BiTrip>
              </span>
              <span
                className={`${isActive("mtpplan") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                MTP Plan
              </span>
            </div>
          )}
          {user.designation !== "6" && (
            <div
              onClick={() => handleNavigate("download")}
              className={`group flex ${isActive("download") && "bg-blue-50 border-r-2 border-themeblue"
                } hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}
            >
              <span
                className={`${isActive("download")
                  ? "text-themeblue"
                  : "text-gray-700 group-hover:text-themeblue"
                  } `}
              >
                <Download className="w-5 h-5"></Download>
              </span>
              <span
                className={`${isActive("download") && "text-themeblue"
                  } group-hover:text-themeblue font-medium text-lg`}
              >
                Download Report
              </span>
            </div>
          )}
        </div>
        {/* Outlate */}
        <div className="w-full md:px-6 px-4 py-2 md:py-4 overflow-y-auto ">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
