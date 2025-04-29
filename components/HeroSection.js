import WhatsAppButton from "./WhatsAppButton";

export default function HeroSection() {
  return (
    <section className="bg-orange-600 text-white py-16 px-6 text-center">
      {/* Logo putih besar */}
      <img
        src="/images/LOGO ICI WHITE - Vektor.png"
        alt="Logo PT. INTI CAHAYA IDEATAMA"
        className="mx-auto mb-6 w-40 sm:w-48 md:w-56"
      />

      {/* Slogan */}
      <p className="text-lg mb-6">
        Kesejukan Tanpa Batas, Layanan Tanpa Kompromi
      </p>

      {/* Tombol WhatsApp */}
      <WhatsAppButton />
    </section>
  );
}
