import { useState } from "react";

export default function KelolaKontak() {
  const [alamat, setAlamat] = useState("Jl. Satria Raya Blok IV No.8, Kayuringin, Bekasi Selatan");
  const [whatsapp, setWhatsapp] = useState("+62-812-1199-9417");
  const [email, setEmail] = useState("hello@www.ic-ideatama.com");

  const [newAlamat, setNewAlamat] = useState(alamat);
  const [newWhatsapp, setNewWhatsapp] = useState(whatsapp);
  const [newEmail, setNewEmail] = useState(email);

  const handleUpdate = (e) => {
    e.preventDefault();
    setAlamat(newAlamat);
    setWhatsapp(newWhatsapp);
    setEmail(newEmail);
    alert("Kontak berhasil diupdate!");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Kelola Kontak Perusahaan</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Alamat</label>
            <textarea
              value={newAlamat}
              onChange={(e) => setNewAlamat(e.target.value)}
              required
              className="w-full p-3 border rounded"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-2">Nomor WhatsApp</label>
            <input
              type="text"
              value={newWhatsapp}
              onChange={(e) => setNewWhatsapp(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <button type="submit" className="bg-orange-600 text-white py-3 px-6 rounded hover:bg-orange-700">
            Update Kontak
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Kontak Saat Ini:</h2>
          <p><strong>Alamat:</strong> {alamat}</p>
          <p><strong>WhatsApp:</strong> {whatsapp}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      </div>
    </main>
  );
}
