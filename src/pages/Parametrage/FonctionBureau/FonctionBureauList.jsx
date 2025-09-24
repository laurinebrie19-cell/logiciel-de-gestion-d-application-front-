import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Loader2, Building2  } from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllFonctionsBureau,
  deleteFonctionBureau,
} from "../../../services/fonctionBureau.service";

const FonctionBureauList = () => {
  const navigate = useNavigate();
  const [fonctions, setFonctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFonction, setSelectedFonction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadFonctions();
  }, []);

  const loadFonctions = async () => {
    try {
      const data = await getAllFonctionsBureau();
      setFonctions(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des fonctions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFonction) return;
    
    setDeleteLoading(true);
    try {
      await deleteFonctionBureau(selectedFonction.id);
      setFonctions(fonctions.filter((f) => f.id !== selectedFonction.id));
      toast.success("Fonction supprimée avec succès");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
      setSelectedFonction(null);
    }
  };

  const filteredFonctions = fonctions.filter(
    (fonction) =>
      fonction.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fonction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="bg-blue-900 rounded-t-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-7 h-7 text-blue-200" />
          <span>Fonctions du Bureau</span>
        </h1>
        <p className="text-blue-200 mt-1">
          Gérez les différentes fonctions et responsabilités du bureau
        </p>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl p-8 border-t border-blue-100">
        {/* Barre d'actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Rechercher une fonction..."
            />
          </div>
          <button
            onClick={() => navigate("/admin/fonctions-bureau/create")}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent
                     text-sm font-medium rounded-lg shadow-sm text-white bg-blue-900
                     hover:bg-blue-800 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle fonction
          </button>
        </div>

        {/* Liste des fonctions */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFonctions.map((fonction) => (
              <div
                key={fonction.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 
                         hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate("/admin/fonctions-bureau/edit", {
                            state: { fonction },
                          })
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 
                                 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFonction(fonction);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 
                                 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {fonction.libelle}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {fonction.description || "Aucune description disponible"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* État vide */}
        {filteredFonctions.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune fonction trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer une nouvelle fonction pour le bureau.
            </p>
            <button
              onClick={() => navigate("/admin/fonctions-bureau/create")}
              className="inline-flex items-center px-4 py-2 border border-transparent
                       text-sm font-medium rounded-lg shadow-sm text-white bg-blue-900
                       hover:bg-blue-800 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer une fonction
            </button>
          </div>
        )}
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center p-4 mb-4">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Confirmer la suppression
                </h3>
                <p className="text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cette fonction ? Cette action
                  est irréversible.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 
                           rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg
                           hover:bg-red-700 transition-colors disabled:opacity-50
                           flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Supprimer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FonctionBureauList;