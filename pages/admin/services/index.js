import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../lib/supabaseClient";
import { isLoggedIn } from "../../../lib/auth";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Data hasil fetch:', data);

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus layanan ini?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) {
        console.log('Layanan berhasil dihapus.');
        setTimeout(() => {
          fetchServices(); // kasih delay setelah hapus
        }, 500);
      } else {
        console.error('Gagal menghapus layanan:', error);
        alert('Gagal menghapus layanan');
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

      <div className="bg-white shadow rounded-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading data layanan...</p>
        ) : (
          <>
            {Array.isArray(services) && services.length > 0 ? (
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
                    <tr key={service.id} className="border-t text-center">
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
            ) : (
              <p className="text-center text-gray-500">Belum ada layanan tersedia.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
