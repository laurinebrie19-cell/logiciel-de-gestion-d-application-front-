import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { specialiteService } from '../../../services/specialite.service';
import { filiereService } from '../../../services/filiere.service';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SpecialiteManager = () => {
  const [specialites, setSpecialites] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpecialite, setCurrentSpecialite] = useState(null);
  const [selectedFiliereId, setSelectedFiliereId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    filiereId: ''
  });

  useEffect(() => {
    loadFilieres();
  }, []);

  useEffect(() => {
    if (selectedFiliereId) {
      loadSpecialitesByFiliere(selectedFiliereId);
    } else {
      loadSpecialites();
    }
  }, [selectedFiliereId]);

  const loadSpecialites = async () => {
    try {
      setLoading(true);
      const data = await specialiteService.getSpecialites();
      setSpecialites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialitesByFiliere = async (filiereId) => {
    try {
      setLoading(true);
      const data = await filiereService.getSpecialitesByFiliere(filiereId);
      setSpecialites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités de la filière:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilieres = async () => {
    try {
      const data = await filiereService.getFilieres();
      setFilieres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSpecialite) {
        await specialiteService.updateSpecialite(currentSpecialite.id, formData);
      } else {
        await specialiteService.createSpecialite(formData);
      }
      setIsModalOpen(false);
      setCurrentSpecialite(null);
      setFormData({ nom: '', filiereId: '' });
      loadSpecialites();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) {
      try {
        await specialiteService.deleteSpecialite(id);
        loadSpecialites();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des Spécialités</h2>
            <p className="text-sm text-gray-500">Gérez les spécialités par filière</p>
          </div>
        </div>
        
        {/* Filtre par filière */}
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <select
              value={selectedFiliereId}
              onChange={(e) => setSelectedFiliereId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Toutes les filières</option>
              {filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.id}>
                  {filiere.nom}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentSpecialite(null);
              setFormData({ nom: '', filiereId: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle Spécialité
          </motion.button>
        </div>
      </div>

      {/* Liste des spécialités */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spécialité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Filière
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {specialites.map((specialite) => (
              <motion.tr
                key={specialite.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {specialite.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {specialite.filiereNom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentSpecialite(specialite);
                      setFormData({
                        nom: specialite.nom,
                        filiereId: specialite.filiereId
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(specialite.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentSpecialite ? 'Modifier la spécialité' : 'Nouvelle spécialité'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom de la spécialité
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
                    Filière
                  </label>
                  <select
                    id="filiere"
                    value={formData.filiereId}
                    onChange={(e) => setFormData({ ...formData, filiereId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                  >
                    {currentSpecialite ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialiteManager;
