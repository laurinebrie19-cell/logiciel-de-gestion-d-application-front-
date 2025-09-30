import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getNiveauxByEnseignant } from "../../services/user.service";
import { useAuth } from "../../contexts/AutContext";
import { Loader2, Users, BookOpen } from "lucide-react";
import { showToast } from "../../components/common/Toasts";

const MesNiveaux = () => {
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const data = await getNiveauxByEnseignant(user.id);
        setNiveaux(data);
      } catch (error) {
        showToast("error", "Erreur lors de la récupération des niveaux");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNiveaux();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mes Niveaux</h1>
        <p className="text-gray-600">
          Liste des niveaux et classes dont vous avez la charge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niveaux.map((niveau) => (
          <motion.div
            key={niveau.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {niveau.filiere?.nom}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {niveau.nom}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {niveau.nombreEtudiants || 0} étudiants
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {niveau.matieres?.map((matiere) => (
                  <span
                    key={matiere.id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {matiere.nom}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                Voir les détails
              </button>
            </div>
          </motion.div>
        ))}

        {niveaux.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="mb-4">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Aucun niveau assigné
            </h3>
            <p className="mt-1 text-gray-500">
              Vous n&apos;avez pas encore de niveaux ou de classes assignés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesNiveaux;
