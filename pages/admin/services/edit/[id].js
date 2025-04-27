import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../../../../lib/supabaseClient";
import { isLoggedIn } from "../../../../lib/auth";

export default function EditServicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!router.isReady) return; // ⛔ TUNGGU router ready

    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else if (id) {
      fetchService();
    }
  }, [router.isReady, id]);

  const fetchService = async () => {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
    } else {
      console.error('Gagal fetch data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('services').update({ title, description }).eq('id', id);
    if (!error) {
      router.push('/admin/services');
    } else {
      alert('Gagal mengupdate layanan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Layanan</h1>
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
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
