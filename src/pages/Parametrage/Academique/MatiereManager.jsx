import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { matiereService } from '../../../services/matiere.service';
import { niveauService } from '../../../services/niveau.service';
import { specialiteService } from '../../../services/specialite.service';
import { filiereService } from '../../../services/filiere.service';
import { PlusIcon, PencilIcon, TrashIcon, AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

const MatiereManager = () => {
  const [matieres, setMatieres] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatiere, setCurrentMatiere] = useState(null);
  const [filters, setFilters] = useState({
    filiereId: '',
    niveauId: '',
    specialiteId: '',
    troncCommun: null
  });
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    filiereId: '',
    niveauId: '',
    specialiteId: '',
    credit: '',
    troncCommun: false
  });

  useEffect(() => {
    loadMatieres();
    loadNiveaux();
    loadFilieres();
    loadSpecialites();
  }, []);

  useEffect(() => {
    loadFilteredMatieres();
  }, [filters]);

  const loadMatieres = async () => {
    try {
      const data = await matiereService.getAllMatieres();
      setMatieres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const loadFilteredMatieres = useCallback(async () => {
    try {
      let data;
      if (filters.niveauId && filters.specialiteId) {
        if (filters.troncCommun) {
          data = await matiereService.getMatieresTroncCommunByNiveau(filters.niveauId);
        } else {
          data = await matiereService.getMatieresSpecialiteByNiveau(filters.niveauId, filters.specialiteId);
        }
      } else if (filters.niveauId) {
        data = await matiereService.getMatieresByNiveau(filters.niveauId);
      } else if (filters.specialiteId) {
        data = await matiereService.getMatieresBySpecialite(filters.specialiteId);
      } else {
        data = await matiereService.getAllMatieres();
      }
      setMatieres(data);
    } catch (error) {
      console.error('Erreur lors du filtrage des matières:', error);
    }
  }, [filters]);

  const loadFilieres = async () => {
    try {
      const data = await filiereService.getFilieres();
      setFilieres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des filières:', error);
    }
  };

  const loadNiveaux = async () => {
    try {
      const data = await niveauService.getNiveaux();
      setNiveaux(data);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
    }
  };

  const loadSpecialites = async () => {
    try {
      const data = await specialiteService.getSpecialites();
      setSpecialites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nom: formData.nom,
        description: formData.description,
        filiereId: parseInt(formData.filiereId, 10),
        niveauId: parseInt(formData.niveauId, 10),
        credit: parseInt(formData.credit, 10),
        troncCommun: formData.troncCommun,
        specialiteId: formData.troncCommun ? null : parseInt(formData.specialiteId, 10)
      };
      
      if (currentMatiere) {
        await matiereService.updateMatiere(currentMatiere.id, dataToSend);
      } else {
        await matiereService.createMatiere(dataToSend);
      }
      setIsModalOpen(false);
      setCurrentMatiere(null);
      setFormData({
        nom: '',
        description: '',
        credit: '',
        filiereId: '',
        niveauId: '',
        specialiteId: '',
        troncCommun: false
      });
      loadFilteredMatieres();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        await matiereService.deleteMatiere(id);
        loadMatieres();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestion des Matières</h2>
          <p className="text-sm text-gray-500">Gérez les matières par niveau et spécialité</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCurrentMatiere(null);
            setFormData({
              nom: '',
              description: '',
              credit: '',
              filiereId: '',
              niveauId: '',
              specialiteId: '',
              troncCommun: false
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle Matière
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AdjustmentsVerticalIcon className="h-5 w-5" />
          <span>Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.niveauId}
            onChange={(e) => setFilters({ ...filters, niveauId: e.target.value })}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Tous les niveaux</option>
            {niveaux.map((niveau) => (
              <option key={niveau.id} value={niveau.id}>
                {niveau.nom}
              </option>
            ))}
          </select>
          <select
            value={filters.specialiteId}
            onChange={(e) => setFilters({ ...filters, specialiteId: e.target.value })}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Toutes les spécialités</option>
            {specialites.map((specialite) => (
              <option key={specialite.id} value={specialite.id}>
                {specialite.nom}
              </option>
            ))}
          </select>
          <select
            value={filters.troncCommun === null ? '' : filters.troncCommun.toString()}
            onChange={(e) => setFilters({ 
              ...filters, 
              troncCommun: e.target.value === '' ? null : e.target.value === 'true'
            })}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Tous les types</option>
            <option value="true">Tronc commun</option>
            <option value="false">Spécifique à la spécialité</option>
          </select>
        </div>
      </div>

      {/* Liste des matières */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matière
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crédits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spécialité
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matieres.map((matiere) => (
              <motion.tr
                key={matiere.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {matiere.nom || ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {matiere.description || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {matiere.credit != null ? matiere.credit : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {matiere.niveauNom || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {matiere.specialiteNom || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentMatiere(matiere);
                      setFormData({
                        nom: matiere.nom || '',
                        description: matiere.description || '',
                        credit: matiere.credit != null ? matiere.credit.toString() : '',
                        filiereId: matiere.filiereId || '',
                        niveauId: matiere.niveauId || '',
                        specialiteId: matiere.specialiteId || '',
                        troncCommun: matiere.troncCommun || false
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(matiere.id)}
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
              className="bg-white rounded-lg p-6 w-full max-w-lg"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentMatiere ? 'Modifier la matière' : 'Nouvelle matière'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom de la matière
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="credit" className="block text-sm font-medium text-gray-700">
                    Crédits
                  </label>
                  <input
                    type="number"
                    id="credit"
                    min="1"
                    value={formData.credit}
                    onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
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
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        filiereId: e.target.value,
                        specialiteId: '' // Reset specialité when filière changes
                      });
                      if (e.target.value) {
                        loadSpecialites(e.target.value);
                      }
                    }}
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

                <div>
                  <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">
                    Niveau
                  </label>
                  <select
                    id="niveau"
                    value={formData.niveauId}
                    onChange={(e) => setFormData({ ...formData, niveauId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Sélectionner un niveau</option>
                    {niveaux.map((niveau) => (
                      <option key={niveau.id} value={niveau.id}>
                        {niveau.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="troncCommun"
                    checked={formData.troncCommun}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        troncCommun: e.target.checked,
                        specialiteId: e.target.checked ? '' : formData.specialiteId 
                      });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="troncCommun" className="ml-2 block text-sm text-gray-900">
                    Matière de tronc commun
                  </label>
                </div>

                {!formData.troncCommun && (
                  <div>
                    <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
                      Spécialité
                    </label>
                    <select
                      id="specialite"
                      value={formData.specialiteId}
                      onChange={(e) => setFormData({ ...formData, specialiteId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required={!formData.troncCommun}
                      disabled={!formData.filiereId}
                    >
                      <option value="">Sélectionner une spécialité</option>
                      {specialites.map((specialite) => (
                        <option key={specialite.id} value={specialite.id}>
                          {specialite.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                    {currentMatiere ? 'Modifier' : 'Créer'}
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

export default MatiereManager;
