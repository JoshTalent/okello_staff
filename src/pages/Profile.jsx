// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import DashboardWrapper from "../components/dashboardlayout";
import { Eye, EyeOff, X, Trash, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "https://okellobackend-production.up.railway.app/admin/";

const ProfilePage = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all admins from backend
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setAdmins(
        res.data.data.map((a) => ({ id: a._id, email: a.email, password: "" }))
      );
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      alert("Failed to fetch admins from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenModal = (admin) => {
    setSelectedAdmin(admin);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setSelectedAdmin({ ...selectedAdmin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PUT update admin
      await axios.put(`${API_BASE}${selectedAdmin.id}`, {
        email: selectedAdmin.email,
        password: selectedAdmin.password,
      });
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === selectedAdmin.id
            ? { ...a, email: selectedAdmin.email, password: "" }
            : a
        )
      );
      alert("Admin updated successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Error saving admin:", err);
      alert(err.response?.data?.message || "Failed to save admin.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`${API_BASE}${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      alert("Admin deleted successfully!");
    } catch (err) {
      console.error("Failed to delete admin:", err);
      alert("Failed to delete admin.");
    }
  };

  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardWrapper>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Profiles</h1>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-80 border border-gray-300">
            <Search className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p>Loading admins...</p>
        ) : filteredAdmins.length === 0 ? (
          <p className="text-gray-500">No admins found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAdmins.map((admin) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-lg rounded-2xl p-6 relative hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{admin.email}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(admin)}
                      className="text-blue-500 hover:text-blue-600 transition font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Password</p>
                    <p className="text-gray-800 font-medium">
                      {visiblePasswords[admin.id] ? admin.password : "••••••••"}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePassword(admin.id)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    {visiblePasswords[admin.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && selectedAdmin && (
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
                <h2 className="text-2xl font-bold mb-4">Update Admin</h2>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className="text-gray-500 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedAdmin.email}
                      onChange={handleChange}
                      className="border rounded-lg p-2"
                      required
                    />
                  </div>

                  <div className="flex flex-col relative">
                    <label className="text-gray-500 text-sm mb-1">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={selectedAdmin.password}
                      onChange={handleChange}
                      className="border rounded-lg p-2"
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
                    Save Changes
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
