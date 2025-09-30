import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AutContext";
import { motion } from "framer-motion";
import { showToast } from "../../components/common/Toasts";
import { ajouterNote } from "../../services/note.service";
import { matiereService } from "../../services/matiere.service";
import { getEtudiantsByNiveau } from "../../services/etudiant.service";
import PermissionWrapper from "../../components/PermissionWrapper";

const AjoutNote = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  // Charger les matières de l'enseignant
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        // TODO: Adapter selon votre API pour récupérer les matières d'un enseignant
        const response = await matiereService.getMatieresByEnseignant(user.id);
        setMatieres(response);
      } catch (error) {
        showToast("error", "Erreur lors du chargement des matières");
      }
    };

    if (user?.id) {
      fetchMatieres();
    }
  }, [user?.id]);

  // Charger les étudiants quand un niveau est sélectionné
  useEffect(() => {
    const fetchEtudiants = async () => {
      if (!selectedNiveauId) return;
      try {
        const response = await getEtudiantsByNiveau(selectedNiveauId);
        setEtudiants(response);
      } catch (error) {
        showToast("error", "Erreur lors du chargement des étudiants");
      }
    };

    fetchEtudiants();
  }, [selectedNiveauId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await ajouterNote(noteData);
      showToast("success", "Note ajoutée avec succès");
      resetForm();
    } catch (error) {
      showToast("error", "Erreur lors de l'ajout de la note");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!noteData.valeur || noteData.valeur < 0 || noteData.valeur > 20) {
      showToast("error", "La note doit être comprise entre 0 et 20");
      return false;
    }
    if (!noteData.matiereId || !noteData.etudiantId || !noteData.niveauId) {
      showToast("error", "Veuillez remplir tous les champs");
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
              {/* Sélection de la matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière
                </label>
                <select
                  value={noteData.matiereId}
                  onChange={(e) => {
                    const matiere = matieres.find(m => m.id === parseInt(e.target.value));
                    setNoteData(prev => ({
                      ...prev,
                      matiereId: e.target.value,
                      niveauId: matiere?.niveauId || ""
                    }));
                    setSelectedNiveauId(matiere?.niveauId || "");
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner une matière</option>
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
                  onChange={(e) => setNoteData(prev => ({...prev, etudiantId: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={!selectedNiveauId}
                >
                  <option value="">Sélectionner un étudiant</option>
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
                  onChange={(e) => setNoteData(prev => ({...prev, valeur: parseFloat(e.target.value)}))}
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
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
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
