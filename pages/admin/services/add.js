import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../lib/supabaseClient";
import { isLoggedIn } from "../../../lib/auth";

export default function AddServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description) {
      const { error } = await supabase.from('services').insert([{ title, description }]);
      if (!error) {
        router.push('/admin/services');
      } else {
        alert('Gagal menambah layanan');
      }
    }
  };

  if (!isLoggedIn()) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Tambah Layanan Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Judul Layanan"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Deskripsi Layanan"
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700">
          Tambah Layanan
        </button>
      </form>
    </div>
  );
}
