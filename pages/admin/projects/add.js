import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../lib/supabaseClient";
import { isLoggedIn } from "../../../lib/auth";

export default function AddProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && imageUrl) {
      const { error } = await supabase
        .from('projects')
        .insert([{ title, image_url: imageUrl }]);
        
      if (!error) {
        setTimeout(() => {
          router.push('/admin/projects');
        }, 500);
      } else {
        alert('Gagal menambah proyek');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Tambah Proyek Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Judul Proyek"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="URL Gambar Proyek"
          className="w-full p-3 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700">
          Tambah Proyek
        </button>
      </form>
    </div>
  );
}
