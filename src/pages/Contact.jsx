// src/pages/ContactsPage.jsx
import React, { useState, useEffect } from "react";
import { Eye, Trash, X } from "lucide-react";
import DashboardWrapper from "../components/dashboardlayout";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "https://okellobackend-production.up.railway.app/contact";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch contacts (no auth required)
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setContacts(res.data.data.map((c) => ({ ...c, id: c._id })));
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      alert("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete single contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete contact");
      console.error(err);
    }
  };

  // Modal functions
  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedContact(null);
    setModalOpen(false);
  };

  return (
    <DashboardWrapper>
      <div className="p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>

        {loading ? (
          <p>Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition relative border"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">{contact.name}</h2>
                  </div>
                  <p className="text-gray-500 text-sm">{contact.email}</p>
                  <p className="text-gray-500 text-sm">{contact.message}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleOpenModal(contact)}
                      className="text-blue-500 hover:text-blue-600 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && selectedContact && (
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
                <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Name:</strong> {selectedContact.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedContact.email}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedContact.message}
                  </p>
                  {selectedContact.phone && (
                    <p>
                      <strong>Phone:</strong> {selectedContact.phone}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mt-2">
                    ID: {selectedContact.id}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  );
};

export default ContactsPage;
