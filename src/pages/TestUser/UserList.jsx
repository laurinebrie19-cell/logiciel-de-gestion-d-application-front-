import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  Users,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toasts";
import { getAllUsers, deleteUser } from "../../services/user.service";
import PermissionWrapper from "../../components/PermissionWrapper";
import Spinner from "../../components/common/Spinner";

const UserList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous les rôles");
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setStatus("loading");
        const response = await getAllUsers();

        if (!response) {
          throw new Error("Le serveur n'a pas retourné de données");
        }

        setUsers(response);
        setStatus("success");
      } catch (error) {
        console.error("Erreur API:", error);
        let errorMessage = "Erreur lors de la récupération des utilisateurs";

        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Service indisponible - Impossible de se connecter au serveur";
        }

        setError(errorMessage);
        setStatus("error");
        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
        setUsers([]);

        setTimeout(() => {
          setShowToast(false);
          setToastMessage("");
        }, 5000);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true); // Activer le spinner
    try {
      await deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setToastMessage("Utilisateur supprimé avec succès");
      setToastType("success");
    } catch (error) {
      console.error("Erreur suppression:", error);
      setToastMessage("Erreur: Impossible de contacter le serveur");
      setToastType("error");
    } finally {
      setDeleteLoading(false); // Désactiver le spinner
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setToastMessage("");
      }, 5000);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const getReadableRole = (role) => {
    switch (role) {
      case "Admin":
        return "Administrateur";
      case "Tresorier":
        return "Trésorière";
      case "Membre":
        return "Membre";
      default:
        return role || "Inconnu";
    }
  };

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearchTerm = `${user?.firstName || ""} ${user?.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === "Tous les rôles" ||
      (Array.isArray(user?.roles) && user.roles.includes(selectedRole));

    const matchesStatus =
      selectedStatus === "Tous les statuts" || user?.status === selectedStatus;

    return matchesSearchTerm && matchesRole && matchesStatus;
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Chargement en cours...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <WifiOff className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Service indisponible
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error} Veuillez réessayer plus tard ou contacter le support.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Réessayer maintenant
          </button>
        </div>

        {/* Toast pour l'erreur */}
        <AnimatePresence>
          {showToast && (
            <Toast
              message={toastMessage}
              type={toastType}
              onClose={() => {
                setShowToast(false);
                setToastMessage("");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (users.length === 0 && status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun utilisateur trouvé
        </h3>

        <PermissionWrapper permission="USER_CREATE">
          <p className="text-gray-600 text-center mb-4">
            Commencez par ajouter un nouvel utilisateur.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/users/create")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel utilisateur
          </motion.button>
        </PermissionWrapper>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Utilisateurs</h2>
          <PermissionWrapper permission="USER_CREATE">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/users/create")}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel utilisateur
            </motion.button>
          </PermissionWrapper>
        </div>

        {/* Filtres et recherche */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Tous les rôles">Tous les rôles</option>
              <option value="Admin">Administrateur</option>
              <option value="Tresorier">Trésorière</option>
              <option value="Membre">Membre</option>
            </select>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table améliorée */}
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-gray-50/80 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                        <span className="text-indigo-700 font-semibold text-sm">
                          {user.firstName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-50 to-indigo-50 text-indigo-700 border border-violet-100/50 shadow-sm">
                      {getReadableRole(user.roles?.[0])}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Actif"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-100/50"
                          : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-100/50"
                      } shadow-sm`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          user.status === "Actif"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {user.status || "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <PermissionWrapper permission="USER_READ">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors group"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          <Eye className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600" />
                        </motion.button>
                      </PermissionWrapper>

                      <PermissionWrapper permission="USER_UPDATE">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors group"
                          onClick={() => navigate(`/users/edit/${user.id}`)}
                        >
                          <Edit2 className="w-4 h-4 text-violet-500 group-hover:text-violet-600" />
                        </motion.button>
                      </PermissionWrapper>

                      <PermissionWrapper permission="USER_DELETE">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                        </motion.button>
                      </PermissionWrapper>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pagination améliorée */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Affichage de{" "}
            <span className="font-medium">{filteredUsers.length}</span> sur{" "}
            <span className="font-medium">{users.length}</span> utilisateurs
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Précédent
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Toast de confirmation */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => {
              setShowToast(false);
              setToastMessage("");
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 border border-gray-200 relative"
            >
              {deleteLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl">
                  <Spinner size="md" />
                </div>
              )}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-red-600">
                  Confirmer la suppression
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  disabled={deleteLoading}
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
                        {selectedUser?.firstName} {selectedUser?.lastName}
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
                  disabled={deleteLoading}
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg ${
                    deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={deleteLoading}
                >
                  Supprimer définitivement
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;
