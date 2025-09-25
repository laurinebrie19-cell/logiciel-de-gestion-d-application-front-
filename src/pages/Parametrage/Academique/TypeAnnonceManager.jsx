import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { showToast } from '../../../components/common/Toasts';
import { typeAnnonceService } from '../../../services/typeAnnonce.service';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

const TypeAnnonceManager = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await typeAnnonceService.getAllTypeAnnonces();
      setTypes(data);
    } catch (error) {
      showToast('error', 'Erreur lors du chargement des types d\'annonce');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingType) {
        await typeAnnonceService.updateTypeAnnonce(editingType.id, formData);
        showToast('success', 'Type d\'annonce mis à jour avec succès');
      } else {
        await typeAnnonceService.createTypeAnnonce(formData);
        showToast('success', 'Type d\'annonce créé avec succès');
      }
      resetForm();
      fetchTypes();
    } catch (error) {
      showToast('error', 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      nom: type.nom,
      description: type.description
    });
    setShowForm(true);
  };

  const handleDeleteClick = (type) => {
    setTypeToDelete(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await typeAnnonceService.deleteTypeAnnonce(typeToDelete.id);
      showToast('success', 'Type d\'annonce supprimé avec succès');
      setShowDeleteModal(false);
      fetchTypes();
    } catch (error) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', description: '' });
    setEditingType(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Types d'annonce</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau type
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
              {editingType ? 'Mettre à jour' : 'Créer'}
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
            {types.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {type.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{type.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(type)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(type)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le type d'annonce "${typeToDelete?.nom}" ?`}
      />
    </div>
  );
};

export default TypeAnnonceManager;
