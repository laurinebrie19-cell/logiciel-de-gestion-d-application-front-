import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { showToast } from "../../../components/common/Toasts";
import { resetPassword } from "../../../services/resetPassword.service";

export default function ChangePasswordModal({ user, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      showToast(
        "warning",
        "C'est votre première connexion, vous devez changer votre mot de passe."
      );
      toastShown.current = true;
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword({
        email: user.email,
        oldPassword: user.oldPassword,
        newPassword,
      });
      if (response) {
        showToast("success", "Mot de passe changé avec succès !");
        onSuccess();
      } else {
        setError("Erreur lors du changement de mot de passe");
      }
    } catch (err) {
      setError("Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">
          Changement de mot de passe obligatoire
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded z placeholder:text-gray-400"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Changement..." : "Changer le mot de passe"}
          </button>
          <button
            type="button"
            className="w-full mt-2 text-gray-500 hover:underline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
        </form>
      </motion.div>
    </div>
  );
}

ChangePasswordModal.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    oldPassword: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
