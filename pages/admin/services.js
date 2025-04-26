import { useState } from "react";

export default function KelolaLayanan() {
  const [services, setServices] = useState([
    { id: 1, title: "Instalasi AC", description: "Layanan instalasi AC profesional." },
    { id: 2, title: "Perawatan Rutin", description: "Perawatan AC rutin untuk performa maksimal." },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAddService = (e) => {
    e.preventDefault();
    const newService = {
      id: services.length + 1,
      title: newTitle,
      description: newDesc,
    };
    setServices([...services, newService]);
    setNewTitle("");
    setNewDesc("");
  };

  const handleDelete = (id) => {
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setEditTitle(service.title);
    setEditDesc(service.description);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedServices = services.map((service) =>
      service.id === editId
        ? { ...service, title: editTitle, description: editDesc }
        : service
    );
    setServices(updatedServices);
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Kelola Layanan</h1>

        <form onSubmit={handleAddService} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Judul Layanan"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <textarea
            placeholder="Deskripsi Layanan"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <button type="submit" className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700">
            Tambah Layanan
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Daftar Layanan</h2>
        <ul className="space-y-4">
          {services.map((service) => (
            <li key={service.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editId && (
          <form onSubmit={handleUpdate} className="space-y-4 mt-8">
            <h2 className="text-xl font-bold mb-2 text-orange-600">Edit Layanan</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
              Update Layanan
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
