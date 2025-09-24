import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Home, RefreshCw } from "lucide-react";

const NotFoundPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulation d'une recherche
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animation du nombre 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="text-center mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            404
          </h1>
        </motion.div>

        {/* Message principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h2>
          <p className="text-lg text-gray-600">
            Désolé, la page que vous recherchez semble avoir disparu dans le
            cyberespace.
          </p>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-8"
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Essayez de rechercher quelque chose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            {isSearching && (
              <RefreshCw className="w-5 h-5 text-indigo-600 absolute right-4 top-3.5 animate-spin" />
            )}
          </form>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto mb-12"
        >
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Pages populaires :
          </h3>
          <div className="space-y-3">
            {["Accueil", "users", "contributions", "Emprunt"].map(
              (page, index) => (
                <motion.a
                  key={page}
                  href={`/${page.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  <span className="text-sm">{page}</span>
                </motion.a>
              )
            )}
          </div>
        </motion.div>

        {/* Bouton de retour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </a>
        </motion.div>

        {/* Message d'aide */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Besoin d'aide ?{" "}
          <a href="/contact" className="text-indigo-600 hover:text-indigo-500">
            Contactez notre support
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default NotFoundPage;
