import { motion } from "framer-motion";
import Header from "../../components/home/Header";
import { Hero } from "../../components/home/Hero";
import { Features } from "../../components/home/Features";
import { About } from "../../components/home/About";
import Announcements from "../../components/home/Announcements";
import Schedule from "../../components/home/Schedule";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <Announcements />
        <Schedule />
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0f172a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AL Infotech Academy</h3>
                  <p className="text-sm text-[#94a3b8]">Formation informatique</p>
                </div>
              </div>
              <p className="text-[#94a3b8]">
                Centre de formation d&apos;excellence pour les métiers du numérique.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-[#94a3b8] hover:text-[#0ea5e9] transition-colors">
                    Nos atouts
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[#94a3b8] hover:text-[#0ea5e9] transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#announcements" className="text-[#94a3b8] hover:text-[#0ea5e9] transition-colors">
                    Actualités
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="text-[#94a3b8] hover:text-[#0ea5e9] transition-colors">
                    Emploi du temps
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[#94a3b8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@alinfotech.com
                </li>
                <li className="flex items-center gap-2 text-[#94a3b8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +237 612 345 678
                </li>
                <li className="flex items-center gap-2 text-[#94a3b8]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Carrefour Trois Statues, Douala
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#1e293b] mt-8 pt-8 text-center">
            <p className="text-[#94a3b8]">
              © {new Date().getFullYear()} AL Infotech Academy. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
