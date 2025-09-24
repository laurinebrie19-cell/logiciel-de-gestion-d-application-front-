import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X } from "lucide-react";

const ConfirmSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isEditing,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Fond transparent pour mettre la modal en évidence */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4 border border-gray-200"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmer les modifications
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Save className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">
                  {isEditing
                    ? "Êtes-vous sûr de vouloir enregistrer ces modifications ?"
                    : "Êtes-vous sûr de vouloir créer cet utilisateur ?"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Annuler
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Confirmer"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ConfirmSaveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isEditing: PropTypes.bool.isRequired,
};

ConfirmSaveModal.defaultProps = {
  loading: false,
};

export default ConfirmSaveModal;
