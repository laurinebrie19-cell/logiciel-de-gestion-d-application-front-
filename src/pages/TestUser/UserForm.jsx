import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Key,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/common/Toasts";
import ConfirmSaveModal from "./SaveModal";
import { getAllRoles } from "../../services/role.service";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../services/user.service";
import PermissionWrapper from "../../components/PermissionWrapper";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AutContext";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    sex: "",
    dateOfBirth: "",
    roleIds: [],
    confirmPassword: "",
    status: "Actif",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "success",
  });
    const { user } = useAuth(); // pour récupérer l'utilisateur connecté
  const [isBureau, setIsBureau] = useState(false);
  const [fonctionsBureau, setFonctionsBureau] = useState([]);
  const [fonctionBureauId, setFonctionBureauId] = useState("");

  // Nouveaux états pour afficher/cacher les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Charger les rôles avec gestion d'erreur
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        if (!response) {
          throw new Error("Aucun rôle disponible");
        }
        setRoles(response);
      } catch (error) {
        console.error("Erreur de chargement des rôles:", error);

        setToastState({
          show: true,
          message: error.message || "Erreur de chargement des rôles",
          type: "error",
        });
      }
    };
    fetchRoles();
  }, []);

  // Vérifier si l'utilisateur connecté a le rôle de bureau

    useEffect(() => {
    if (user?.permissions?.includes("ADD_MEMBRE_BUREAU")) {
      import("../../services/fonctionBureau.service").then(({ getAllFonctionsBureau }) => {
        getAllFonctionsBureau().then(setFonctionsBureau).catch(() => setFonctionsBureau([]));
      });
    }
  }, [user]);

  // Charger l'utilisateur en mode édition avec gestion d'erreur
  useEffect(() => {
    const fetchUser = async () => {
      if (isEditing && roles.length > 0) {
        try {
          const userData = await getUserById(id);
          if (!userData) {
            throw new Error("Utilisateur non trouvé");
          }

          // Trouver le rôle correspondant
          const userRole = roles.find(
            (role) => role.roleName === userData.roles[0]
          );

          setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            password: "",
            address: userData.address,
            sex: userData.sex,
            dateOfBirth: userData.dateOfBirth,
            roleIds: userRole ? [userRole.id] : [],
            role: userData.roles[0] || "",
            confirmPassword: "",
            status: userData.status || "Actif",
          });
          // Correction : si fonctionBureauId est défini (non null/undefined), alors c'est un membre du bureau
          if (userData.fonctionBureauId !== null && userData.fonctionBureauId !== undefined && userData.fonctionBureauId !== "") {
            setIsBureau(true);
            setFonctionBureauId(String(userData.fonctionBureauId));
          } else {
            setIsBureau(false);
            setFonctionBureauId("");
          }
        } catch (error) {
          console.error("Erreur de chargement de l'utilisateur:", error);
          setToastState({
            show: true,
            message:
              error.message || "Erreur de chargement des données utilisateur",
            type: "error",
          });
          setTimeout(() => navigate("/users"), 3000); // Redirige si l'utilisateur n'existe pas
        } finally {
          setInitialLoading(false);
        }
      }
    };

    if (isEditing && roles.length > 0) {
      fetchUser();
    }
  }, [isEditing, id, roles, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName) newErrors.lastName = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (
      formData.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    } else if (!/^\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Le numéro de téléphone doit être composé de 9 chiffres";
    }
    if (!formData.address) newErrors.address = "L'adresse est requise";
    if (!formData.sex) newErrors.sex = "Le sexe est requis";
    if (!formData.status) newErrors.status = "Le statut est requis";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "La date de naissance est requise";
    if (formData.roleIds.length === 0) newErrors.roleIds = "Le rôle est requis";
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 6) {
        newErrors.password =
          "Le mot de passe doit contenir au moins 6 caractères";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    return newErrors;
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSaveLoading(true);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth,
        roleIds: formData.roleIds,
        role: formData.role,
        status: formData.status,
        
      };

      if (user?.permissions?.includes("ADD_MEMBRE_BUREAU")) {
        userData.fonctionBureauId = isBureau ? Number(fonctionBureauId) : null;
        userData.actorEmail = user.email;
      }

      if (isEditing) {
        await updateUser(id, userData);
        toast.success("Utilisateur modifié avec succès");
      } else {
        await createUser(userData);
        toast.success("Utilisateur créé avec succès");
      }

      navigate("/users");
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      toast.error(
        error.message || "Erreur lors de la sauvegarde de l'utilisateur"
      );
    } finally {
      setSaveLoading(false);
      setShowSaveModal(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PermissionWrapper permission={isEditing ? "USER_UPDATE" : "USER_CREATE"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/users")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </motion.button>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Enregistrer
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.firstName ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                    placeholder="michael"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.lastName ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                    placeholder="Klauss"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                    placeholder="klauss@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                    placeholder="620202020"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Sexe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexe
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.sex ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Sélectionnez un sexe</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
                {errors.sex && (
                  <p className="mt-1 text-sm text-red-500">{errors.sex}</p>
                )}
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                    placeholder="Poste centrale"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  name="roleIds"
                  value={formData.roleIds[0] || ""}
                  onChange={(e) => {
                    const selectedRole = roles.find(
                      (role) => role.id === parseInt(e.target.value)
                    );
                    setFormData((prev) => ({
                      ...prev,
                      roleIds: e.target.value ? [parseInt(e.target.value)] : [],
                      role: selectedRole ? selectedRole.roleName : "",
                    }));
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.roleIds ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  disabled={roles.length === 0}
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucun rôle disponible
                    </option>
                  )}
                </select>
                {errors.roleIds && (
                  <p className="mt-1 text-sm text-red-500">{errors.roleIds}</p>
                )}
                {roles.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Impossible de charger les rôles
                  </p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.status ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Mot de passe et confirmation (création uniquement) */}
              {!isEditing && (
                <>
                  {/* Mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                          errors.password ? "border-red-500" : "border-gray-200"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Champ membre du bureau (création ET édition) */}
              {user?.permissions?.includes("ADD_MEMBRE_BUREAU") && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Est-ce un membre du bureau ?
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isBureau"
                        value="oui"
                        checked={isBureau === true}
                        onChange={() => setIsBureau(true)}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isBureau"
                        value="non"
                        checked={isBureau === false}
                        onChange={() => setIsBureau(false)}
                        className="form-radio text-indigo-600"
                      />
                      <span className="ml-2">Non</span>
                    </label>
                  </div>
                  {isBureau && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonction dans le bureau
                      </label>
                      <select
                        value={fonctionBureauId}
                        onChange={e => setFonctionBureauId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionnez une fonction</option>
                        {fonctionsBureau.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.libelle}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal de confirmation de sauvegarde */}
        <ConfirmSaveModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onConfirm={handleConfirmSave}
          loading={saveLoading}
          isEditing={isEditing}
        />

        {/* Toast de notification */}
        {toastState.show && (
          <Toast
            message={toastState.message}
            type={toastState.type}
            onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
          />
        )}
      </motion.div>
    </PermissionWrapper>
  );
};

export default UserForm;
