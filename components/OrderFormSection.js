'use client';

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function OrderFormSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, title')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get('name'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      address: formData.get('address'),
      service: formData.get('service'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Order berhasil dikirim!');
        e.target.reset();
      } else {
        alert('Gagal mengirim order, silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submit form:', error);
      alert('Terjadi kesalahan saat mengirim order.');
    }
  };

  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Form Order</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          name="whatsapp"
          placeholder="Nomor WhatsApp"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Alamat"
          className="w-full p-3 border rounded"
          required
        />
        <select
          name="service"
          className="w-full p-3 border rounded"
          required
        >
          <option value="">Pilih Layanan</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        <textarea
          name="message"
          placeholder="Pesan tambahan"
          className="w-full p-3 border rounded"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700"
        >
          Kirim Order
        </button>
      </form>
    </section>
  );
}
