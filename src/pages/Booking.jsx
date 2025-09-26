import React, { useState, useEffect, useMemo } from "react";
import { Eye, Trash, X } from "lucide-react";
import DashboardWrapper from "../components/dashboardlayout";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "https://okellobackend-production.up.railway.app/booking";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setBookings(res.data.data.map(b => ({ ...b, id: b._id })));
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      alert("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery)
      )
      .sort((a, b) => {
        if (sortOrder === "asc") return new Date(a.date) - new Date(b.date);
        return new Date(b.date) - new Date(a.date);
      });
  }, [bookings, searchQuery, sortOrder]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setBookings(bookings.filter((b) => b.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to delete booking.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("No bookings selected!");
    if (!window.confirm("Are you sure you want to delete selected bookings?")) return;

    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_BASE}/${id}`)));
      setBookings(bookings.filter(b => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete selected bookings:", err);
      alert("Failed to delete selected bookings.");
    }
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setModalOpen(false);
  };

  return (
    <DashboardWrapper>
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search bookings..."
              className="border rounded-lg p-2 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border rounded-lg p-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Date ↑</option>
              <option value="desc">Date ↓</option>
            </select>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="relative bg-white shadow-lg rounded-2xl p-5 overflow-hidden border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg line-clamp-1">{booking.name}</h2>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelect(booking.id)}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">{booking.email}</p>
                  <p className="text-gray-500 text-sm">{booking.phone}</p>
                  <p className="text-gray-500 text-sm font-medium">{booking.service}</p>

                  <div className="flex justify-start items-center gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{booking.date}</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{booking.time}</span>
                  </div>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{booking.message}</p>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex justify-center items-center gap-4 opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                    <button
                      onClick={() => handleOpenModal(booking)}
                      className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && selectedBooking && (
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
                className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-2xl"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                <div className="flex flex-col gap-2">
                  <p><strong>Name:</strong> {selectedBooking.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                  <p><strong>Service:</strong> {selectedBooking.service}</p>
                  <p><strong>Date:</strong> {selectedBooking.date}</p>
                  <p><strong>Time:</strong> {selectedBooking.time}</p>
                  <p><strong>Message:</strong> {selectedBooking.message}</p>
                  <p className="text-gray-400 text-sm mt-2">ID: {selectedBooking.id}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  );
};

export default BookingsPage;
