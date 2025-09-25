import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { showToast } from '../../../components/common/Toasts';
import { categorieAnnonceService } from '../../../services/categorieAnnonce.service';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

const CategorieAnnonceManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categorieToDelete, setCategorieToDelete] = useState(null);
  const [editingCategorie, setEditingCategorie] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categorieAnnonceService.getAllCategorieAnnonces();
      console.log('Response from API:', response); // Pour déboguer
      // S'assurer que nous avons un tableau, sinon utiliser un tableau vide
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erreur complète:', error);
      showToast('error', 'Erreur lors du chargement des catégories d\'annonce');
      setCategories([]); // En cas d'erreur, initialiser avec un tableau vide
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        nom: formData.nom,
        description: formData.description
      };
      
      if (editingCategorie) {
        await categorieAnnonceService.updateCategorieAnnonce(editingCategorie.id, dataToSend);
        showToast('success', 'Catégorie d\'annonce mise à jour avec succès');
      } else {
        console.log('Envoi des données:', dataToSend);
        const response = await categorieAnnonceService.createCategorieAnnonce(dataToSend);
        console.log('Réponse reçue:', response);
        showToast('success', 'Catégorie d\'annonce créée avec succès');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Erreur détaillée:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categorie) => {
    setEditingCategorie(categorie);
    setFormData({
      nom: categorie.nom,
      description: categorie.description
    });
    setShowForm(true);
  };

  const handleDeleteClick = (categorie) => {
    setCategorieToDelete(categorie);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await categorieAnnonceService.deleteCategorieAnnonce(categorieToDelete.id);
      showToast('success', 'Catégorie d\'annonce supprimée avec succès');
      fetchCategories();
    } catch (error) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', description: '' });
    setEditingCategorie(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Catégories d&apos;annonce</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="3"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {editingCategorie ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Aucune catégorie d'annonce trouvée
                </td>
              </tr>
            ) : (
              categories.map((categorie) => (
                <tr key={categorie.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {categorie.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{categorie.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(categorie)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(categorie)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${categorieToDelete?.nom}" ?`}
      />
    </div>
  );
};

export default CategorieAnnonceManager;
