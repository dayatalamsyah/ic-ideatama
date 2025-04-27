import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../lib/supabaseClient";
import { isLoggedIn } from "../../../lib/auth";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus layanan ini?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) {
        fetchServices(); // Refresh daftar setelah hapus
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Layanan</h1>
        <button
          onClick={() => router.push('/admin/services/add')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Tambah Layanan
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="px-4 py-2">Judul</th>
              <th className="px-4 py-2">Deskripsi</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="text-center border-t">
                <td className="px-4 py-2">{service.title}</td>
                <td className="px-4 py-2">{service.description}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
