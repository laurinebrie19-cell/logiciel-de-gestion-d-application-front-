import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEtudiantById, deleteEtudiant } from "../../services/etudiant.service";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "react-feather";
import { showToast } from "../../components/common/Toasts";

const EtudiantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEtudiantById(id)
      .then((data) => {
        setEtudiant(data);
        setError(null);
      })
      .catch(() => {
        setError("Erreur lors du chargement de l'étudiant");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEtudiant(id);
      showToast("success", "Étudiant supprimé avec succès");
      navigate("/etudiants");
    } catch {
      showToast("error", "Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-indigo-500 animate-pulse">Chargement...</span>
      </div>
    );
  }
  if (error || !etudiant) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle size={32} />
        <span className="mt-2">{error || "Étudiant introuvable"}</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/10 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Détails de l&apos;étudiant</h2>
              <p className="text-indigo-100 mt-1">Informations complètes de l&apos;étudiant</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-500">Matricule</p>
              <p className="font-mono text-lg font-semibold text-indigo-600">{etudiant.matricule}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="text-lg font-semibold">{etudiant.nom} {etudiant.prenom}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="text-lg">{new Date(etudiant.dateNaissance).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-500">Sexe</p>
              <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                etudiant.sexe === "Masculin" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
              }`}>
                {etudiant.sexe}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1 md:col-span-2">
              <p className="text-sm text-gray-500">Niveau d&apos;études</p>
              <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {etudiant.niveau}
              </p>
            </div>
          </div>
        <div className="flex justify-end gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/etudiants")}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/etudiants/modifier/${etudiant.id}`)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </motion.button>
        </div>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full"
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-500 mr-2" />
                <span className="font-semibold text-lg">Confirmer la suppression</span>
              </div>
              <p className="mb-6">Voulez-vous vraiment supprimer cet étudiant ?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={deleteLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EtudiantDetails;
