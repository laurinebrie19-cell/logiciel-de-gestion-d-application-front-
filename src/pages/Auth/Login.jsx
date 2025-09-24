import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "react-feather";
import AuthService from "../../services/auth.service.js";
import { showToast } from "../../components/common/Toasts";
import { useAuth } from "../../contexts/AutContext.jsx";
import loginIllustration from "../../assets/images/login-illustration.jpg";
import { Link } from "react-router-dom";
import ChangePasswordModal from "./Modal/ChangePasswordModal"; // à créer

const LoginPage = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userToChange, setUserToChange] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  const validateField = (name, value) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: `Veuillez remplir ce champ`,
      }));
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Email invalide",
      }));
    } else if (name === "password" && value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Le mot de passe doit contenir au moins 6 caractères",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation forcée
    validateField("email", email);
    validateField("password", password);

    // Si des erreur, on annule la soumission
    if (!email || !password || errors.email || errors.password) return;

    setIsLoading(true);
    try {
      const userData = await AuthService.login({ email, password });
      if (userData.mustChangePassword) {
        setUserToChange({ ...userData, oldPassword: password });
        setShowChangePassword(true);
        setIsLoading(false);
        return;
      }
      const loginSuccess = await login(userData);

      if (loginSuccess) {
        showToast("success", "Connexion réussie !");
        navigate("/dashboard");
      } else {
        throw new Error("Une erreur est survenue lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      showToast("error", "Mot de passe ou mail incorrect", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 justify-center items-center bg-white p-8">
        <img
          src={loginIllustration}
          alt="Security"
          className="max-w-lg max-h-screen object-contain"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 justify-center items-center bg-gradient-to-br from-indigo-400 via-white to-blue-100 p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden bg-indigo-300"
        >
          {/* Header with logo */}
          <div className="text-center p-8 bg-indigo-700">
            <h2 className="text-2xl font-bold text-indigo-100 mb-2">
              Connexion à votre compte
            </h2>
            <p className="text-indigo-100">Accédez à votre espace mutuelle</p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white"
          >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-1 mb-6">
                <label className="block text-gray-700 font-medium mb-1">
                  Adresse email
                </label>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      validateField("email", e.target.value);
                    }}
                    onBlur={() => validateField("email", email)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                    placeholder="email"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 left-0 flex items-center text-red-500 text-sm"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium mb-1">
                  Mot de passe
                </label>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        validateField("password", e.target.value);
                      }}
                      onBlur={() => validateField("password", password)}
                      className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
                  {/* Réserve toujours la place pour l'erreur */}
                  <div className="min-h-[24px] mt-2 flex items-center">
                    <AnimatePresence>
                      {errors.password && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="flex items-center text-red-500 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.password}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full"
                      />
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </motion.button>
              </div>

              <div className="mt-2 text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-500 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      {showChangePassword && (
        <ChangePasswordModal
          user={userToChange}
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            showToast(
              "success",
              "Mot de passe changé, veuillez vous reconnecter."
            );
            navigate("/login");
          }}
        />
      )}
    </div>
  );
};

export default LoginPage;
