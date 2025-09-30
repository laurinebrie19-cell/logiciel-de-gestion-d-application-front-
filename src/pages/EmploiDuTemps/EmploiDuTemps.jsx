import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { showToast } from '../../components/common/Toasts';
import { niveauService } from '../../services/niveau.service';
import { filiereService } from '../../services/filiere.service';
import PermissionWrapper from '../../components/PermissionWrapper';
import EmploiDuTempsForm from './EmploiDuTempsForm';
import EmploiDuTempsCalendar from './EmploiDuTempsCalendar';
import { 
  getAllEmploisDuTemps,
  deleteEmploiDuTemps,
  getEmploisDuTempsByFiliere,
  getEmploisDuTempsByFiliereAndNiveau
} from '../../services/emploiDuTemps.service';

const EmploiDuTemps = () => {
  const [emplois, setEmplois] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmploi, setSelectedEmploi] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'
  const [selectedNiveau, setSelectedNiveau] = useState('all');
  const [selectedFiliere, setSelectedFiliere] = useState('all');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Chargement des données...');
      const [emploisData, niveauxData, filieresData] = await Promise.all([
        selectedFiliere !== 'all' && selectedNiveau !== 'all'
          ? getEmploisDuTempsByFiliereAndNiveau(selectedFiliere, selectedNiveau)
          : selectedFiliere !== 'all'
          ? getEmploisDuTempsByFiliere(selectedFiliere)
          : getAllEmploisDuTemps(),
        niveauService.getNiveaux(),
        filiereService.getFilieres()
      ]);
      console.log('Niveaux reçus:', niveauxData);
      setEmplois(emploisData);
      setNiveaux(niveauxData);
      setFilieres(filieresData);
    } catch (error) {
      showToast('error', error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [selectedFiliere, selectedNiveau]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet emploi du temps ?')) {
      try {
        await deleteEmploiDuTemps(id);
        showToast('success', 'Emploi du temps supprimé avec succès');
        fetchData();
      } catch (error) {
        showToast('error', error.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <PermissionWrapper permission="EMPLOI_READ">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Emplois du temps</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez les emplois du temps par niveau
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  {viewMode === 'list' ? (
                    <>
                      <Calendar className="h-5 w-5 mr-2" />
                      Vue Calendrier
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-5 w-5 mr-2" />
                      Vue Liste
                    </>
                  )}
                </button>
                <PermissionWrapper permission="EMPLOI_CREATE">
                  <button
                    onClick={() => {
                      setSelectedEmploi(null);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau
                  </button>
                </PermissionWrapper>
              </div>
            </div>

            {/* Filtres */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <select
                  value={selectedFiliere}
                  onChange={(e) => {
                    setSelectedFiliere(e.target.value);
                    setSelectedNiveau('all');
                    fetchData();
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Toutes les filières</option>
                  {filieres.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedNiveau}
                  onChange={(e) => {
                    setSelectedNiveau(e.target.value);
                    fetchData();
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Tous les niveaux</option>
                  {niveaux.map((niveau) => (
                    <option key={niveau.id} value={niveau.id}>
                      {niveau.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      emplois
                        .filter(
                          (emploi) =>
                            selectedNiveau === 'all' ||
                            emploi.niveauId.toString() === selectedNiveau
                        )
                        .map((emploi) => (
                          <tr key={emploi.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {emploi.titre}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {niveaux.find((n) => n.id === emploi.niveauId)?.nom || ''}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(emploi.dateDebut).toLocaleDateString()} -{' '}
                                {new Date(emploi.dateFin).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <PermissionWrapper permission="EMPLOI_UPDATE">
                                <button
                                  onClick={() => {
                                    setSelectedEmploi(emploi);
                                    setShowModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  <Edit2 className="h-5 w-5" />
                                </button>
                              </PermissionWrapper>
                              <PermissionWrapper permission="EMPLOI_DELETE">
                                <button
                                  onClick={() => handleDelete(emploi.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </PermissionWrapper>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmploiDuTempsCalendar
                emplois={emplois.filter(
                  (emploi) =>
                    selectedNiveau === 'all' ||
                    emploi.niveauId.toString() === selectedNiveau
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <EmploiDuTempsForm
            emploiDuTemps={selectedEmploi}
            niveaux={niveaux}
            filieres={filieres}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
    </PermissionWrapper>
  );
};

export default EmploiDuTemps;
