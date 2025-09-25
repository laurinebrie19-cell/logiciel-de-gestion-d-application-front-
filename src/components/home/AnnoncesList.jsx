import { useState, useEffect } from 'react';
import { annonceService } from '../../services/annonce.service';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import AnnonceDetailModal from './AnnonceDetailModal';

const AnnoncesList = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const data = await annonceService.getActiveAnnonces();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Actualités et Annonces
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Restez informé des dernières nouvelles et événements de notre académie
        </p>
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
