import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../lib/supabaseClient";
import { isLoggedIn } from "../../../lib/auth";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus proyek ini?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) {
        console.log('Proyek berhasil dihapus.');
        setTimeout(() => {
          fetchProjects();
        }, 500);
      } else {
        console.error('Gagal menghapus proyek:', error);
        alert('Gagal menghapus proyek');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Galeri Proyek</h1>
        <button
          onClick={() => router.push('/admin/projects/add')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Tambah Proyek
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading data proyek...</p>
        ) : (
          <>
            {Array.isArray(projects) && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg overflow-hidden shadow">
                    <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                      <div className="flex justify-between">
                        <button
                          onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Belum ada proyek tersedia.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
