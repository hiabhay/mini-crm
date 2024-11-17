import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CustomerForm from "../components/DataIngestion/CustomerForm";
import OrderForm from "../components/DataIngestion/OrderForm";
import AudienceForm from "../components/DataIngestion/AudienceForm";
import CampaignList from "../components/CampaignListing/CampaignList";
import { FaUserPlus, FaClipboardList, FaUsers, FaListAlt, FaBars, FaTimes } from "react-icons/fa";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = async () => {
    await onLogout();
    navigate("/login", { replace: true });
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="w-full bg-[#432E54] text-white p-4 fixed top-0 left-0 z-20 flex justify-between items-center">
        <button
          className="p-2 rounded-full bg-[#4B4376] text-white"
          onClick={toggleNav}
        >
          {isNavOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
        <h1
          className="text-2xl font-bold text-[#E8BCB9] absolute left-1/2 transform -translate-x-1/2"
          onClick={() => navigate("/home")}
        >
          Xeno CRM
        </h1>
      </div>

      <div className="flex mt-16">
        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 h-full w-64 bg-[#432E54] text-white transition-transform duration-300 ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          } z-10`}
        >
          <div className="p-4">
            <Link
              to="/home/"
              className="block py-2 px-4 hover:bg-[#4B4376] rounded-md"
              onClick={() => setIsNavOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/home/customers"
              className="block py-2 px-4 hover:bg-[#4B4376] rounded-md"
              onClick={() => setIsNavOpen(false)}
            >
              Create Customer
            </Link>
            <Link
              to="/home/orders"
              className="block py-2 px-4 hover:bg-[#4B4376] rounded-md"
              onClick={() => setIsNavOpen(false)}
            >
              Create Order
            </Link>
            <Link
              to="/home/audience"
              className="block py-2 px-4 hover:bg-[#4B4376] rounded-md"
              onClick={() => setIsNavOpen(false)}
            >
              Create Audience
            </Link>
            <Link
              to="/home/campaigns"
              className="block py-2 px-4 hover:bg-[#4B4376] rounded-md"
              onClick={() => setIsNavOpen(false)}
            >
              Campaign List
            </Link>
            <button
              className="w-full mt-4 bg-[#AE445A] hover:bg-[#4B4376] text-white py-2 px-4 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col justify-center items-center min-h-screen p-6 bg-[#E8BCB9] transition-all duration-300 ${
            isNavOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                  <div
                    className="w-full h-80 bg-[#AE445A] rounded-lg shadow-lg p-6 text-center cursor-pointer hover:bg-[#4B4376] transition-colors flex flex-col justify-center items-center"
                    onClick={() => navigate("/home/customers")}
                  >
                    <FaUserPlus className="text-[#E8BCB9] text-5xl mb-4" />
                    <h3 className="text-2xl font-semibold text-white">
                      Create Customer
                    </h3>
                    <p className="text-[#E8BCB9] mt-4 text-sm text-center">
                    </p>
                  </div>
                  <div
                    className="w-full h-80 bg-[#AE445A] rounded-lg shadow-lg p-6 text-center cursor-pointer hover:bg-[#4B4376] transition-colors flex flex-col justify-center items-center"
                    onClick={() => navigate("/home/orders")}
                  >
                    <FaClipboardList className="text-[#E8BCB9] text-5xl mb-4" />
                    <h3 className="text-2xl font-semibold text-white">
                      Create Order
                    </h3>
                    <p className="text-[#E8BCB9] mt-4 text-sm text-center">
                    </p>
                  </div>
                  <div
                    className="w-full h-80 bg-[#AE445A] rounded-lg shadow-lg p-6 text-center cursor-pointer hover:bg-[#4B4376] transition-colors flex flex-col justify-center items-center"
                    onClick={() => navigate("/home/audience")}
                  >
                    <FaUsers className="text-[#E8BCB9] text-5xl mb-4" />
                    <h3 className="text-2xl font-semibold text-white">
                      Create Audience
                    </h3>
                    <p className="text-[#E8BCB9] mt-4 text-sm text-center">
                    </p>
                  </div>
                  <div
                    className="w-full h-80 bg-[#AE445A] rounded-lg shadow-lg p-6 text-center cursor-pointer hover:bg-[#4B4376] transition-colors flex flex-col justify-center items-center"
                    onClick={() => navigate("/home/campaigns")}
                  >
                    <FaListAlt className="text-[#E8BCB9] text-5xl mb-4" />
                    <h3 className="text-2xl font-semibold text-white">
                      Campaign List
                    </h3>
                    <p className="text-[#E8BCB9] mt-4 text-sm text-center">
                    </p>
                  </div>
                </div>
              }
            />
            <Route path="/customers" element={<CustomerForm />} />
            <Route path="/orders" element={<OrderForm />} />
            <Route path="/audience" element={<AudienceForm />} />
            <Route path="/campaigns" element={<CampaignList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
