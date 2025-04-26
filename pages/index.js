import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      <section className="bg-orange-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">PT. INTI CAHAYA IDEATAMA</h1>
        <p className="text-lg mb-6">Kesejukan Tanpa Batas, Layanan Tanpa Kompromi</p>
        <WhatsAppButton />
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
        <p className="text-lg">
          PT. INTI CAHAYA IDEATAMA adalah mitra terpercaya dalam penyediaan AC berkualitas
          dan layanan terbaik. Berpengalaman, inovatif, dan fokus pada kepuasan pelanggan.
        </p>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Form Order</h2>
        <form method="POST" action="/api/submit-order" className="max-w-xl mx-auto space-y-4">
          <input type="text" name="name" placeholder="Nama Lengkap" className="w-full p-3 border rounded" required />
          <input type="text" name="whatsapp" placeholder="Nomor WhatsApp" className="w-full p-3 border rounded" required />
          <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded" required />
          <input type="text" name="address" placeholder="Alamat" className="w-full p-3 border rounded" required />
          <select name="service" className="w-full p-3 border rounded" required>
            <option value="">Pilih Layanan</option>
            <option value="Instalasi AC">Instalasi AC</option>
            <option value="Perawatan AC">Perawatan AC</option>
            <option value="Perbaikan AC">Perbaikan AC</option>
          </select>
          <textarea name="message" placeholder="Pesan tambahan" className="w-full p-3 border rounded"></textarea>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700">
            Kirim Order
          </button>
        </form>
      </section>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">© 2025 PT. INTI CAHAYA IDEATAMA. All rights reserved.</p>
      </footer>
    </main>
  );
}
