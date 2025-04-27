'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function OrderChart({ data }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-12">
      <h2 className="text-xl font-bold mb-4 text-center">Grafik Order Masuk per Bulan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="bulan" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="jumlah" stroke="#f97316" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
