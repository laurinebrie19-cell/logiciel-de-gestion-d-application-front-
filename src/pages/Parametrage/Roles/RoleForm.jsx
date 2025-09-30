import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    List,
    FileText,
    Check,
    AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../../components/common/Toasts";
import ConfirmSaveModal from "../../TestUser/SaveModal.jsx";
import { getAllPermissions } from "../../../services/permission.service";
import { createRole, updateRole, getRoleById } from "../../../services/role.service";
import PermissionWrapper from "../../../components/PermissionWrapper";
import { toast } from "react-toastify";

const RoleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        roleName: "",
        roleDescription: "",
        permissionIds: [],
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    const [errors, setErrors] = useState({});
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [toastState, setToastState] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Charger les permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);
                const response = await getAllPermissions();
                if (!response || !Array.isArray(response) || response.length === 0) {
                    throw new Error("Aucune permission disponible");
                }
                setPermissions(response);
                console.log("Permissions chargées:", response); // Pour le débogage
            } catch (error) {
                console.error("Erreur de chargement des permissions:", error);
                toast.error(error.message || "Erreur de chargement des permissions");
                setPermissions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, []);

    // Charger le rôle en mode édition
    useEffect(() => {
        const fetchRole = async () => {
            if (isEditing) {
                try {
                    const roleData = await getRoleById(id);
                    if (!roleData) {
                        throw new Error("Rôle non trouvé");
                    }

                    // Extraire les IDs des permissions
                    const permissionIds = roleData.permissions?.map(p => p.id) || [];

                    setFormData({
                        roleName: roleData.roleName,
                        roleDescription: roleData.roleDescription,
                        permissionIds: permissionIds,
                    });
                } catch (error) {
                    console.error("Erreur de chargement du rôle:", error);
                    setToastState({
                        show: true,
                        message: error.message || "Erreur de chargement des données du rôle",
                        type: "error",
                    });
                    setTimeout(() => navigate("/admin/roles"), 3000);
                } finally {
                    setInitialLoading(false);
                }
            }
        };

        if (isEditing) {
            fetchRole();
        }
    }, [isEditing, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePermissionChange = (permissionId) => {
        setFormData((prev) => {
            const newPermissionIds = prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter((id) => id !== permissionId)
                : [...prev.permissionIds, permissionId];

            return { ...prev, permissionIds: newPermissionIds };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.roleName.trim()) newErrors.roleName = "Le nom du rôle est requis";
        if (formData.permissionIds.length === 0) {
            newErrors.permissionIds = "Au moins une permission doit être sélectionnée";
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

            const roleData = {
                roleName: formData.roleName,
                roleDescription: formData.roleDescription,
                permissionIds: formData.permissionIds,
            };

            if (isEditing) {
                await updateRole(id, roleData);
                toast.success("Rôle modifié avec succès");
            } else {
                await createRole(roleData);
                toast.success("Rôle créé avec succès");
            }

            navigate("/admin/roles");
        } catch (error) {
            console.error("Erreur de sauvegarde:", error);
            toast.error(
                error.message || "Erreur lors de la sauvegarde du rôle"
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
        <PermissionWrapper permission="USER_MANAGE_ROLES">
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
                                    onClick={() => navigate("/admin/roles")}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                                </motion.button>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {isEditing ? "Modifier le rôle" : "Nouveau rôle"}
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
                        <div className="grid grid-cols-1 gap-6">
                            {/* Nom du rôle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du rôle
                                </label>
                                <div className="relative">
                                    <List className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="roleName"
                                        value={formData.roleName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                            errors.roleName ? "border-red-500" : "border-gray-200"
                                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="Administrateur"
                                    />
                                </div>
                                {errors.roleName && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.roleName}
                                    </p>
                                )}
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permissions
                                </label>
                                {errors.permissionIds && (
                                    <p className="mb-2 text-sm text-red-500">
                                        {errors.permissionIds}
                                    </p>
                                )}

                                {permissions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id={`permission-${permission.id}`}
                                                        name="permissions"
                                                        type="checkbox"
                                                        checked={formData.permissionIds.includes(permission.id)}
                                                        onChange={() => handlePermissionChange(permission.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="font-medium text-gray-700"
                                                    >
                                                        {permission.permissionName}
                                                    </label>
                                                    <p className="text-gray-500 text-xs">
                                                        {permission.permissionDescription}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2" />
                                        Aucune permission disponible
                                    </div>
                                )}
                            </div>
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
                    entityName="rôle"
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

export default RoleForm;