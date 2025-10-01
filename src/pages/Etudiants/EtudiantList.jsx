import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEtudiants, deleteEtudiant } from "../../services/etudiant.service";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2, Edit, Eye } from "react-feather";
import { showToast } from "../../components/common/Toasts";
import { useAuth } from "../../contexts/AutContext";
import PermissionWrapper from "../../components/PermissionWrapper";
import { niveauService } from "../../services/niveau.service";

const EtudiantList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");
  const [etudiants, setEtudiants] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setStatus("loading");
      try {
        const [etudiantsData, niveauxData] = await Promise.all([
          getAllEtudiants(),
          niveauService.getNiveaux()
        ]);
        setEtudiants(etudiantsData || []);
        setNiveaux(niveauxData || []);
        setStatus("success");
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Erreur lors du chargement des données");
        setStatus("error");
      }
    };

    loadData();
  }, []);

  const handleDelete = async () => {
    if (!selectedEtudiant) return;
    setDeleteLoading(true);
    try {
      await deleteEtudiant(selectedEtudiant.id);
      setEtudiants((prev) => prev.filter((e) => e.id !== selectedEtudiant.id));
      showToast("success", "Étudiant supprimé avec succès");
      setShowDeleteModal(false);
    } catch (err) {
      showToast("error", "Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEtudiants = etudiants.filter((e) => {
    // Si l'utilisateur est un étudiant, ne montrer que son compte
    if (user?.role === "Etudiant") {
      return e.email === user.email;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    // Recherche améliorée
    const searchMatch = searchTermLower === "" || [
      e.nom,
      e.prenom,
      e.matricule,
      e.email
    ].some(field => field?.toLowerCase().includes(searchTermLower));

    // Filtre par niveau
    const niveauMatch = selectedNiveau === "Tous" || niveaux.find(n => n.id === parseInt(selectedNiveau))?.nom === e.niveau;

    return searchMatch && niveauMatch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des étudiants</h1>
            <p className="text-indigo-100 text-sm">Gérez vos étudiants, leurs informations et leurs parcours académiques</p>
          </div>
          <PermissionWrapper permission="ETUDIANT_CREATE">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/etudiants/nouveau")}
              className="bg-white text-indigo-700 px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel étudiant
            </motion.button>
          </PermissionWrapper>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <select
                value={selectedNiveau}
                onChange={(e) => setSelectedNiveau(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-all duration-200"
              >
                <option value="Tous">Tous les niveaux</option>
                {niveaux.map((niveau) => (
                  <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Matricule
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nom
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Prénom
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date de naissance
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Sexe
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Niveau
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {status === "loading" && (
                  <tr>
                    <td colSpan="7" className="text-center py-8">
                      <span className="text-indigo-500 animate-pulse">Chargement...</span>
                    </td>
                  </tr>
                )}
                {status === "error" && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-red-500">{error}</td>
                  </tr>
                )}
                {status === "success" && filteredEtudiants.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">Aucun étudiant trouvé</td>
                  </tr>
                )}
                {status === "success" && filteredEtudiants.map((e) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-mono rounded-full bg-indigo-100 text-indigo-800">
                        {e.matricule}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{e.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{e.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(e.dateNaissance).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${e.sexe === "Masculin" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                        }`}>
                        {e.sexe}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-green-100 text-green-800">
                        {e.niveau || "Non défini"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/etudiants/${e.id}`)}
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <Eye size={18} />
                        </motion.button>
                        <PermissionWrapper permission="ETUDIANT_UPDATE">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/etudiants/modifier/${e.id}`)}
                            className="text-amber-600 hover:text-amber-800 bg-amber-50 p-2 rounded-lg transition-all duration-200"
                          >
                            <Edit size={18} />
                          </motion.button>
                        </PermissionWrapper>
                        <PermissionWrapper permission="ETUDIANT_DELETE">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedEtudiant(e);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </PermissionWrapper>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
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

export default EtudiantList;
