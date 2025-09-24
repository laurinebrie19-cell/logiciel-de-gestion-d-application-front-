import { useState } from "react";
import { confirmResetPassword } from "../../services/resetPassword.service";
import { showToast } from "../../components/common/Toasts";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import forgotIllustration from "../../assets/images/7070628_3275432.svg";
import { Eye, EyeOff, AlertCircle } from "react-feather";

export default function ResetPassword() {
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.verificationCode.trim()) {
      setError("Le code de vérification est requis.");
      return false;
    }
    if (form.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await confirmResetPassword(form);
      showToast("success", "Mot de passe réinitialisé !");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      // Vérifie si l'erreur vient du code de vérification
      if (
        err?.response?.status === 400 ||
        (err?.response?.data &&
          typeof err.response.data === "string" &&
          err.response.data.toLowerCase().includes("code"))
      ) {
        showToast("error", "Code de vérification incorrect.");
      } else {
        showToast("error", "Erreur lors de la réinitialisation.");
      }
    } finally {
      setLoading(false);
    }
  };

  // fonction pour savoir si l'erreur concerne le champ
  const isPasswordError = error && error.toLowerCase().includes("mot de passe");
  const isConfirmError = error && error.toLowerCase().includes("correspond");

  return (
    <div className="min-h-screen flex">
      {/* Illustration à gauche */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 justify-center items-center bg-white p-8"
      >
        <img
          src={forgotIllustration}
          alt="Réinitialisation"
          className="max-w-lg max-h-screen object-contain"
        />
      </motion.div>

      {/* Formulaire à droite */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 justify-center items-center bg-gradient-to-br from-indigo-400 via-white to-blue-100 p-4 lg:p-8"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4 text-indigo-700">
            Nouveau mot de passe
          </h2>
          <label className="block mb-2 text-gray-700">Adresse email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded mb-4 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Votre email"
            value={form.email}
            onChange={handleChange}
          />
          <label className="block mb-2 text-gray-700">
            Code de vérification
          </label>
          <input
            type="text"
            name="verificationCode"
            className="w-full px-4 py-2 border rounded mb-4 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Code reçu par mail"
            border-gray-400
            focus:outline-none
            focus:ring-1
            focus:ring-indigo-500
            text-sm
            transition
            value={form.verificationCode}
            onChange={handleChange}
          />
          {/* Champ mot de passe */}
          <label className="block mb-2 text-gray-700">
            Nouveau mot de passe
          </label>
          <div className="relative mb-1">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              className={`w-full px-4 py-2 border rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isPasswordError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nouveau mot de passe"
              value={form.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              aria-label={
                showPassword
                  ? "Cacher le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="min-h-[24px] mb-2 flex items-center">
            {isPasswordError && (
              <span className="flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </span>
            )}
          </div>

          {/* Champ confirmation */}
          <label className="block mb-2 text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="relative mb-1">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              className={`w-full px-4 py-2 border rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isConfirmError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              aria-label={
                showConfirm
                  ? "Cacher le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="min-h-[24px] mb-2 flex items-center">
            {isConfirmError && (
              <span className="flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </span>
            )}
          </div>
          <div className="min-h-[24px] mb-2 flex items-center">
            {error && !isPasswordError && !isConfirmError && (
              <span className="flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
