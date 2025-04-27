'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OrderChart({ data }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Statistik Order Masuk</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#f97316" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
