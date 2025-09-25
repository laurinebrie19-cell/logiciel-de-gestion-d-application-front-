import { X, Calendar, Clock, MapPin, Tag, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AnnonceDetailModal = ({ annonce, onClose }) => {
  if (!annonce) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="relative">
          {annonce.imageUrl ? (
            <img
              src={annonce.imageUrl}
              alt={annonce.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                 <h2 className="text-3xl font-bold text-white text-center px-4">{annonce.title}</h2>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {annonce.imageUrl && (
             <h2 className="text-3xl font-bold text-gray-900 mb-4">{annonce.title}</h2>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>{formatDate(annonce.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>{annonce.time}</span>
            </div>
            {annonce.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>{annonce.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Tag className="h-4 w-4" />
              <strong>Catégorie:</strong> {annonce.categorieAnnonceNom}
            </div>
            <div className="flex items-center gap-2 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              <Info className="h-4 w-4" />
              <strong>Type:</strong> {annonce.typeAnnonceNom}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">{annonce.description}</p>
            <div dangerouslySetInnerHTML={{ __html: annonce.content }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnnonceDetailModal;
