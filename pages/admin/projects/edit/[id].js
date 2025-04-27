import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../../../../lib/supabaseClient";
import { isLoggedIn } from "../../../../lib/auth";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else if (id) {
      fetchProject();
    }
  }, [router.isReady, id]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setTitle(data.title);
      setImageUrl(data.image_url);
    } else {
      console.error('Gagal fetch proyek:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('projects')
      .update({ title, image_url: imageUrl })
      .eq('id', id);

    if (!error) {
      setTimeout(() => {
        router.push('/admin/projects');
      }, 500);
    } else {
      alert('Gagal mengupdate proyek');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Proyek</h1>
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
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
