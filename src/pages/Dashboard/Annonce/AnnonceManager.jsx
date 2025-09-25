import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { annonceService } from '../../../services/annonce.service';
import { typeAnnonceService } from '../../../services/typeAnnonce.service';
import { categorieAnnonceService } from '../../../services/categorieAnnonce.service';
import { showToast } from '../../../components/common/Toasts';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

const AnnonceManager = () => {
  const [annonces, setAnnonces] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [annonceToDelete, setAnnonceToDelete] = useState(null);
  const [editingAnnonce, setEditingAnnonce] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    type: '',
    category: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    isActive: true,
    typeAnnonceId: '',
    categorieAnnonceId: ''
  });

  useEffect(() => {
    fetchAnnonces();
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const data = await annonceService.getAllAnnonces();
      setAnnonces(data);
    } catch (error) {
      showToast('error', 'Erreur lors de la récupération des annonces');
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await typeAnnonceService.getAllTypeAnnonces();
      console.log('Types récupérés:', data); // Pour déboguer
      setTypes(data);
    } catch (error) {
      console.error('Erreur fetchTypes:', error); // Pour déboguer
      showToast('error', 'Erreur lors de la récupération des types d\'annonce');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categorieAnnonceService.getAllCategorieAnnonces();
      console.log('Catégories récupérées:', data); // Pour déboguer
      setCategories(data);
    } catch (error) {
      console.error('Erreur fetchCategories:', error); // Pour déboguer
      showToast('error', 'Erreur lors de la récupération des catégories d\'annonce');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        typeAnnonceId: parseInt(formData.typeAnnonceId),
        categorieAnnonceId: parseInt(formData.categorieAnnonceId),
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      if (editingAnnonce) {
        await annonceService.updateAnnonce(editingAnnonce.id, submitData);
        showToast('success', 'Annonce modifiée avec succès');
      } else {
        await annonceService.createAnnonce(submitData);
        showToast('success', 'Annonce créée avec succès');
      }
      setShowForm(false);
      setEditingAnnonce(null);
      fetchAnnonces();
      setFormData({
        title: '',
        content: '',
        description: '',
        type: '',
        category: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        isActive: true,
        typeAnnonceId: '',
        categorieAnnonceId: ''
      });
      fetchAnnonces();
    } catch (error) {
      showToast('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (annonce) => {
    setEditingAnnonce(annonce);
    setFormData({
      title: annonce.title,
      content: annonce.content,
      description: annonce.description,
      type: annonce.type,
      category: annonce.category,
      date: annonce.date,
      time: annonce.time,
      location: annonce.location,
      imageUrl: annonce.imageUrl,
      isActive: annonce.isActive,
      typeAnnonceId: annonce.typeAnnonceId,
      categorieAnnonceId: annonce.categorieAnnonceId
    });
    setShowForm(true);
  };

  const handleDeleteClick = (annonce) => {
    setAnnonceToDelete(annonce);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await annonceService.deleteAnnonce(annonceToDelete.id);
      showToast('success', 'Annonce supprimée avec succès');
      setShowDeleteModal(false);
      fetchAnnonces();
    } catch (error) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des annonces</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nouvelle annonce
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingAnnonce ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    required
                    placeholder="Entrez le titre de l'annonce"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type d'annonce
                  </label>
                  <select
                    name="typeAnnonceId"
                    value={formData.typeAnnonceId}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base disabled:bg-gray-100"
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner un type</option>
                    {types && types.length > 0 ? (
                      types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.nom}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Chargement des types...</option>
                    )}
                  </select>
                  {types.length === 0 && (
                    <p className="mt-1 text-sm text-red-600">Aucun type disponible.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    name="categorieAnnonceId"
                    value={formData.categorieAnnonceId}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base disabled:bg-gray-100"
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nom}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Chargement des catégories...</option>
                    )}
                  </select>
                  {categories.length === 0 && (
                    <p className="mt-1 text-sm text-red-600">Aucune catégorie disponible.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Heure
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lieu
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    placeholder="Entrez le lieu de l'événement"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base resize-y min-h-[100px]"
                  required
                  placeholder="Entrez une brève description de l'annonce"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contenu
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base resize-y min-h-[150px]"
                  required
                  placeholder="Entrez le contenu détaillé de l'annonce"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Annonce active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAnnonce(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingAnnonce ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  Chargement...
                </td>
              </tr>
            ) : annonces.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  Aucune annonce trouvée
                </td>
              </tr>
            ) : (
              annonces.map((annonce) => (
                <tr key={annonce.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {annonce.imageUrl && (
                        <img
                          src={annonce.imageUrl}
                          alt={annonce.title}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {annonce.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {annonce.typeAnnonceNom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {annonce.categorieAnnonceNom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(annonce.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        annonce.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {annonce.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(annonce)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(annonce)}
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'annonce "${annonceToDelete?.title}" ?`}
      />
    </div>
  );
};

export default AnnonceManager;
