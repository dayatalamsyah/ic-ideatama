import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServiceSection from "../components/ServiceSection";
import GallerySection from "../components/GallerySection";
import OrderFormSection from "../components/OrderFormSection";
import FooterSection from "../components/FooterSection";

export default function Home() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const dummyServices = [
      { id: 1, title: "Instalasi AC", description: "Layanan instalasi AC profesional." },
      { id: 2, title: "Perawatan Rutin", description: "Perawatan AC rutin untuk performa maksimal." },
    ];
    setServices(dummyServices);

    const dummyProjects = [
      { id: 1, title: "Proyek AC Kementerian", image: "https://via.placeholder.com/300" },
      { id: 2, title: "Proyek AC BMKG", image: "https://via.placeholder.com/300" },
    ];
    setProjects(dummyProjects);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      <HeroSection />
      <AboutSection />
      <ServiceSection services={services} />
      <GallerySection projects={projects} />
      <OrderFormSection />
      <FooterSection />
    </main>
  );
}
