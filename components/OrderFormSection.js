export default function OrderFormSection() {
  return (
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
  );
}
