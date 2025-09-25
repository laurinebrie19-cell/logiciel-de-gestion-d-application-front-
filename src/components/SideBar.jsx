import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AutContext";
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  Wallet,
  Receipt,
  BarChart2,
  Settings,
  CircleDollarSign,
  ArrowLeftRight,
  ChevronDown,
  Home,
  Landmark,
  Shield,
  FileText,
  Building2,
  Calendar,
} from "lucide-react";

const navItems = [
  {
    section: "Principal",
    icon: Home,
    items: [
      {
        path: "/dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        requiredPermission: "USER_READ",
      },
      {
        path: "/etudiants",
        label: "Étudiants",
        icon: Users,
        requiredPermission: "USER_READ",
      },
      {
        path: "/users",
        label: "Personnel",
        icon: Users,
        requiredPermission: "USER_UPDATE",
      },
      {
        path: "/emploi-du-temps",
        label: "Emploi du temps",
        icon: Calendar,
        requiredPermission: "USER_READ",
      },
     
     
      {
        path: "/statistics",
        label: "Statistiques",
        icon: BarChart2,
        requiredPermission: "STATISTICS_VIEW",
      },
    ],
  },
  
  {
    section: "Administration",
    icon: Shield,
    items: [
     
     /*
      {
        path: "/admin/fonctions-bureau",
        label: "Fonctions du Bureau",
        icon: Building2,
        requiredPermission: "BUREAU_MANAGE",
      },*/
     
      {
        path: "/admin/roles",
        label: "Paramètres Rôles",
        icon: Settings,
        requiredPermission: "USER_MANAGE_ROLES",
      },
     

      {
        path: "/admin/annonces",
        label: "Gestion des Annonces",
        icon: FileText,
        requiredPermission: "USER_MANAGE_ROLES",
      },
      {
        path: "/admin/academique",
        label: "Paramètres Académiques",
        icon: Settings,
        requiredPermission: "USER_MANAGE_ROLES",
      },
    ],
  },
];

const SectionContent = ({ items, isOpen, isMobile, onClose }) => {
  const { hasPermission } = useAuth();

  const filteredItems = items.filter(
    (item) => !item.requiredPermission || hasPermission(item.requiredPermission)
  );

  if (filteredItems.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden pl-4 mt-2"
        >
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="border-l-2 border-gray-100"
              >
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && onClose()}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-1 rounded-lg transition-colors duration-200 relative ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 -ml-[2px]"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-l-2 hover:border-indigo-600 hover:-ml-[2px]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const { user, hasPermission } = useAuth();

  // Filtrer les sections en fonction des permissions
  const filteredNavItems = navItems
    .map((section) => {
      const filteredItems = section.items.filter(
        (item) =>
          !item.requiredPermission || hasPermission(item.requiredPermission)
      );

      // Retourner la section uniquement si elle contient des items visibles
      if (filteredItems.length > 0) {
        return { ...section, items: filteredItems };
      }
      return null;
    })
    .filter(Boolean); // Supprimer les sections nulles

  const [openSections, setOpenSections] = useState(
    filteredNavItems.reduce(
      (acc, section) => ({ ...acc, [section.section]: true }),
      {}
    )
  );

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    // Recalculer les sections ouvertes lorsque l'utilisateur change
    setOpenSections(
      filteredNavItems.reduce(
        (acc, section) => ({ ...acc, [section.section]: true }),
        {}
      )
    );
  }, [user]);

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "tween" }}
      className={`fixed left-0 top-16 h-full bg-white shadow-lg w-64 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-y-auto`}
    >
      <nav className="mt-8 px-4">
        {filteredNavItems.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.section} className={index > 0 ? "mt-6" : ""}>
              <button
                onClick={() => toggleSection(section.section)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-indigo-50 group"
              >
                <div className="flex items-center space-x-3">
                  <SectionIcon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600" />
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-indigo-600">
                    {section.section}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openSections[section.section] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                </motion.div>
              </button>
              <SectionContent
                items={section.items}
                isOpen={openSections[section.section]}
                isMobile={isMobile}
                onClose={onClose}
              />
            </div>
          );
        })}
      </nav>
    </motion.aside>
  );
};

SectionContent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      requiredPermission: PropTypes.string,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
