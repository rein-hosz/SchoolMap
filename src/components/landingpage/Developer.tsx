import React from "react";
import Image from "next/image";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaCode,
  FaProjectDiagram,
} from "react-icons/fa";

interface DeveloperInfo {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  links: {
    linkedin: string;
    github: string;
    email: string;
  };
}

const developer: DeveloperInfo = {
  id: "thariq",
  name: "Muhammad Thariq",
  role: "Solo Developer & Creator",
  image: "/dashboard/team/thariq.jpg",
  bio: "Full-stack developer yang merancang dan mengembangkan EduMap Medan dari konsep hingga implementasi. Berpengalaman dalam pengembangan aplikasi web modern dengan fokus pada user experience dan teknologi terdepan.",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "Leaflet.js",
    "GIS",
  ],
  links: {
    linkedin:
      "https://www.linkedin.com/in/muhammad-thariq-arya-putra-sembiring",
    github: "https://github.com/mhdthariq",
    email: "mailto:mthariqaryaputra1@gmail.com",
  },
};

const Developer = () => {
  return (
    <section
      id="developer"
      className="py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute w-96 h-96 bg-indigo-100 rounded-full -top-48 -left-48 opacity-70 animate-float"></div>
      <div className="absolute w-80 h-80 bg-blue-100 rounded-full -bottom-40 -right-40 opacity-70 animate-float-delayed"></div>
      <div className="absolute w-32 h-32 bg-purple-100 rounded-full top-20 right-1/4 opacity-50 animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
            Meet the Creator
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-indigo-900">
            Tentang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              Developer
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Berkenalan dengan creator di balik EduMap Medan - platform pemetaan
            sekolah interaktif yang inovatif
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Developer Image */}
            <div
              className="lg:order-2"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-3xl transform -rotate-3 opacity-10"></div>

                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-indigo-100">
                  <div className="relative w-64 h-64 mx-auto mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <Image
                      src={developer.image}
                      alt={developer.name}
                      fill
                      className="rounded-full object-cover border-8 border-indigo-500 shadow-xl"
                    />
                    {/* Floating icons */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaCode className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaProjectDiagram className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                      {developer.name}
                    </h3>
                    <p className="text-lg font-semibold text-blue-600 mb-4">
                      {developer.role}
                    </p>

                    {/* Social Links */}
                    <div className="flex space-x-4 justify-center">
                      <a
                        href={developer.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                      <a
                        href={developer.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={developer.links.email}
                        className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <FaEnvelope className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div
              className="lg:order-1"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-indigo-100">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-indigo-900 mb-4">
                    Tentang Project
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {developer.bio}
                  </p>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {developer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-4 text-center text-white">
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm opacity-90">Solo Project</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-center text-white">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-90">Self-Developed</div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
                  <p className="font-medium text-indigo-800 italic">
                    "Creating technology solutions that make education more
                    accessible and information more transparent for everyone."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Developer;
