import React, { useEffect } from "react";
import { lazy, Suspense } from "react";
import {
  Navigate,
  RouterProvider,
  useNavigate,
  createBrowserRouter,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginStart, loginFailure, logout } from "./redux/actions/authActions";
import axios from "axios";

import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./components/Admin/Dashboard";
import UpdateStourPlan from "./pages/UpdateStourPlan";
import AddNewDocUser from "./pages/AddNewDocUser";
import AddNewChemistUser from "./pages/AddNewChemistUser";
import DoctorsUser from "./pages/DoctorsUser";
import ChemistUser from "./pages/ChemistUser";
import Headquarter from "./pages/Headquarter";
import ExcelUserDownload from "./pages/ExcelUserDownload";
import ExpenseForm from "./pages/Expense";
import AddExpense from "./pages/AddExpense";
import GetExpense from "./pages/GetExpense";
import ErrorLogs from "./pages/ErrorLogs";
import ProductMaster from "./pages/ProductMaster";
const PendingLeaves = lazy(() => import("./pages/PendingLeaves"));
const MyTeam = lazy(() => import("./pages/MyTeam"));
const StourPlan = lazy(() => import("./pages/StourPlan"));
const MTP = lazy(() => import("./pages/MTP"));
const AddMtp = lazy(() => import("./pages/AddMtp"));
const PreviewEmp = lazy(() => import("./pages/PreviewEmp"));
const Report = lazy(() => import("./pages/Report"));
const PendingMtp = lazy(() => import("./pages/PendingMtp"));
const DownloadReport = lazy(() => import("./pages/DownloadReport"));

// General Components
const MyDashboard = lazy(() => import("./pages/MyDashboard"));
const Doctors = lazy(() => import("./pages/Doctors"));
const AddNewDoc = lazy(() => import("./pages/AddNewDoc"));
const Chemist = lazy(() => import("./pages/Chemist"));
const ChemistMapping = lazy(() => import("./pages/ChemistMapping"));
const DoctorMapping = lazy(() => import("./pages/DoctorMapping"));
const AddNewChemist = lazy(() => import("./pages/AddNewChemist"));
const Employee = lazy(() => import("./pages/Employee"));
const AddNewEmp = lazy(() => import("./pages/AddNewEmp"));
const Profile = lazy(() => import("./pages/Profile"));
const EditEmp = lazy(() => import("./pages/EditEmp"));
const MyLeave = lazy(() => import("./pages/MyLeave"));
const AddLeave = lazy(() => import("./pages/AddLeave"));

// Employee dashboard components
const EmpDashboard = lazy(() => import("./components/Employee/EmpDashboard"));
const AddStourPlan = lazy(() => import("./pages/AddStourPlan"));

