import  { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Percent,
  RefreshCw,
  Calendar,
  DollarSign,
  Users,
  Save,
  Info,
} from "lucide-react";
import Toast from "../../../components/common/Toasts";
import Spinner from "../../../components/common/Spinner";

const LoanSettings = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    interestRate: 5, // Taux d'intérêt en pourcentage
    maxLoansPerYear: 3, // Nombre max d'emprunts par an
    maxLoanAmount: 1000, // Montant maximum d'emprunt
    minLoanAmount: 100, // Montant minimum d'emprunt
    maxLoanDuration: 12, // Durée maximale en mois
    minMembershipDuration: 6, // Durée minimale d'adhésion en mois
    maxActiveLoans: 1, // Nombre max d'emprunts actifs simultanés
    waitingPeriodBetweenLoans: 1, // Période d'attente entre deux emprunts en mois
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setToast({
        type: "success",
        message: "Paramètres mis à jour avec succès",
      });
      setHasChanges(false);
    } catch (error) {
      setToast({
        type: "error",
        message: "Erreur lors de la mise à jour des paramètres",
      });
    } finally {
      setLoading(false);
    }
  };

  const parameterSections = [
    {
      title: "Paramètres financiers",
      icon: DollarSign,
      settings: [
        {
          key: "interestRate",
          label: "Taux d'intérêt",
          description: "Taux d'intérêt annuel appliqué aux emprunts",
          type: "number",
          unit: "%",
          min: 0,
          max: 100,
          step: 0.5,
        },
        {
          key: "maxLoanAmount",
          label: "Montant maximum d'emprunt",
          description: "Montant maximum qu'un membre peut emprunter",
          type: "number",
          unit: "FCFA",
          min: 100,
          step: 100,
        },
        {
          key: "minLoanAmount",
          label: "Montant minimum d'emprunt",
          description: "Montant minimum qu'un membre peut emprunter",
          type: "number",
          unit: "FCFA",
          min: 0,
          step: 50,
        },
      ],
    },
    {
      title: "Limites et restrictions",
      icon: RefreshCw,
      settings: [
        {
          key: "maxLoansPerYear",
          label: "Nombre maximum d'emprunts par an",
          description:
            "Nombre maximum de fois qu'un membre peut emprunter dans l'année",
          type: "number",
          min: 1,
          max: 12,
        },
        {
          key: "maxActiveLoans",
          label: "Emprunts actifs simultanés",
          description:
            "Nombre maximum d'emprunts actifs qu'un membre peut avoir en même temps",
          type: "number",
          min: 1,
          max: 5,
        },
      ],
    },
    {
      title: "Durées et périodes",
      icon: Calendar,
      settings: [
        {
          key: "maxLoanDuration",
          label: "Durée maximale de l'emprunt",
          description: "Durée maximale en mois pour rembourser un emprunt",
          type: "number",
          unit: "mois",
          min: 1,
          max: 24,
        },
        {
          key: "minMembershipDuration",
          label: "Durée minimale d'adhésion",
          description: "Durée minimale d'adhésion requise pour emprunter",
          type: "number",
          unit: "mois",
          min: 0,
        },
        {
          key: "waitingPeriodBetweenLoans",
          label: "Période d'attente entre emprunts",
          description: "Délai minimum entre deux emprunts",
          type: "number",
          unit: "mois",
          min: 0,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Paramètres des emprunts
            </h2>
          </div>

          {hasChanges && (
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <Info className="w-4 h-4" />
              <span>Modifications non sauvegardées</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {parameterSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <SectionIcon className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.settings.map((setting) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <div className="relative">
                        <input
                          type={setting.type}
                          value={settings[setting.key]}
                          onChange={(e) =>
                            handleChange(
                              setting.key,
                              setting.type === "number"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          min={setting.min}
                          max={setting.max}
                          step={setting.step}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        {setting.unit && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {setting.unit}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <motion.button
              type="submit"
              disabled={loading || !hasChanges}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                hasChanges
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default LoanSettings;
