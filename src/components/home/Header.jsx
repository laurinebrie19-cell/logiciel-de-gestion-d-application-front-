import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll pour changer l'apparence du header
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'features', label: 'Nos atouts' },
    { id: 'about', label: 'À propos' },
    { id: 'blog', label: 'Blog', isLink: true, path: '/blog' },
    { id: 'announcements', label: 'Actualités' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo et nom */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#0ea5e9] flex items-center justify-center shadow-lg shadow-sky-200/50">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">
                AL Infotech Academy
              </h1>
              <p className="text-sm text-[#64748b]">Formation d&apos;excellence</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.isLink ? (
                    <button
                      onClick={() => navigate(item.path)}
                      className="relative px-3 py-2 text-[#64748b] hover:text-[#0ea5e9] font-medium transition-colors group"
                    >
                      {item.label}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0ea5e9] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </button>
                  ) : (
                    <button
                      onClick={() => document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' })}
                      className="relative px-3 py-2 text-[#64748b] hover:text-[#0ea5e9] font-medium transition-colors group"
                    >
                      {item.label}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0ea5e9] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contact")}
                className="hidden md:block px-4 py-2 text-[#0ea5e9] font-medium hover:text-[#0284c7] transition-colors"
              >
                Nous contacter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 rounded-xl bg-[#0ea5e9] text-white font-medium shadow-lg shadow-sky-200/50 hover:bg-[#0284c7] transition-all duration-200"
              >
                Espace étudiant
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
