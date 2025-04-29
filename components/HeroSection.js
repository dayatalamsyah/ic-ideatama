// components/HeroSection.js

import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";

export default function HeroSection() {
  return (
    <section className="bg-orange-600 text-white py-16 px-6 text-center relative">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        <Image
          src="/images/LOGO ICI - Vektor-icon.png"
          alt="Logo PT. INTI CAHAYA IDEATAMA"
          width={100}
          height={100}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">PT. INTI CAHAYA IDEATAMA</h1>
        <p className="text-lg mb-6">Kesejukan Tanpa Batas, Layanan Tanpa Kompromi</p>
        <WhatsAppButton />
      </div>
    </section>
  );
}
