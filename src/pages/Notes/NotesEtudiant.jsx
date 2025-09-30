import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AutContext";
import { motion } from "framer-motion";
import { showToast } from "../../components/common/Toasts";
import { getNotesParEtudiant } from "../../services/note.service";
import PermissionWrapper from "../../components/PermissionWrapper";

const NotesEtudiant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotesParEtudiant(user.id);
        setNotes(response);
      } catch (err) {
        console.error("Erreur lors de la récupération des notes:", err);
        showToast("error", "Erreur lors de la récupération des notes");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNotes();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PermissionWrapper permission="NOTE_READ">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Mes notes</h2>
            <p className="text-indigo-100 mt-2">Consultez vos résultats par matière</p>
          </div>

          <div className="p-6">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500">Aucune note disponible</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matière
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
                          <div className="text-sm text-gray-900">{note.matiereNom}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            note.valeur >= 10 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {note.valeur}/20
                          </span>
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
            )}
          </div>
        </div>
      </div>
    </PermissionWrapper>
  );
};

export default NotesEtudiant;
