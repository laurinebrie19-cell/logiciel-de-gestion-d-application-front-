import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save,Building2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createFonctionBureau,
  updateFonctionBureau,
  getFonctionBureauById,
} from "../../../services/fonctionBureau.service";

const FonctionBureauForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fonction = location.state?.fonction;
  const isEditing = Boolean(fonction);

  const [formData, setFormData] = useState({
    libelle: fonction?.libelle || "",
    description: fonction?.description || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const loadFonction = async () => {
        try {
          const data = await getFonctionBureauById(fonction.id);
          setFormData({
            libelle: data.libelle,
            description: data.description,
          });
        } catch (error) {
          toast.error("Erreur lors du chargement de la fonction");
          navigate("/admin/fonctions-bureau");
        }
      };
      loadFonction();
    }
  }, [fonction, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await updateFonctionBureau(fonction.id, formData);
        toast.success("Fonction mise à jour avec succès");
      } else {
        await createFonctionBureau(formData);
        toast.success("Fonction créée avec succès");
      }
      navigate("/admin/fonctions-bureau");
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* En-tête stylisé */}
      <div className="bg-blue-900 rounded-t-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/fonctions-bureau")}
            className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Building2 className="w-7 h-7 text-blue-200" />
              <span>{isEditing ? "Modifier la fonction" : "Nouvelle fonction"}</span>
            </h1>
            <p className="text-blue-200 mt-1">
              {isEditing 
                ? "Modifier les informations de la fonction du bureau"
                : "Créer une nouvelle fonction pour le bureau"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl p-8 border-t border-blue-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Champ Libellé */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Libellé de la fonction
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="libelle"
                value={formData.libelle}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-lg
                         focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="Ex: Président, Trésorier, Secrétaire..."
              />
            </div>
          </div>

          {/* Champ Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description des responsabilités
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="block w-full px-4 py-3 border-gray-300 rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 transition-colors
                       resize-none shadow-sm"
              placeholder="Décrivez les principales responsabilités de cette fonction..."
            />
          </div>

          {/* Bouton de soumission */}
          <div className="flex items-center justify-end pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/fonctions-bureau")}
              className="mr-4 px-6 py-3 border border-gray-300 text-gray-700
                       text-sm font-medium rounded-lg hover:bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-900 text-white text-sm font-medium
                       rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500 transition-colors
                       disabled:opacity-50 inline-flex items-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Mettre à jour" : "Créer la fonction"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FonctionBureauForm;