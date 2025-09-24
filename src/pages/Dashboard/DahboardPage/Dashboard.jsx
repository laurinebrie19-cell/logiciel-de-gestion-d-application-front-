import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Check,
  ChevronRight,
  CreditCard,
  PieChart,
  Shield,
  User,
  FileText,
  Settings,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../../../contexts/AutContext";
import { getAllSessions } from "../../../services/session.service";
import EmpruntService from "../../../services/emprunt.service";
import { getTotalCotisationByMembreIdAndSessionId } from "../../../services/cotisation.service";

const WelcomeDashboard = () => {
  const { user, sessionEnCours, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cotisationTotale: 0,
    empruntTotal: 0,
  });
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer les statistiques de l'utilisateur connecté
        if (user?.id && sessionEnCours?.id) {
          // Récupération du solde cotisé
          const cotisationTotale =
            await getTotalCotisationByMembreIdAndSessionId(
              user.id,
              sessionEnCours.id
            );

          // Récupération des emprunts
          let empruntTotal = 0;
          try {
            // Utilise l'API pour récupérer le montant total des emprunts de l'utilisateur
            const empruntsUser = await EmpruntService.getEmpruntsByMembre(
              user.id
            );
            if (empruntsUser && Array.isArray(empruntsUser)) {
              // Filtre pour la session en cours
              const empruntsSession = empruntsUser.filter(
                (e) => e.sessionId === sessionEnCours.id
              );
              empruntTotal = empruntsSession.reduce(
                (sum, loan) => sum + (loan.montantEmprunt || 0),
                0
              );
            }
          } catch (error) {
            console.error("Erreur lors du chargement des emprunts", error);
          }

          setStats({
            cotisationTotale: cotisationTotale || 0,
            empruntTotal: empruntTotal || 0,
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, sessionEnCours]);

  // Greeting message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // Quick action cards for different roles
  const getQuickActions = () => {
    const actions = [];

    // Common actions for all users - account management
    actions.push({
      title: "Mon profil",
      icon: <User className="w-6 h-6 text-indigo-600" />,
      description: "Consultez ou modifiez vos informations personnelles",
      path: "/users/" + (user?.id || ""),
      color: "bg-indigo-50",
    });

    // Role-specific actions
    if (hasPermission("USER_READ")) {
      actions.push({
        title: "Gestion des utilisateurs",
        icon: <Users className="w-6 h-6 text-purple-600" />,
        description: "Ajouter, modifier ou supprimer des utilisateurs",
        path: "/users",
        color: "bg-purple-50",
      });
    }

    if (hasPermission("CONTRIBUTION_CREATE")) {
      actions.push({
        title: "Gérer les cotisations",
        icon: <DollarSign className="w-6 h-6 text-green-600" />,
        description: "Enregistrer des cotisations et suivre les paiements",
        path: "/contributions",
        color: "bg-green-50",
      });
    }

    // Common actions for all users
    actions.push({
      title: "Cotisations",
      icon: <CreditCard className="w-6 h-6 text-cyan-600" />,
      description: "Consultez l'historique de vos cotisations",
      path: "/contributions",
      color: "bg-cyan-50",
    });

    actions.push({
      title: "Emprunts",
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      description: "Demander ou consulter l'état des emprunts",
      path: "/loans/dashboard",
      color: "bg-amber-50",
    });

    // Admin actions
    if (hasPermission("LOAN_MANAGE")) {
      actions.push({
        title: "Trésorerie - Emprunts",
        icon: <Shield className="w-6 h-6 text-emerald-600" />,
        description: "Gérer les demandes d'emprunts",
        path: "/treasure/dashboard/loans",
        color: "bg-emerald-50",
      });
    }

    if (hasPermission("REPAYMENT_MANAGE")) {
      actions.push({
        title: "Trésorerie - Remboursements",
        icon: <Shield className="w-6 h-6 text-blue-600" />,
        description: "Gérer les remboursements des membres",
        path: "/treasure/dashboard/repayment",
        color: "bg-blue-50",
      });
    }

    if (hasPermission("STATISTICS_VIEW")) {
      actions.push({
        title: "Statistiques",
        icon: <BarChart2 className="w-6 h-6 text-violet-600" />,
        description: "Consultez les statistiques de la mutuelle",
        path: "/statistics",
        color: "bg-violet-50",
      });
    }

    if (hasPermission("SESSION_MANAGE_BALANCE")) {
      actions.push({
        title: "Paramètres",
        icon: <Settings className="w-6 h-6 text-gray-600" />,
        description: "Configurer les paramètres du système",
        path: "/admin/settings",
        color: "bg-gray-50",
      });
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome banner */}
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl mb-8 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-xl"></div>

        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.firstName || "Membre MUASMO"} !
        </h1>
        <p className="text-lg opacity-90 mb-4">
          Bienvenue sur le portail de gestion D'AL Infotech Academy.
        </p>

        <div className="flex items-center mt-6 text-white/80 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

     
     

      
    </motion.div>
  );
};

export default WelcomeDashboard;
