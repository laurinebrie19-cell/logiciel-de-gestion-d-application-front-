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

      {/* Current session */}
      {sessionEnCours && (
        <motion.div
          className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Session en cours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Session</p>
              <p className="text-lg font-bold text-gray-800">
                {sessionEnCours.titreSession || "N/A"}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  {new Date(sessionEnCours.startDate).toLocaleDateString()} -{" "}
                  {new Date(sessionEnCours.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Votre solde</p>
              <p className="text-lg font-bold text-gray-800">
                {Number(stats.cotisationTotale).toLocaleString()} FCFA
              </p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <Check className="w-3 h-3 mr-1" />
                <span>
                  Cotisation: {sessionEnCours.montant?.toLocaleString() || 0}{" "}
                  FCFA
                </span>
              </div>
            </div>

            {hasPermission("READ_SOLDE_SESSION") && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Solde total session</p>
                <p className="text-lg font-bold text-gray-800">
                  {sessionEnCours.soldeCourant?.toLocaleString() || 0} FCFA
                </p>
                <div className="mt-2 flex items-center text-xs text-amber-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Taux d'intérêt: {sessionEnCours.interet || 5}%</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/detailsession/${sessionEnCours.id}`)}
            className="mt-4 text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
          >
            Voir les détails <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getQuickActions().map((action, index) => (
            <motion.div
              key={index}
              className={`${action.color} p-6 rounded-xl cursor-pointer transition-all hover:shadow-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-full bg-white/80">
                  {action.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Résumé personnel
            </h2>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total cotisé</span>
              <span className="font-semibold text-gray-900">
                {Number(stats.cotisationTotale).toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total emprunté</span>
              <span className="font-semibold text-gray-900">
                {Number(stats.empruntTotal).toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Solde actuel</span>
              <span className="font-semibold text-emerald-600">
                {Number(
                  stats.cotisationTotale - stats.empruntTotal
                ).toLocaleString()}{" "}
                FCFA
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate("/contributions")}
              className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
            >
              Voir mes cotisations <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => navigate("/loans/history")}
              className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
            >
              Voir mes emprunts <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Actions disponibles
            </h2>
          </div>
          <div className="space-y-3">
            <div
              onClick={() => navigate("/loans/request")}
              className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-orange-800">
                  Faire une demande d'emprunt
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Soumettez votre demande de prêt
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </div>

            <div
              onClick={() => navigate("/payments")}
              className="p-4 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-cyan-800">
                  Historique des remboursements
                </p>
                <p className="text-xs text-cyan-600 mt-1">
                  Consultez vos remboursements
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </div>

            {hasPermission("STATISTICS_VIEW") && (
              <div
                onClick={() => navigate("/statistics")}
                className="p-4 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors cursor-pointer flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-violet-800">
                    Statistiques globales
                  </p>
                  <p className="text-xs text-violet-600 mt-1">
                    Visualisez les données de la mutuelle
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-400" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeDashboard;
