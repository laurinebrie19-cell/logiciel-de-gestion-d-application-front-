import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { showToast } from "../components/common/Toasts";
import { getAllSessions } from "../services/session.service.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionEnCours, setSessionEnCours] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Ajout d'un état pour suivre le chargement initial

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Si mustChangePassword est true, on ne garde pas l'utilisateur
        if (!parsedUser.mustChangePassword) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      const storedSession = localStorage.getItem("sessionEnCours");
      if (storedSession) {
        setSessionEnCours(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("sessionEnCours");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // fonction utilitaire pour gérer les sessions
  const syncSessionEnCours = (session) => {
    if (session) {
      localStorage.setItem("sessionEnCours", JSON.stringify(session));
      setSessionEnCours(session);
    } else {
      localStorage.removeItem("sessionEnCours");
      setSessionEnCours(null);
    }
  };

  // gérer la connexion
  const login = async (userData) => {
    try {
      if (userData && !userData.mustChangePassword) {
        // D'abord stocker dans le localStorage
        await localStorage.setItem("user", JSON.stringify(userData));

        // Vérifier que le stockage a réussi
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("Échec de l'enregistrement des données utilisateur");
        }

        // Ensuite mettre à jour l'état
        setUser(userData);
        // Appel API pour récupérer les sessions et trouver la session en cours
        try {
          const sessions = await getAllSessions();
          const sessionEnCours = sessions.find(
            (session) => session.status === "EN_COURS"
          );
          if (sessionEnCours) {
            localStorage.setItem(
              "sessionEnCours",
              JSON.stringify(sessionEnCours)
            );
            setSessionEnCours(sessionEnCours);
          } else {
            localStorage.removeItem("sessionEnCours");
            setSessionEnCours(null);
          }
        } catch (err) {
          // Si l'appel échoue, on nettoie la session en cours
          localStorage.removeItem("sessionEnCours");
          setSessionEnCours(null);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
      showToast("error", "Erreur lors de la connexion");
      return false;
    }
  };

  const definirSession = async (sessionData) => {
    try {
      syncSessionEnCours(sessionData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session:", error);
      showToast("error", "Erreur lors de la définition de la session");
    }
  };

  // gérer la déconnexion
  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("sessionEnCours");
      setUser(null);
      setSessionEnCours(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      showToast("error", "Erreur lors de la déconnexion");
    }
  };

  const hasPermission = (permission) => {
    return user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionEnCours,
        isLoading,
        login,
        logout,
        hasPermission,
        definirSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    showToast("error", "useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
