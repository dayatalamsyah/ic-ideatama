import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isLoggedIn, logoutAdmin } from "../../lib/auth";
import supabase from "../../lib/supabaseClient";

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
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin - Order Masuk</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center border-t">
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.whatsapp}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">{order.service}</td>
                  <td className="px-4 py-2">{order.message}</td>
                  <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
