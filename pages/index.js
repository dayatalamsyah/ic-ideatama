import WhatsAppButton from "../components/WhatsAppButton";
import { useState, useEffect } from "react";

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Simulasi fetch data layanan dari "admin"
    const dummyServices = [
      { id: 1, title: "Instalasi AC", description: "Layanan instalasi AC profesional." },
      { id: 2, title: "Perawatan Rutin", description: "Perawatan AC rutin untuk performa maksimal." },
    ];
    setServices(dummyServices);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-orange-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">PT. IC-IDEATAMA</h1>
        <p className="text-lg mb-6">Kesejukan Tanpa Batas, Layanan Tanpa Kompromi</p>
        <WhatsAppButton />
      </section>

      {/* Tentang Kami */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
        <p className="text-lg">
          PT. INTI CAHAYA IDEATAMA adalah mitra terpercaya dalam penyediaan AC berkualitas
          dan layanan terbaik. Berpengalaman, inovatif, dan fokus pada kepuasan pelanggan.
        </p>
      </section>

      {/* Layanan Kami */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Layanan Kami</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Order */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Form Order</h2>
        {/* Form Order tetap sama */}
      </section>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">© 2025 PT. IC-IDEATAMA. All rights reserved.</p>
      </footer>
    </main>
  );
}
