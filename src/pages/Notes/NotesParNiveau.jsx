import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { showToast } from "../../components/common/Toasts";
import { getNotesParMatiereEtNiveau, updateNote } from "../../services/note.service";
import { niveauService } from "../../services/niveau.service";
import { matiereService } from "../../services/matiere.service";
import PermissionWrapper from "../../components/PermissionWrapper";

export { NotesParNiveau as default };

function NotesParNiveau() {
  const [loading, setLoading] = useState(false);
  const [niveaux, setNiveaux] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNiveauId, setSelectedNiveauId] = useState("");
  const [selectedMatiereId, setSelectedMatiereId] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteValue, setNewNoteValue] = useState("");

  // Charger les niveaux et matières
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [niveauxResponse, matieresResponse] = await Promise.all([
          niveauService.getNiveaux(),
          matiereService.getAllMatieres()
        ]);
        setNiveaux(niveauxResponse);
        setMatieres(matieresResponse);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        showToast("error", "Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!selectedNiveauId || !selectedMatiereId) return;
    
    setLoading(true);
    try {
      const response = await getNotesParMatiereEtNiveau(selectedMatiereId, selectedNiveauId);
      setNotes(response);
    } catch (err) {
      console.error("Erreur lors de la récupération des notes:", err);
      showToast("error", "Erreur lors de la récupération des notes");
    } finally {
      setLoading(false);
    }
  }, [selectedNiveauId, selectedMatiereId]);

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNoteValue(note.valeur.toString());
  };

  const handleUpdateNote = async (noteId) => {
    if (newNoteValue === "" || isNaN(newNoteValue) || parseFloat(newNoteValue) < 0 || parseFloat(newNoteValue) > 20) {
      showToast("error", "La note doit être comprise entre 0 et 20");
      return;
    }

    setLoading(true);
    try {
      await updateNote(noteId, {
        valeur: parseFloat(newNoteValue),
        matiereId: selectedMatiereId,
        etudiantId: editingNote.etudiantId,
        enseignantId: editingNote.enseignantId,
        niveauId: selectedNiveauId
      });
      
      // Rafraîchir la liste des notes
      await fetchNotes();
      showToast("success", "Note mise à jour avec succès");
      setEditingNote(null);
      setNewNoteValue("");
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la note:", err);
      showToast("error", "Erreur lors de la mise à jour de la note");
    } finally {
      setLoading(false);
    }
  };

  // Charger les notes quand niveau et matière sont sélectionnés
  useEffect(() => {
    fetchNotes();
  }, [selectedNiveauId, selectedMatiereId, fetchNotes]);

  return (
    <PermissionWrapper permission="NOTE_READ_ALL">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Notes par niveau</h2>
            <p className="text-indigo-100 mt-2">Consultez les notes par niveau et par matière</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sélection du niveau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  value={selectedNiveauId}
                  onChange={(e) => setSelectedNiveauId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map(niveau => (
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
                  value={selectedMatiereId}
                  onChange={(e) => setSelectedMatiereId(e.target.value)}
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
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étudiant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enseignant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notes.map((note) => (
                      <motion.tr
                        key={note.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{note.etudiantNom}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingNote?.id === note.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={newNoteValue}
                                onChange={(e) => setNewNoteValue(e.target.value)}
                                className="w-20 p-1 border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => handleUpdateNote(note.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNote(null);
                                  setNewNoteValue("");
                                }}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                note.valeur >= 10 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {note.valeur}/20
                              </span>
                              <button
                                onClick={() => handleEditNote(note)}
                                className="p-1 text-indigo-600 hover:text-indigo-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{note.enseignantNom}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(note.dateAjout).toLocaleDateString()}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {selectedNiveauId && selectedMatiereId 
                  ? "Aucune note disponible pour cette sélection" 
                  : "Sélectionnez un niveau et une matière pour voir les notes"}
              </p>
            )}
          </div>
        </div>
      </div>
    </PermissionWrapper>
  );
}
