// src/pages/GalleryPage.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Eye, X, Play } from "lucide-react";
import DashboardWrapper from "../components/dashboardlayout";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "https://okellobackend-production.up.railway.app/gallery";

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Fetch gallery
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setGalleryItems(
        res.data.data.map((item) => ({ ...item, id: item._id }))
      );
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      alert("Failed to fetch gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Modal handlers
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setPreviewImage(item ? encodeURI(item.src) : "");
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setModalType("");
    setPreviewImage("");
  };

  // Add gallery
  const handleAddGallery = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newItem = {
      type: form.type.value,
      category: form.category.value,
      src: form.src.value.trim(),
      height: form.height.value || "300px",
    };
    try {
      const res = await axios.post(API_BASE, newItem);
      setGalleryItems([{ ...res.data.data, id: res.data.data._id }, ...galleryItems]);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to add gallery item:", err);
      alert("Failed to add gallery item. Make sure all fields are filled correctly.");
    }
  };

  // Edit gallery
  const handleEditGallery = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedItem = {
      type: form.type.value,
      category: form.category.value,
      src: form.src.value.trim(),
      height: form.height.value || "300px",
    };
    try {
      const res = await axios.put(`${API_BASE}/${selectedItem.id}`, updatedItem);
      setGalleryItems(
        galleryItems.map((item) =>
          item.id === selectedItem.id ? { ...res.data.data, id: res.data.data._id } : item
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Failed to update gallery item:", err);
      alert("Failed to update gallery item.");
    }
  };

  // Delete gallery
  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete gallery item:", err);
      alert("Failed to delete gallery item.");
    }
  };

  return (
    <DashboardWrapper>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <button
            onClick={() => handleOpenModal("add")}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        {loading ? (
          <p>Loading gallery...</p>
        ) : galleryItems.length === 0 ? (
          <p>No gallery items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition relative"
              >
                {/* Image or Video */}
                {item.src ? (
                  item.type === "image" ? (
                    <img
                      src={encodeURI(item.src)}
                      alt={item.type}
                      className="w-full object-cover"
                      style={{ height: item.height || "300px" }}
                    />
                  ) : (
                    <div className="relative w-full" style={{ height: item.height || "300px" }}>
                      <video
                        src={encodeURI(item.src)}
                        muted
                        loop
                        className="w-full h-full object-cover"
                      />
                      <Play className="absolute inset-0 m-auto w-12 h-12 text-white opacity-70 pointer-events-none" />
                    </div>
                  )
                ) : null}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{item.type}</span>
                  <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{item.category}</span>
                </div>

                {/* Actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-3 flex justify-end items-start rounded-b-xl">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleOpenModal("view", item)}
                      className="text-blue-200 hover:text-blue-400 transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenModal("edit", item)}
                      className="text-yellow-300 hover:text-yellow-500 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="text-red-400 hover:text-red-600 transition"
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
                className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-2xl"
              >
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                  <X size={24} />
                </button>

                {(modalType === "add" || (modalType === "edit" && selectedItem)) && (
                  <form
                    onSubmit={modalType === "add" ? handleAddGallery : handleEditGallery}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-2xl font-bold mb-4">
                      {modalType === "add" ? "Add New Gallery Item" : "Edit Gallery Item"}
                    </h2>

                    <select
                      name="type"
                      defaultValue={selectedItem?.type || "image"}
                      className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition"
                      required
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>

                    <select
                      name="category"
                      defaultValue={selectedItem?.category || "image"}
                      className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition"
                      required
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="web">Web</option>
                    </select>

                    <input
                      type="text"
                      name="src"
                      placeholder="Image/Video URL"
                      defaultValue={selectedItem?.src || ""}
                      className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition"
                      onChange={(e) => setPreviewImage(encodeURI(e.target.value.trim()))}
                      required
                    />
                    <input
                      type="text"
                      name="height"
                      placeholder="Height (e.g., 300px)"
                      defaultValue={selectedItem?.height || "300px"}
                      className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition"
                    />

                    {previewImage && (
                      selectedItem?.type === "image" ? (
                        <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-xl mt-2 shadow-lg" />
                      ) : (
                        <video src={previewImage} className="w-full h-48 object-cover rounded-xl mt-2 shadow-lg" muted loop />
                      )
                    )}

                    <button
                      className={`text-white py-3 px-4 rounded-xl transition font-semibold ${
                        modalType === "add" ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {modalType === "add" ? "Save" : "Update"}
                    </button>
                  </form>
                )}

                {modalType === "view" && selectedItem && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.type}</h2>
                    {selectedItem.type === "image" ? (
                      <img src={encodeURI(selectedItem.src)} alt={selectedItem.type} className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg" />
                    ) : (
                      <video src={encodeURI(selectedItem.src)} controls autoPlay className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg" />
                    )}
                    <p className="text-gray-600">{selectedItem.category}</p>
                    <p className="text-gray-500 text-sm mt-1">Height: {selectedItem.height}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  );
};

export default GalleryPage;
