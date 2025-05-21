import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess } from "../redux/actions/authActions";
import axios from "axios";

//Importing images
import LOGO from "../assets/ELVIRA LOGO.png";
import IMG from "../assets/asset1.png";

//Importing icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateData = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      valid = false;
      toast.error("Please enter email address.");
    } // } else if (!emailRegex.test(formData.email)) {
    //   valid = false;
    //   toast.error("Email address is invalid.");
    // }
    if (!formData.password) {
      valid = false;
      toast.error("Please enter password.");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData()) {
      setLoading(true);
      dispatch(loginStart);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/Auth/login`,
          {
            username: formData.email,
            password: formData.password,
          }
        );

        dispatch(loginSuccess(response.data));
        setFormData({ email: "", password: "" });
        if (response.data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      } catch (err) {
        console.log(err);
        toast.error("Username or Password is incorrect.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full md:h-screen flex md:flex-row flex-col items-center">
      {/* first section */}
      <div className="md:w-1/2 w-full flex md:absolute top-0 left-0 pentagon h-2/3 md:h-full overflow-hidden py-8 md:py-24 px-4 flex-col bg-white gap-10 md:gap-24">
        <div className="flex flex-col gap-2 md:gap-6 items-center md:items-start md:pl-36">
          <div className="flex justify-center pl-4 items-center gap-2">
            <img className="md:w-[200px] w-12 " src={LOGO} alt="logo" />
          </div>
          <div className="flex flex-col gap-1 md:gap-2 items-center">
            <h1 className="text-purple text-xl md:text-2xl font-medium">
              Welcome Black
            </h1>
            <p className="text-sm md:text-base text-gray-600 text-center">
              User Experience & Interface Design <br />
              Strategy SaaS Solutions
            </p>
          </div>
        </div>
        <div className="md:pl-16 flex items-center md:place-content-start place-content-center">
          <img className="w-72 md:w-96" src={IMG} alt="login-image"></img>
        </div>
      </div>

      {/* second section */}
      <div className="w-full flex place-content-center md:place-content-end md:h-screen bg-lightgray">
        <div className="md:w-1/2 w-full py-10 md:h-screen flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="flex md:w-8/12 w-4/5 flex-col gap-5"
          >
            <h1 className="md:text-3xl text-2xl font-medium mb-2 text-center">
              Sign in your account
            </h1>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-lg font-medium text-gray-600"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                onChange={handleChange}
                id="email"
                name="email"
                type="text"
                value={formData.email}
                placeholder="demo@example.com"
                className="outline-none bg-white px-2 py-4 shadow rounded-md"
              ></input>
            </div>
            <div className="relative flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-lg font-medium text-gray-600"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                onChange={handleChange}
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className="outline-none bg-white px-2 py-4 shadow rounded-md"
              ></input>
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-700 cursor-pointer absolute right-4 top-12"
              >
                {showPassword ? (
                  <VisibilityIcon
                    style={{ fontSize: "1.3rem" }}
                  ></VisibilityIcon>
                ) : (
                  <VisibilityOffIcon
                    style={{ fontSize: "1.3rem" }}
                  ></VisibilityOffIcon>
                )}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`relative flex items-center justify-center px-6 py-2 text-white font-semibold rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading && (
                <svg
                  className="w-5 h-5 animate-spin mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Loading..." : "Login"}
            </button>
            <div className="flex place-content-end">
              <Link to={"/forget-password"}>
                <span className="text-blue-500 cursor-pointer">
                  Forget your password ?
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
