import WhatsAppButton from "./WhatsAppButton";

export default function HeroSection() {
  return (
    <section className="bg-orange-600 text-white py-16 px-6 text-center">
      {/* Logo putih besar */}
      <img
        src="/images/LOGO ICI WHITE - Vektor.png"
        alt="Logo PT. INTI CAHAYA IDEATAMA"
        className="mx-auto mb-4 w-28"
      />

      {/* Judul utama */}
      <h1 className="text-3xl font-bold mb-4">PT. INTI CAHAYA IDEATAMA</h1>

      {/* Slogan */}
      <p className="text-lg mb-6">
        Kesejukan Tanpa Batas, Layanan Tanpa Kompromi
      </p>

      {/* Tombol WhatsApp */}
      <WhatsAppButton />
    </section>
  );
}
