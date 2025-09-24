import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, List, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllRoles, deleteRole } from "../../../services/role.service";
import PermissionWrapper from "../../../components/PermissionWrapper";
import Toast from "../../../components/common/Toasts";
import Spinner from "../../../components/common/Spinner";

const RoleList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("error");
    const [roles, setRoles] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setStatus("loading");
                const response = await getAllRoles();

                if (!response) {
                    throw new Error("Le serveur n'a pas retourné de données");
                }

                setRoles(response);
                setStatus("success");
            } catch (error) {
                console.error("Erreur API:", error);
                let errorMessage = "Erreur lors de la récupération des rôles";

                if (error.message.includes("Failed to fetch")) {
                    errorMessage =
                        "Service indisponible - Impossible de se connecter au serveur";
                }

                setError(errorMessage);
                setStatus("error");
                setToastMessage(errorMessage);
                setToastType("error");
                setShowToast(true);
                setRoles([]);

                setTimeout(() => {
                    setShowToast(false);
                    setToastMessage("");
                }, 5000);
            }
        };

        fetchRoles();
    }, []);

    const handleDelete = async () => {
        if (!selectedRole) return;

        setDeleteLoading(true);
        try {
            await deleteRole(selectedRole.id);
            setRoles((prev) => prev.filter((role) => role.id !== selectedRole.id));
            setShowDeleteModal(false);
            setToastMessage("Rôle supprimé avec succès");
            setToastType("success");
        } catch (error) {
            console.error("Erreur suppression:", error);
            setToastMessage("Erreur lors de la suppression du rôle");
            setToastType("error");
        } finally {
            setDeleteLoading(false);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setToastMessage("");
            }, 5000);
        }
    };

    const filteredRoles = (roles || []).filter((role) => {
        return role.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" />
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

    if (roles.length === 0 && status === "success") {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <List className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun rôle trouvé
                </h3>

                <PermissionWrapper permission="USER_MANAGE_ROLES">
                    <p className="text-gray-600 text-center mb-4">
                        Commencez par ajouter un nouveau rôle.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/roles/create")}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nouveau rôle
                    </motion.button>
                </PermissionWrapper>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm relative">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Rôles</h2>
                    <PermissionWrapper permission="USER_MANAGE_ROLES">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/admin/roles/create")}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nouveau rôle
                        </motion.button>
                    </PermissionWrapper>
                </div>

                {/* Recherche */}
                <div className="mt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher un rôle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <motion.div
                className="overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                        {filteredRoles.map((role) => (
                            <motion.tr
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {role.roleName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <PermissionWrapper permission="USER_MANAGE_ROLES">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 hover:bg-violet-50 rounded-full"
                                                onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                                            >
                                                <Edit2 className="w-4 h-4 text-violet-600" />
                                            </motion.button>
                                        </PermissionWrapper>
                                        <PermissionWrapper permission="USER_MANAGE_ROLES">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 hover:bg-red-50 rounded-full"
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Affichage de 1 à {filteredRoles.length} sur {roles.length} rôles
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Précédent
                        </button>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
                                            Êtes-vous sûr de vouloir supprimer le rôle{" "}
                                            <span className="font-semibold">{selectedRole?.name}</span>{" "}
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

export default RoleList;