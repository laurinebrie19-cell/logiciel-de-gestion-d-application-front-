import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropDown";
import ProfileDropdown from "./ProfilDropDown";

const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 w-full bg-indigo-700 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Toggle Sidebar */}
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-indigo-600"
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-100" />
              ) : (
                <Menu className="w-6 h-6 text-gray-100" />
              )}
            </motion.button>

            <h1 className="ml-4 text-xl font-bold text-white">Al Infotech Academy</h1>
          </div>

          {/* Barre de recherche (optionnelle) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white placeholder-indigo-300 border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
};

export default Header;
