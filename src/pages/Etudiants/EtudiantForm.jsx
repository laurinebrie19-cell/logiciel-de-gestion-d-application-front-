import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEtudiantById, createEtudiant, updateEtudiant } from "../../services/etudiant.service";
import { motion } from "framer-motion";
import { showToast } from "../../components/common/Toasts";
import FormField from "../../components/ui/FormField";

const niveaux = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];
const sexes = ["Masculin", "Féminin"];

const EtudiantForm = () => {
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "",
    niveau: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      setInitialLoading(true);
      getEtudiantById(id)
        .then((data) => {
          setFormData({
            nom: data.nom || "",
            prenom: data.prenom || "",
            dateNaissance: data.dateNaissance ? data.dateNaissance.slice(0, 10) : "",
            sexe: data.sexe || "",
            niveau: data.niveau || "",
          });
        })
        .catch(() => {
          showToast("error", "Erreur lors du chargement de l'étudiant");
          navigate("/etudiants");
        })
        .finally(() => setInitialLoading(false));
    }
  }, [isEditing, id, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.dateNaissance) newErrors.dateNaissance = "Date de naissance requise";
    if (!formData.sexe) newErrors.sexe = "Le sexe est requis";
    if (!formData.niveau) newErrors.niveau = "Le niveau est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await updateEtudiant(id, formData);
        showToast("success", "Étudiant modifié avec succès");
      } else {
        await createEtudiant(formData);
        showToast("success", "Étudiant ajouté avec succès");
      }
      navigate("/etudiants");
    } catch {
      showToast("error", "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Informations Personnelles", icon: "👤" },
    { number: 2, title: "Détails", icon: "📋" },
    { number: 3, title: "Niveau Académique", icon: "🎓" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* En-tête avec animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 px-8 py-12"
        >
          <div className="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
          <div className="relative flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white"
              >
                {isEditing ? "Modifier l'étudiant" : "Nouvel étudiant"}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-indigo-100 mt-2"
              >
                {isEditing 
                  ? "Modifiez les informations de l'étudiant ci-dessous" 
                  : "Remplissez les informations pour créer un nouvel étudiant"}
              </motion.p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-8 flex justify-between items-center px-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg 
                    ${currentStep >= step.number 
                      ? 'bg-white text-indigo-600' 
                      : 'bg-white/20 text-white'
                    } transition-all duration-300`}
                >
                  {step.icon}
                </motion.div>
                <div className="ml-3 hidden md:block">
                  <p className="text-white text-sm font-medium">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-full h-1 bg-white/20 mx-4">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep > step.number ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Informations Personnelles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep === 1 ? 1 : 0,
              y: currentStep === 1 ? 0 : 20,
              display: currentStep === 1 ? "block" : "none"
            }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Informations Personnelles</h3>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  error={errors.nom}
                  placeholder="Nom de l'étudiant"
                  className="bg-white"
                />
                
                <FormField
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  error={errors.prenom}
                  placeholder="Prénom de l'étudiant"
                  className="bg-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2: Détails */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep === 2 ? 1 : 0,
              y: currentStep === 2 ? 0 : 20,
              display: currentStep === 2 ? "block" : "none"
            }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Détails</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Date de naissance"
                  name="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  error={errors.dateNaissance}
                  className="bg-white"
                />
                
                <FormField
                  label="Sexe"
                  name="sexe"
                  type="select"
                  value={formData.sexe}
                  onChange={handleChange}
                  error={errors.sexe}
                  options={sexes}
                  className="bg-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Step 3: Niveau Académique */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentStep === 3 ? 1 : 0,
              y: currentStep === 3 ? 0 : 20,
              display: currentStep === 3 ? "block" : "none"
            }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Information Académique</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <FormField
                label="Niveau"
                name="niveau"
                type="select"
                value={formData.niveau}
                onChange={handleChange}
                error={errors.niveau}
                options={niveaux}
                className="bg-white"
              />
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                ${currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              disabled={currentStep === 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </motion.button>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate("/etudiants")}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Annuler
              </motion.button>

              {currentStep < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 
                    transition-all duration-200 flex items-center gap-2"
                >
                  Suivant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 
                    transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {isEditing ? "Modification..." : "Création..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? "Modifier" : "Créer"}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EtudiantForm;
