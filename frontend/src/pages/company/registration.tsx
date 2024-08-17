import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const CompanyRegistration: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [noOfEmployes, setNoOfEmployes] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const company = localStorage.getItem("companyData");
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      navigate("/company/");
    }
  }, [company, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{':;?/>.<,])(?=.*[0-9]).{8,}$/;
    if (!pattern.test(password)) {
      setError(
        "Password should start with a capital letter, contain at least one special character, and have at least one number. Minimum length is 8 characters."
      );
      return;
    } else {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
        AxiosInstance.post(
          "company/registration",
          { companyName, companyType, phoneNo, noOfEmployes, email, password },
          {
            withCredentials: true, // Send cookies and headers with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res: AxiosResponse<{ message: string }>) => {
            console.log(res.status);
            if (res.status === 200) {
              navigate("/company/register/verifyOtp");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
  return (
    <div className=" max-w-2xl mx-auto bg-baseBaground bg-opacity-[15%] shadow-custom-black scale-95  rounded-[2%]   p-16">
      <div className="flex">
        <h3 className="text-violet text-3xl font-extrabold max-md:text-center mb-7">
          Register
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="companyName"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Company name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              className="border text-sm rounded-lg  block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none"
              onChange={e => {
                setCompanyName(e.target.value);
              }}
              placeholder="Company name"
              required
              pattern="[A-Z][a-zA-Z ]*"
              title="First letter should be capital, can have spaces."
            />
          </div>
          <div>
            <label
              htmlFor="companyType"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Company type
            </label>
            <select
              id="companyType"
              className="border text-sm rounded-lg block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none "
              onChange={e => setCompanyType(e.target.value)}
            >
              <option value="" className="bg-transparent text-gray-800">
                Select Company Type
              </option>
              <option value="service" className="bg-transparent text-gray-800">
                Service-based
              </option>
              <option value="product" className="bg-transparent text-gray-800">
                Product-based
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phoneNo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Phone number
            </label>
            <input
              type="text"
              id="phoneNo"
              value={phoneNo}
              className="border text-sm rounded-lg  block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none"
              onChange={e => setPhoneNo(e.target.value)}
              placeholder=""
              pattern="[0-9]{10}"
              required
              title="Phone number should contain 10 digits."
            />
          </div>
          <div>
            <label
              htmlFor="noOfEmployes"
              className="block mb-2 text-sm font-medium  text-gray-300"
            >
              Number of employees
            </label>
            <input
              type="text"
              id="noOfEmployes"
              value={noOfEmployes}
              className="border text-sm rounded-lg  block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none "
              onChange={e => setNoOfEmployes(e.target.value)}
              placeholder=""
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            className="border text-sm rounded-lg  block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none"
            onChange={e => setEmail(e.target.value)}
            placeholder="sample@company.com"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
          <input
            type={showPassword === false ? "password" : "text"}
            id="password"
            value={password}
            className="border text-sm rounded-lg  block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none"
            onChange={e => setPassword(e.target.value)}
            placeholder="•••••••••"
            required
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{':;?/>.<,])(?=.*[0-9]).{5,}$"
            title="Password should start with a capital letter, contain at least one special character, and have at least one number. Minimum length is 5 characters."
          />
          <FontAwesomeIcon className="absolute right-4 top-3 text-white" icon={showPassword===false?faEye:faEyeSlash} onClick={()=>setShowPassword(!showPassword)} />
          </div>
          
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword === false ? "password" : "text"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              className="border text-sm rounded-lg block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:outline-none"
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="•••••••••"
              required
              title="Password should match the above password."
            />
            <FontAwesomeIcon
              className="absolute right-4 top-3 text-white"
              icon={showConfirmPassword === false ? faEye : faEyeSlash}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {passwordError && (
            <span className="text-red-500 text-sm">{passwordError}</span>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <button
          type="submit"
          className="text-white bg-violet focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompanyRegistration;
