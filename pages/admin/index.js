'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient";
import { isLoggedIn } from "../../lib/auth";
import * as XLSX from "xlsx";
import OrderChart from "../../components/OrderChart";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/admin/login');
    } else {
      fetchDashboard();
      fetchOrders();
    }
  }, []);

  const fetchDashboard = async () => {
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    setTotalOrders(ordersCount || 0);

    const { count: servicesCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    setTotalServices(servicesCount || 0);

    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    setTotalProjects(projectsCount || 0);
  };

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
      generateChartData(data || []);
    }
    setLoading(false);
  };

  const generateChartData = (orders) => {
    const bulanMap = {
      0: "Januari", 1: "Februari", 2: "Maret", 3: "April",
      4: "Mei", 5: "Juni", 6: "Juli", 7: "Agustus",
      8: "September", 9: "Oktober", 10: "November", 11: "Desember",
    };
    const grouped = {};

    orders.forEach(order => {
      const month = new Date(order.created_at).getMonth();
      grouped[month] = (grouped[month] || 0) + 1;
    });

    const chartArray = Object.keys(bulanMap).map((key) => ({
      bulan: bulanMap[key],
      jumlah: grouped[key] || 0,
    }));

    setChartData(chartArray);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus order ini?')) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) {
        fetchDashboard();
        fetchOrders();
      } else {
        console.error('Gagal menghapus order:', error);
        alert('Gagal menghapus order');
      }
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      fetchOrders();
    } else {
      alert('Gagal mengubah status');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders-ic-ideatama.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin - Order Masuk</h1>

      {/* Statistik Dashboard */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-orange-600">{totalOrders}</h2>
          <p className="text-gray-600 mt-2">Total Order</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-orange-600">{totalServices}</h2>
          <p className="text-gray-600 mt-2">Total Layanan</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-orange-600">{totalProjects}</h2>
          <p className="text-gray-600 mt-2">Total Proyek</p>
        </div>
      </div>

      {/* Chart */}
      <OrderChart data={chartData} />

      {/* Export Excel Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      {/* List Order Masuk */}
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
                    <th className="px-4 py-2">Status</th>
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
                      <td className="px-4 py-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="Baru">Baru</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
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