// ProtectedRoute Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  const { user, api_token } = useSelector((state) => state.auth);

  //vallidate user
  useEffect(() => {
    const validateUser = async () => {
      dispatch(loginStart());
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/verify_token`,
          { api_token: api_token }
        );
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    };

    if (api_token) {
      validateUser();
    }
  }, [api_token, dispatch]);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isAdmin && requiredRole === "admin") {
    console.log("you are not employee");
    return <Navigate to="/employee/dashboard"></Navigate>;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user, api_token } = useSelector((state) => state.auth);

  useEffect(() => {
    const validateUser = async () => {
      dispatch(loginStart());
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/verify_token`,
          { api_token: api_token }
        );
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    };
    validateUser();
  }, []);

  //Set bearer token
  useEffect(() => {
    const token = api_token;
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [user]);

  const AppRouter = createBrowserRouter([
    {
      path: "/",
      element: !user ? (
        <Login />
      ) : (
        <Navigate to={`/${user.isAdmin ? "admin" : "employee"}/dashboard/`} />
      ),
    },
    {
      path: "/forget-password",
      element: !user ? (
        <ForgetPassword />
      ) : (
        <Navigate to={`/${user.isAdmin ? "admin" : "employee"}/dashboard/`} />
      ),
    },
    {
      path: "/reset-password",
      element: !user ? (
        <ResetPassword />
      ) : (
        <Navigate to={`/${user.isAdmin ? "admin" : "employee"}/dashboard/`} />
      ),
    },
    {
      path: "/",
      element: !user ? (
        <Login />
      ) : (
        <Navigate to={`/${user.isAdmin ? "admin" : "employee"}/errorlogs/`} />
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="admin">
          <Dashboard></Dashboard>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <MyDashboard></MyDashboard>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "errorlogs",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <ErrorLogs />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "doctors",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Doctors></Doctors>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "doctors/addnew",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddNewDoc></AddNewDoc>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "chemists",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Chemist></Chemist>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "chemists/addnew",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddNewChemist></AddNewChemist>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "employee",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Employee></Employee>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "employee/addnew",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddNewEmp></AddNewEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "employee/edit",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <EditEmp></EditEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "employee/preview",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <PreviewEmp></PreviewEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Profile></Profile>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myleaves",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <MyLeave></MyLeave>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myleaves/add",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddLeave></AddLeave>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "pendingleaves",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <PendingLeaves></PendingLeaves>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myteam",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <MyTeam></MyTeam>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myteam/preview",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <PreviewEmp></PreviewEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "stpplan",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <StourPlan></StourPlan>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "stpplan/add",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddStourPlan></AddStourPlan>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "stpplan/update/:id",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <UpdateStourPlan></UpdateStourPlan>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "mtpplan",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <MTP></MTP>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "mtpplan/add",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <AddMtp></AddMtp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "pendingmtp",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <PendingMtp></PendingMtp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "chemistmapping",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <ChemistMapping></ChemistMapping>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "doctormapping",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <DoctorMapping></DoctorMapping>
              </Suspense>
            </ProtectedRoute>
          ),
        },

        {
          path: "report",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Report></Report>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "getExpense",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <GetExpense></GetExpense>
              </Suspense>
            </ProtectedRoute>
          ),
        },

        {
          path: "productMaster",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <ProductMaster></ProductMaster>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        // GetExpense
        {
          path: "download",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <DownloadReport></DownloadReport>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "headquarter",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <Headquarter></Headquarter>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "excelUser",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Suspense fallback={<div>Loading...</div>}>
                <ExcelUserDownload></ExcelUserDownload>
              </Suspense>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/employee",
      element: (
        <ProtectedRoute requiredRole="employee">
          <Suspense fallback={<div>Loading...</div>}>
            <EmpDashboard></EmpDashboard>
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <MyDashboard></MyDashboard>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "errorlogs",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <ErrorLogs />
              </Suspense>
            </ProtectedRoute>
          ),
        },

        {
          path: "doctors",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <Doctors></Doctors>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: 'doctors/addnew',
          element: (
            <ProtectedRoute requiredRole="employee">
              <AddNewDocUser></AddNewDocUser>
            </ProtectedRoute>
          )
        },
        {
          path: "addDoctors",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <DoctorsUser></DoctorsUser>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "chemists",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <Chemist></Chemist>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "addChemist",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <ChemistUser></ChemistUser>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: 'chemists/addnew',
          element: (
            <ProtectedRoute requiredRole="employee">
              <AddNewChemistUser></AddNewChemistUser>
            </ProtectedRoute>
          )
        },
        {
          path: "myteam",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <MyTeam></MyTeam>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myteam/addnew",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <AddNewEmp></AddNewEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myteam/edit",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <EditEmp></EditEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myteam/preview",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <PreviewEmp></PreviewEmp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <Profile></Profile>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myleaves",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <MyLeave></MyLeave>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "myleaves/add",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <AddLeave></AddLeave>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "pendingleaves",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <PendingLeaves></PendingLeaves>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "mtpplan",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <MTP></MTP>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "mtpplan/add",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <AddMtp></AddMtp>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "pendingmtp",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <PendingMtp></PendingMtp>
              </Suspense>
            </ProtectedRoute>
          ),
        },

        {
          path: "download",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <DownloadReport></DownloadReport>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "excelUser",
          element: (
            <ProtectedRoute requiredRole="excelUser">
              <Suspense fallback={<div>Loading...</div>}>
                <ExcelUserDownload></ExcelUserDownload>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "expense",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <ExpenseForm></ExpenseForm>
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "expense/addExpense",
          element: (
            <ProtectedRoute requiredRole="employee">
              <Suspense fallback={<div>Loading...</div>}>
                <AddExpense />
              </Suspense>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/errorlogs",
      element: <ErrorLogs />
    }
  ]);

  return (
    <div className="max-w-[100vw] max-h-screen">
      <ToastContainer></ToastContainer>
      <RouterProvider router={AppRouter}></RouterProvider>
    </div>
  );
}

export default App;
