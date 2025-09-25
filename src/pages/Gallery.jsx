// src/pages/GalleryPage.jsx
import React, { useState } from "react";
import { Plus, Edit, Trash, Eye, X } from "lucide-react";
import DashboardWrapper from "../components/dashboardlayout";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const dummyGallery = [
  { id: 1, title: "Beautiful Landscape", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80", description: "A scenic view of mountains", height: "400px" },
  { id: 2, title: "City Life", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=80", description: "Busy city streets at night", height: "350px" },
  { id: 3, title: "Forest Trail", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80", description: "A calm path in the woods", height: "380px" },
];

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState(dummyGallery);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setPreviewImage(item ? item.image : "");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setModalType("");
    setPreviewImage("");
  };

  const handleAddGallery = (e) => {
    e.preventDefault();
    const form = e.target;
    const newItem = {
      id: Date.now(),
      title: form.title.value,
      image: form.image.value,
      description: form.description.value,
      height: form.height.value,
    };
    setGalleryItems([newItem, ...galleryItems]);
    handleCloseModal();
  };

  const handleEditGallery = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedItem = {
      ...selectedItem,
      title: form.title.value,
      image: form.image.value,
      description: form.description.value,
      height: form.height.value,
    };
    setGalleryItems(galleryItems.map((item) => (item.id === selectedItem.id ? updatedItem : item)));
    handleCloseModal();
  };

  const handleDeleteGallery = (id) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleMultiDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected items?`)) {
      setGalleryItems(galleryItems.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((sid) => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <DashboardWrapper>
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <button onClick={handleMultiDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Delete {selectedIds.length} Selected
              </button>
            )}
            <button
              onClick={() => handleOpenModal("add")}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Plus size={20} /> Add New
            </button>
          </div>
        </div>

        {/* Gallery Grid with Drag & Drop */}
        <Reorder.Group axis="y" values={galleryItems} onReorder={setGalleryItems} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Reorder.Item key={item.id} value={item} whileDrag={{ scale: 1.05 }} className="relative">
              <motion.div
                layout
                className={`bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition relative cursor-pointer ${
                  selectedIds.includes(item.id) ? "ring-4 ring-blue-400" : ""
                }`}
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" style={{ height: item.height }} />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-5 h-5 accent-blue-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-4 flex justify-between items-start rounded-b-xl">
                  <div>
                    <h2 className="font-semibold text-lg">{item.title}</h2>
                    <p className="text-sm line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <button onClick={() => handleOpenModal("view", item)} className="text-blue-200 hover:text-blue-400 transition" title="View"><Eye size={18} /></button>
                    <button onClick={() => handleOpenModal("edit", item)} className="text-yellow-300 hover:text-yellow-500 transition" title="Edit"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteGallery(item.id)} className="text-red-400 hover:text-red-600 transition" title="Delete"><Trash size={18} /></button>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

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

                {/* Add / Edit Form */}
                {(modalType === "add" || (modalType === "edit" && selectedItem)) && (
                  <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold mb-4">
                      {modalType === "add" ? "Add New Gallery Item" : "Edit Gallery Item"}
                    </h2>
                    <form className="flex flex-col gap-4" onSubmit={modalType === "add" ? handleAddGallery : handleEditGallery}>
                      <input type="text" name="title" placeholder="Title" defaultValue={selectedItem?.title || ""} className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition" required />
                      <input type="text" name="image" placeholder="Image URL" defaultValue={selectedItem?.image || ""} className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition" required onChange={(e) => setPreviewImage(e.target.value)} />
                      <input type="text" name="height" placeholder="Height (e.g., 400px)" defaultValue={selectedItem?.height || "400px"} className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition" />
                      <textarea name="description" placeholder="Description" defaultValue={selectedItem?.description || ""} className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition" required />
                      {previewImage && <motion.img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-xl mt-2 shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />}
                      <button className={`${modalType === "add" ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white py-3 px-4 rounded-xl transition font-semibold`}>
                        {modalType === "add" ? "Save" : "Update"}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* View */}
                {modalType === "view" && selectedItem && (
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg" />
                    <p className="text-gray-600">{selectedItem.description}</p>
                    <p className="text-gray-500 text-sm mt-1">Height: {selectedItem.height}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWrapper>
  );
};

export default Gallery;
