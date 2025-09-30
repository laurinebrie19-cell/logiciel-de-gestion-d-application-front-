import { useState, useEffect } from 'react';
import { annonceService } from '../../services/annonce.service';
import { typeAnnonceService } from '../../services/typeAnnonce.service';
import { categorieAnnonceService } from '../../services/categorieAnnonce.service';
import { ArrowRight, Calendar, Clock, MapPin, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnonceDetailModal from './AnnonceDetailModal';

const AnnoncesList = () => {
  const [annonces, setAnnonces] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchFilteredAnnonces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedCategory]);

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchTypes = async () => {
    try {
      const data = await typeAnnonceService.getAllTypeAnnonces();
      setTypes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des types:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categorieAnnonceService.getAllCategorieAnnonces();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const fetchFilteredAnnonces = async () => {
    try {
      setLoading(true);
      const data = await annonceService.getFilteredAnnonces(selectedType, selectedCategory);
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces filtrées:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Actualités et Annonces
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Restez informé des dernières nouvelles et événements de notre académie
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtrer les annonces
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-blue-50 border border-blue-200 rounded-xl shadow-lg p-6 mx-auto max-w-4xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-900">Filtres</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-2">Type d&apos;annonce</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-base py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                  >
                    <option value="all">Tous les types</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id.toString()}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-2">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-base py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {annonces.map((annonce) => (
            <div
              key={annonce.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {annonce.imageUrl && (
                <div className="relative h-48">
                  <img
                    src={annonce.imageUrl}
                    alt={annonce.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {annonce.categorieAnnonceNom}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(annonce.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {annonce.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {annonce.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {annonce.time}
                  </div>
                  
                  {annonce.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {annonce.location}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedAnnonce(annonce)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnonceDetailModal 
        annonce={selectedAnnonce}
        onClose={() => setSelectedAnnonce(null)}
      />
    </div>
  );
};

export default AnnoncesList;
