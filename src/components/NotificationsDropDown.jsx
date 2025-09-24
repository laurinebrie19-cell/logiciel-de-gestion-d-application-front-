import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const NotificationsDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Nouvelle cotisation reçue",
      message: "La cotisation de Janvier 2025 a été enregistrée",
      time: "Il y a 5 minutes",
      unread: true,
    },
    {
      id: 2,
      title: "Rappel de paiement",
      message: "Votre échéance arrive à terme dans 3 jours",
      time: "Il y a 2 heures",
      unread: true,
    },
    {
      id: 3,
      title: "Mise à jour du règlement",
      message: "Le nouveau règlement intérieur est disponible",
      time: "Il y a 1 jour",
      unread: false,
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-lg hover:bg-indigo-600 relative"
      >
        <Bell className="w-5 h-5 text-white" />
        {notifications.some((n) => n.unread) && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-700 rounded-full" />
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-400">
              <h3 className="font-semibold text-indigo-700">Notifications</h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    notification.unread ? "bg-violet-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-gray-400">
              <button className="text-sm text-indigo-700 hover:text-indigo-800 w-full text-center">
                Voir toutes les notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
