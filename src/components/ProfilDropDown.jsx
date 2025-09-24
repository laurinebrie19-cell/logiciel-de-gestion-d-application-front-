import { motion } from "framer-motion";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AutContext";
import { useState } from "react";

const ProfileDropdown = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    {
      icon: User,
      label: "Mon Profil",
      onClick: () => navigate(`/users/${user?.id}`),
    },
    {
      icon: Settings,
      label: "Paramètres",
      onClick: () => navigate("/settings"),
    },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleMenuItemClick = (onClick) => {
    onClick();
    setIsOpen(false);
  };

  if (isLoading || !user) return null;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-600"
      >
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
          <User className="w-5 h-5 text-violet-600" />
        </div>
        <div className="hidden md:block">
          <span className="text-sm font-medium text-gray-100">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-100 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 z-50"
        >
          <div className="py-2 bg-white rounded-xl shadow-lg border border-gray-400">
            <div className="px-4 py-2 border-b border-gray-400">
              <p className="text-sm text-gray-500">Connecté en tant que</p>
              <p className="text-sm font-medium text-indigo-700">
                {user?.email}
              </p>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleMenuItemClick(item.onClick)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  <Icon className="w-4 h-4 mr-3 text-indigo-600" />
                  {item.label}
                </button>
              );
            })}

            <div className="border-t mt-2 border-gray-400">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Déconnexion
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileDropdown;
