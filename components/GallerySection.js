'use client';

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function GallerySection() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Galeri Proyek</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada proyek tersedia.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold text-gray-800 text-center">{project.title}</h3>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
