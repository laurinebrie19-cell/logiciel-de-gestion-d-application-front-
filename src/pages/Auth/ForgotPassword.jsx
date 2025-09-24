import { useState } from "react";
import { forgotPassword } from "../../services/resetPassword.service";
import { showToast } from "../../components/common/Toasts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import forgotIllustration from "../../assets/images/7070628_3275432.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      showToast(
        "success",
        "Un code de vérification a été envoyé à votre email."
      );
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch {
      showToast("error", "Erreur lors de l'envoi du mail.");
    } finally {
      setLoading(false);
    }
  };

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
          alt="Mot de passe oublié"
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
            Réinitialiser le mot de passe
          </h2>
          <label className="block mb-2 text-gray-700">Adresse email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded mb-4 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Message d'information important */}
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <span className="text-yellow-800 text-sm font-medium">
              Un email contenant un code de vérification va être envoyé à votre
              adresse.{" "}
              <b>Vérifiez bien votre boîte de réception et vos spams.</b>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Envoyer le code"}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
