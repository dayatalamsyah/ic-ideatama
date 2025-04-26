import WhatsAppButton from "./WhatsAppButton";

export default function HeroSection() {
  return (
    <section className="bg-orange-600 text-white py-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">PT. IC-IDEATAMA</h1>
      <p className="text-lg mb-6">Kesejukan Tanpa Batas, Layanan Tanpa Kompromi</p>
      <WhatsAppButton />
    </section>
  );
}
