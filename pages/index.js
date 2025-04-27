'use client';

import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServiceSection from "../components/ServiceSection";
import GallerySection from "../components/GallerySection";
import OrderFormSection from "../components/OrderFormSection";
import FooterSection from "../components/FooterSection";
import supabase from "../lib/supabaseClient";

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Layanan Kami</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada layanan tersedia.</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Order Form Section */}
      <OrderFormSection />

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
