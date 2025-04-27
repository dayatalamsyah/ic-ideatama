import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient";
import { isLoggedIn } from "../../lib/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus order ini?')) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) {
        console.log('Order berhasil dihapus.');
        setTimeout(() => {
          fetchOrders();
        }, 500);
      } else {
        console.error('Gagal menghapus order:', error);
        alert('Gagal menghapus order');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin - Order Masuk</h1>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading data order...</p>
        ) : (
          <>
            {Array.isArray(orders) && orders.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">WhatsApp</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Alamat</th>
                    <th className="px-4 py-2">Layanan</th>
                    <th className="px-4 py-2">Pesan</th>
                    <th className="px-4 py-2">Tanggal</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t text-center">
                      <td className="px-4 py-2">{order.name}</td>
                      <td className="px-4 py-2">{order.whatsapp}</td>
                      <td className="px-4 py-2">{order.email}</td>
                      <td className="px-4 py-2">{order.address}</td>
                      <td className="px-4 py-2">{order.service}</td>
                      <td className="px-4 py-2">{order.message}</td>
                      <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleDelete(order.id)}
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
              <p className="text-center text-gray-500">Belum ada order masuk.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
