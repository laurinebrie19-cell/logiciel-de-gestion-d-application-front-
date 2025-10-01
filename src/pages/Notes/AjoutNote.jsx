import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AutContext";
import { motion } from "framer-motion";
import { showToast } from "../../components/common/Toasts";
import { ajouterNote } from "../../services/note.service";
import { matiereService } from "../../services/matiere.service";
import { getEtudiantsByNiveau } from "../../services/etudiant.service";
import { niveauService } from "../../services/niveau.service";
import PermissionWrapper from "../../components/PermissionWrapper";

const AjoutNote = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [niveaux, setNiveaux] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [selectedNiveauId, setSelectedNiveauId] = useState("");
  const [selectedMatiereId, setSelectedMatiereId] = useState("");

  const [noteData, setNoteData] = useState({
    valeur: "",
    matiereId: "",
    etudiantId: "",
    enseignantId: user?.id,
    niveauId: ""
  });

  // Charger les niveaux au démarrage
  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await niveauService.getNiveaux();
        if (Array.isArray(response)) {
          setNiveaux(response);
          if (response.length === 0) {
            showToast("warning", "Aucun niveau disponible");
          }
        } else {
          console.error("Format de réponse inattendu pour les niveaux:", response);
          setNiveaux([]);
          showToast("error", "Erreur de format dans la réponse des niveaux");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des niveaux:", error);
        showToast("error", "Impossible de charger les niveaux. Veuillez réessayer.");
        setNiveaux([]);
      }
    };

    fetchNiveaux();
  }, []);

  // Charger les matières quand un niveau est sélectionné
  useEffect(() => {
    const fetchMatieres = async () => {
      if (!selectedNiveauId) {
        setMatieres([]);
        return;
      }
      try {
        const response = await matiereService.getMatieresByNiveau(selectedNiveauId);
        if (Array.isArray(response)) {
          setMatieres(response);
          if (response.length === 0) {
            showToast("warning", "Aucune matière disponible pour ce niveau");
          }
        } else {
          console.error("Format de réponse inattendu pour les matières:", response);
          setMatieres([]);
          showToast("error", "Erreur lors de la récupération des matières");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des matières:", error);
        showToast("error", "Impossible de charger les matières. Veuillez réessayer.");
        setMatieres([]);
      }
    };

    const fetchEtudiants = async () => {
      if (!selectedNiveauId) {
        setEtudiants([]);
        return;
      }
      try {
        const response = await getEtudiantsByNiveau(selectedNiveauId);
        if (Array.isArray(response)) {
          setEtudiants(response);
          if (response.length === 0) {
            showToast("warning", "Aucun étudiant inscrit dans ce niveau");
          }
        } else {
          console.error("Format de réponse inattendu pour les étudiants:", response);
          setEtudiants([]);
          showToast("error", "Erreur lors de la récupération des étudiants");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants:", error);
        showToast("error", "Impossible de charger la liste des étudiants");
        setEtudiants([]);
      }
    };

    // Charger les matières et les étudiants en parallèle
    Promise.all([fetchMatieres(), fetchEtudiants()]).catch(error => {
      console.error("Erreur lors du chargement des données:", error);
      showToast("error", "Une erreur est survenue lors du chargement des données");
    });
  }, [selectedNiveauId]);

  const handleSubmit = async () => {
    if (!validate()) return;

    // Vérification supplémentaire de l'enseignant
    if (!user?.id) {
      showToast("error", "Vous devez être connecté en tant qu'enseignant pour ajouter une note");
      return;
    }

    try {
      setIsLoading(true);
      const noteToSubmit = {
        ...noteData,
        enseignantId: user.id, // ID de l'enseignant connecté
        valeur: parseFloat(noteData.valeur),
        matiereId: parseInt(noteData.matiereId),
        etudiantId: parseInt(noteData.etudiantId),
        niveauId: parseInt(noteData.niveauId)
      };
      const response = await ajouterNote(noteToSubmit);
      if (response) {
        showToast("success", "Note ajoutée avec succès");
        resetForm();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de l'ajout de la note";
      showToast("error", errorMessage);
      console.error("Erreur d'ajout de note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    if (!noteData.valeur || isNaN(noteData.valeur) || parseFloat(noteData.valeur) < 0 || parseFloat(noteData.valeur) > 20) {
      showToast("error", "La note doit être comprise entre 0 et 20");
      return false;
    }
    if (!noteData.matiereId) {
      showToast("error", "Veuillez sélectionner une matière");
      return false;
    }
    if (!noteData.etudiantId) {
      showToast("error", "Veuillez sélectionner un étudiant");
      return false;
    }
    if (!noteData.niveauId) {
      showToast("error", "Le niveau n'a pas été défini");
      return false;
    }
    if (!user?.id) {
      showToast("error", "Erreur: ID de l'enseignant non disponible");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setNoteData({
      valeur: "",
      matiereId: "",
      etudiantId: "",
      enseignantId: user?.id,
      niveauId: ""
    });
    setSelectedNiveauId("");
    setSelectedMatiereId("");
  };

  return (
    <PermissionWrapper permission="NOTE_CREATE">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Ajouter une note</h2>
            <p className="text-indigo-100 mt-2">Saisissez les notes des étudiants</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sélection du niveau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  value={selectedNiveauId}
                  onChange={(e) => {
                    const newNiveauId = e.target.value;
                    console.log('Niveau sélectionné:', newNiveauId); // Pour déboguer
                    setSelectedNiveauId(newNiveauId);
                    setNoteData(prev => ({
                      ...prev,
                      niveauId: newNiveauId,
                      matiereId: "",
                      etudiantId: ""
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner un niveau</option>
                  {Array.isArray(niveaux) && niveaux.map(niveau => (
                    <option key={niveau.id} value={niveau.id}>
                      {niveau.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection de la matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière
                </label>
                <select
                  value={noteData.matiereId}
                  onChange={(e) => {
                    setNoteData(prev => ({
                      ...prev,
                      matiereId: e.target.value
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={!selectedNiveauId}
                >
                  <option value="">
                    {!selectedNiveauId
                      ? "Veuillez d'abord sélectionner un niveau"
                      : matieres.length === 0
                        ? "Chargement des matières..."
                        : "Sélectionner une matière"
                    }
                  </option>
                  {matieres.map(matiere => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection de l'étudiant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étudiant
                </label>
                <select
                  value={noteData.etudiantId}
                  onChange={(e) => setNoteData(prev => ({ ...prev, etudiantId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={!selectedNiveauId || etudiants.length === 0}
                >
                  <option value="">
                    {!selectedNiveauId
                      ? "Veuillez d'abord sélectionner une matière"
                      : etudiants.length === 0
                        ? "Chargement des étudiants..."
                        : "Sélectionner un étudiant"
                    }
                  </option>
                  {etudiants.map(etudiant => (
                    <option key={etudiant.id} value={etudiant.id}>
                      {etudiant.nom} {etudiant.prenom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Saisie de la note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (/20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  value={noteData.valeur}
                  onChange={(e) => setNoteData(prev => ({ ...prev, valeur: parseFloat(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Réinitialiser
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : "Enregistrer la note"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </PermissionWrapper>
  );
};

export default AjoutNote;
