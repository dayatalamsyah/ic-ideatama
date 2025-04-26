import { useState } from "react";

export default function KelolaGaleri() {
  const [gallery, setGallery] = useState([
    { id: 1, title: "Proyek AC Kementerian", image: "https://kemenaglampungtimur.id/public/berita/13-10-21-09-26-20-.jpeg" },
    { id: 2, title: "Proyek AC BMKG", image: "https://via.placeholder.com/300" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const newProject = {
      id: gallery.length + 1,
      title: newTitle,
      image: newImage,
    };
    setGallery([...gallery, newProject]);
    setNewTitle("");
    setNewImage("");
  };

  const handleDelete = (id) => {
    const updatedGallery = gallery.filter((project) => project.id !== id);
    setGallery(updatedGallery);
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setEditTitle(project.title);
    setEditImage(project.image);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedGallery = gallery.map((project) =>
      project.id === editId
        ? { ...project, title: editTitle, image: editImage }
        : project
    );
    setGallery(updatedGallery);
    setEditId(null);
    setEditTitle("");
    setEditImage("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Kelola Galeri Proyek</h1>

        <form onSubmit={handleAdd} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Nama Proyek"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Link Gambar (URL)"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <button type="submit" className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700">
            Tambah Proyek
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Galeri Proyek</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((project) => (
            <div key={project.id} className="border p-4 rounded-lg flex flex-col items-center">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="font-bold text-center">{project.title}</h3>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {editId && (
          <form onSubmit={handleUpdate} className="space-y-4 mt-8">
            <h2 className="text-xl font-bold mb-2 text-orange-600">Edit Proyek</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
              Update Proyek
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
