// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import DashboardWrapper from "../components/dashboardlayout";
import { Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const [admin, setAdmin] = useState({
    email: "admin@example.com",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally, here you'd call backend API, but we're only showing design
    console.log("Profile updated:", admin);
    handleCloseModal();
  };

  return (
    <DashboardWrapper>
      <div className=" flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>

        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Account Info</h2>
            <button
              onClick={handleOpenModal}
              className="text-blue-500 hover:text-blue-600 transition font-medium"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-800 font-medium">{admin.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Password</p>
              <p className="text-gray-800 font-medium">
                {admin.password ? "••••••••" : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start pt-20 p-4 overflow-auto"
            >
              <motion.div
                initial={{ y: -50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className="text-gray-500 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={admin.email}
                      onChange={handleChange}
                      className="border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col relative">
                    <label className="text-gray-500 text-sm mb-1">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={admin.password}
                      onChange={handleChange}
                      className="border rounded-lg p-2 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
                    Update Profile
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  );
};

export default ProfilePage;
