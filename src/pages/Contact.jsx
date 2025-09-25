// src/pages/ContactsPage.jsx
import React, { useState, useMemo } from "react";
import { Eye, Trash, X } from "lucide-react";
import DashboardWrapper from "../components/dashboardlayout";
import { motion, AnimatePresence } from "framer-motion";

const dummyContacts = [
  { id: 1, name: "John Doe", email: "john@example.com", message: "Hello, I need help.", phone: "123-456-7890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Inquiry about your services.", phone: "987-654-3210" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", message: "Just saying hi!" },
  { id: 4, name: "Alice Cooper", email: "alice@example.com", message: "Support needed." },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", message: "Feedback on website." },
];

const ContactsPage = () => {
  const [contacts, setContacts] = useState(dummyContacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filtered & Sorted contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "asc") return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      });
  }, [contacts, searchQuery, sortOrder]);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("No contacts selected!");
    if (window.confirm("Are you sure you want to delete selected contacts?")) {
      setContacts(contacts.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search contacts..."
              className="border rounded-lg p-2 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border rounded-lg p-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition relative border ${
                selectedIds.includes(contact.id) ? "border-blue-500" : ""
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg line-clamp-1">{contact.name}</h2>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                  />
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">{contact.email}</p>
                <p className="text-gray-500 text-sm line-clamp-2">{contact.message}</p>
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
                  <p className="text-gray-400 text-sm mt-2">ID: {selectedContact.id}</p>
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
