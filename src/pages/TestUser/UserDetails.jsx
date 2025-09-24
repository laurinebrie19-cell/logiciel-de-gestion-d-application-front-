import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Activity,
  X,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, deleteUser } from "../../services/user.service";
import Toast from "./Toasts";
import PermissionWrapper from "../../components/PermissionWrapper";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const showToastMessage = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
    }, 5000);
  };

  // Charger les données de l'utilisateur avec gestion d'erreur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);

        if (!response) {
          throw new Error("Utilisateur non trouvé");
        }

        setUser({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phone: response.phoneNumber,
          address: response.address,
          role: response.roles?.[0] || "Membre",
          status: response.status || "Actif",
          createdAt: response.createdAt || new Date().toISOString(),
          lastLogin: response.lastLogin || new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.firstName}`,
        });
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
        setError(error.message || "Erreur de chargement des données");
        showToastMessage(
          error.message || "Erreur de chargement des données de l'utilisateur",
          "error"
        );

        // Rediriger après 3 secondes si l'utilisateur n'existe pas
        if (error.message.includes("non trouvé")) {
          setTimeout(() => navigate("/users"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  // Gérer la suppression de l'utilisateur
  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await deleteUser(id);
      showToastMessage("Utilisateur supprimé avec succès", "success");
      setTimeout(() => {
        navigate("/users");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      showToastMessage(
        error.message || "Erreur lors de la suppression de l'utilisateur",
        "error"
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <WifiOff className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error} Veuillez réessayer plus tard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Composant StatCard
  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-100 rounded-lg p-2">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  return (
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
                Détails de l'utilisateur
              </h2>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <PermissionWrapper permission="USER_UPDATE">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/users/edit/${id}`)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </motion.button>
                </PermissionWrapper>
                <PermissionWrapper permission="USER_DELETE">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </motion.button>
                </PermissionWrapper>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {user && (
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-medium text-indigo-700">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="mt-1 flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Actif"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={Calendar}
                label="Date d'inscription"
                value={new Date(user.createdAt).toLocaleDateString()}
              />
              <StatCard
                icon={Activity}
                label="Dernière connexion"
                value={new Date(user.lastLogin).toLocaleDateString()}
              />
              <StatCard
                icon={Shield}
                label="Statut du compte"
                value={user.status}
              />
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {user.phone || "Non renseigné"}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {user.address || "Non renseignée"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 border border-gray-200"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-red-600">
                  Confirmer la suppression
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600">
                      Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                      <span className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>{" "}
                      ? Cette action est irréversible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  {deleteLoading
                    ? "Suppression..."
                    : "Supprimer définitivement"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserDetails;
