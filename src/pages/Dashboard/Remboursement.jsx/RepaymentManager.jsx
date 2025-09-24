import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Spinner from "../../../components/common/Spinner";
import Toast from "../../../components/common/Toasts";
import RepaymentModal from "./Modal/RepaymentModal";
import Pagination from "../../Remboursement/components/Pagination";
import RepaymentDetailsModal from "./Modal/RepaymentDetailsModal";
import {
  getHistoriqueRemboursements,
  getMembresEndettes,
  getAllRemboursements,
  getMontantTotalRemboursementsBySession,
} from "../../../services/rembousement.service";
import { useEffect } from "react";
import { effectuerRemboursement } from "../../../services/rembousement.service";

import { getRemboursementsEnAttente } from "../../../services/rembousement.service";
import { getRemboursementsEnCours } from "../../../services/rembousement.service";
import { getRemboursementsAttentes } from "../../../services/rembousement.service";
import { getRemboursementsValides } from "../../../services/rembousement.service";
import { getRemboursementsTermines } from "../../../services/rembousement.service";
import { validerRemboursementsEnAttente } from "../../../services/rembousement.service";

import { useAuth } from "../../../contexts/AutContext";

const RepaymentManager = () => {
  const { user, sessionEnCours } = useAuth(); // Récupère user et sessionEnCours
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedLoanDetails, setSelectedLoanDetails] = useState(null); // Initialisation de selectedLoanDetails
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [idtresorier, setIdtresorier] = useState(null);
  const [idSession, setIdSession] = useState(null);
  const [validating, setValidating] = useState(false);

  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [stats, setStats] = useState({
    totalRemboursé: 0,
    empruntsEnCours: 0,
    remboursésTotal: 0,
    demandesEnAttente: 0,
  });

  const [pendingLoans, setPendingLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.id) {
      setIdtresorier(user.id);
      localStorage.setItem("idtresorier", user.id);
    } else {
      const idtresorierFromStorage = localStorage.getItem("idtresorier");
      if (idtresorierFromStorage)
        setIdtresorier(parseInt(idtresorierFromStorage));
    }

    if (sessionEnCours?.id) {
      setIdSession(sessionEnCours.id);
      localStorage.setItem("idSession", sessionEnCours.id);
    } else {
      const idSessionFromStorage = localStorage.getItem("idSession");
      if (idSessionFromStorage) setIdSession(parseInt(idSessionFromStorage));
    }
  }, [user, sessionEnCours]);

  const refreshLoanData = async () => {
    try {
      const currentSessionId = sessionEnCours?.id || idSession;

      const [updatedLoans, updatedPending, totalRemboursement] =
        await Promise.all([
          getMembresEndettes(),
          getRemboursementsEnAttente(),
          getMontantTotalRemboursementsBySession(currentSessionId),
        ]);

      setLoans(updatedLoans || []);
      setPendingLoans(updatedPending || []);

      // Mise à jour des statistiques
      const empruntsEnCours = updatedLoans.filter(
        (loan) => loan.remainingAmount > 0
      ).length;
      const remboursésTotal = updatedLoans.filter(
        (loan) => loan.remainingAmount === 0 || loan.isFullyRepaid === true
      ).length;

      setStats({
        totalRemboursé: Number(totalRemboursement) || 0,
        empruntsEnCours,
        remboursésTotal,
        demandesEnAttente: updatedPending?.length || 0,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error);
      setToast({
        type: "error",
        message: "Échec de la mise à jour des statistiques.",
      });
    }
  };

  // Récupérer les prêts au chargement du composant
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        // Récupérer la session courante
        const currentSessionId = sessionEnCours?.id || idSession;

        // Récupération des données pour les statistiques
        const [membresEndettes, remboursementsEnAttente, totalRemboursement] =
          await Promise.all([
            getMembresEndettes(),
            getRemboursementsEnAttente(),
            getMontantTotalRemboursementsBySession(currentSessionId),
          ]);

        setLoans(membresEndettes || []);
        setPendingLoans(remboursementsEnAttente || []);

        // Calcul des statistiques
        const empruntsEnCours = membresEndettes.filter(
          (loan) => loan.remainingAmount > 0
        ).length;
        const remboursésTotal = membresEndettes.filter(
          (loan) => loan.remainingAmount === 0 || loan.isFullyRepaid === true
        ).length;

        setStats({
          totalRemboursé: Number(totalRemboursement) || 0,
          empruntsEnCours,
          remboursésTotal,
          demandesEnAttente: remboursementsEnAttente?.length || 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setToast({
          type: "error",
          message: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [sessionEnCours, idSession]);

  const filteredLoans = (loans || []).filter((loan) => {
    const matchesSearch =
      loan.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      loan.montant?.toString().includes(searchTerm) ||
      false;
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && loan.remainingAmount > 0) ||
      (filterStatus === "completed" && loan.remainingAmount === 0);
    return matchesSearch && matchesFilter;
  });

  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchRemboursementsEnAttente = async () => {
      setLoading(true);
      try {
        const data = await getRemboursementsEnAttente();
        console.log("Remboursements en attente:", data);
        setPendingLoans(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des remboursements en attente:",
          error
        );
        setToast({
          type: "error",
          message: "Impossible de charger les remboursements en attente.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRemboursementsEnAttente();
  }, []);

  // Gestion du remboursement
  const handleRepayment = async (idemprunt, iduser, amount) => {
    setLoading(true);
    try {
      const remboursementData = {
        iduser,
        idSession,
        idtresorier,
        idemprunt,
        montant: amount,
      };
      await effectuerRemboursement(remboursementData);

      setToast({
        type: "success",
        message: "Remboursement enregistré avec succès",
      });

      await refreshLoanData();
      // Met à jour la liste après remboursement
      const updatedLoans = await getMembresEndettes();
      setLoans(updatedLoans);

      setSelectedLoan(null);
    } catch (error) {
      console.error("Erreur lors du remboursement:", error);
      setToast({
        type: "error",
        message: "Une erreur est survenue lors du remboursement",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidateLoan = async () => {
    try {
      if (!idtresorier) {
        setToast({
          type: "error",
          message: "Identifiant du trésorier manquant.",
        });
        return;
      }
      setValidating(true); // démarrer le spinner

      await validerRemboursementsEnAttente(idtresorier);
      setToast({
        type: "success",
        message: "Les remboursements en attente ont été validés avec succès.",
      });

      await refreshLoanData();

      // Mettre à jour les deux listes après validation
      const [updatedLoans, updatedPending] = await Promise.all([
        getMembresEndettes(),
        getRemboursementsEnAttente(),
      ]);

      setLoans(updatedLoans);
      setPendingLoans(updatedPending);
    } catch (err) {
      console.error("Erreur :", err);
      setToast({
        type: "error",
        message: "Seule la trésorière peut valider ce remboursement.",
      });
    } finally {
      setValidating(false); // arrêter le spinner
    }
  };

  const handleRejectLoan = async () => {
    try {
      await rejeterRemboursement({
        id: rejectionModal.id,
        motif: rejectionReason,
      });
      setToast({ type: "success", message: "Demande rejetée avec succès." });
      await refreshLoanData();

      setRejectionModal(null);
      setRejectionReason("");

      // Mettre à jour les données
      const [updatedLoans, updatedPending] = await Promise.all([
        getMembresEndettes(),
        getRemboursementsEnAttente(),
      ]);

      setLoans(updatedLoans);
      setPendingLoans(updatedPending);
    } catch (err) {
      setToast({ type: "error", message: "Erreur lors du rejet." });
    }
  };

  const getRemboursementStatusStyle = (status) => {
    const styles = {
      TERMINE: "bg-blue-100 text-blue-800",
      EN_COURS: "bg-green-100 text-green-800",
      EN_ATTENTE: "bg-orange-100 text-orange-800",
      EN_VALIDE: "bg-green-100 text-green-800",
      REJETE: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getRemboursementStatusLabel = (status) => {
    const labels = {
      TERMINE: "Terminé",
      EN_COURS: "En cours",
      EN_ATTENTE: "En attente",
      EN_VALIDE: "Validé",
      REJETE: "Rejeté",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Card 1 : Total remboursé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white shadow-lg relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute -top-8 -right-8 opacity-15 pointer-events-none"
          >
            <DollarSign className="w-28 h-28 text-white/30" />
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg shadow">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total remboursé</p>
              <h3 className="text-2xl font-bold">
                {typeof stats.totalRemboursé === "number"
                  ? stats.totalRemboursé.toLocaleString("fr-FR")
                  : Number(stats.totalRemboursé || 0).toLocaleString(
                      "fr-FR"
                    )}{" "}
                FCFA
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card 2 : Emprunts en cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          transition={{
            delay: 0.08,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
            className="absolute -top-8 -right-8 opacity-15 pointer-events-none"
          >
            <TrendingUp className="w-28 h-28 text-white/30" />
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg shadow">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Emprunts en cours</p>
              <h3 className="text-2xl font-bold">
                {loans.filter((l) => l.remainingAmount > 0).length}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card 3 : Remboursés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          transition={{
            delay: 0.16,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            className="absolute -top-8 -right-8 opacity-15 pointer-events-none"
          >
            <Users className="w-28 h-28 text-white/30" />
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg shadow">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Remboursés</p>
              <h3 className="text-2xl font-bold">
                {loans.filter((l) => l.remainingAmount === 0).length}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card 4 : Demandes en attente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          transition={{
            delay: 0.24,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute -top-8 -right-8 opacity-15 pointer-events-none"
          >
            <Clock className="w-28 h-28 text-white/30" />
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg shadow">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Demandes en attente</p>
              <h3 className="text-2xl font-bold">{pendingLoans.length}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Demandes en attente */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500" />
          Demandes en attente
          <span className="ml-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
            {pendingLoans.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingLoans.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white via-orange-50 to-orange-100 shadow group hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700 text-lg shadow">
                    {loan.username?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {loan.username}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Demande le{" "}
                      {loan.dateRemboursement
                        ? new Date(loan.dateRemboursement).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mt-2">
                      En attente
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold text-orange-700">
                    {Number(loan.montant).toLocaleString("fr-FR")} FCFA
                  </span>
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleValidateLoan(loan.idtresorier, "approve")
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow"
                      disabled={validating}
                    >
                      {validating ? (
                        <Spinner size="sm" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Approuver</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRejectionModal(loan)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 shadow"
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {pendingLoans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 col-span-2">
              <Clock className="w-12 h-12 text-orange-200 mb-2" />
              <p className="text-gray-500 text-lg">Aucune demande en attente</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Gestion des remboursements
          </h2>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un membre..."
                className="pl-10 pr-4 py-2 border border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500  text-sm transition rounded-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tous les emprunts</option>
              <option value="active">En cours</option>
              <option value="completed">Remboursés</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[700px]">
            <thead className="sticky top-0 bg-indigo-50 z-10">
              <tr className="text-left border-b border-gray-200">
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Membre
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Montant emprunté
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Reste à payer
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Date d'emprunt
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  montant payer
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  montant net
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  statut
                </th>

                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.map((loan) => (
                <motion.tr
                  key={loan.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-base shadow">
                      {loan.username?.[0] || "?"}
                    </div>
                    {loan.username}
                  </td>

                  <td className="py-4 px-4 font-medium">
                    {Number(loan.montantEmprunt).toLocaleString("fr-FR")} FCFA
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`font-bold ${
                        loan.remainingAmount > 0
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {Number(loan.remainingAmount).toLocaleString("fr-FR")}{" "}
                      FCFA
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {new Date(loan.dateEmprunt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-700">
                    {Number(
                      loan.montantnet - loan.remainingAmount
                    ).toLocaleString("fr-FR")}{" "}
                    FCFA
                  </td>

                  <td className="py-4 px-4 font-medium">
                    {Number(loan.montantnet).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRemboursementStatusStyle(
                        loan.statut
                      )}`}
                    >
                      {getRemboursementStatusLabel(loan.statut)}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {loan.remainingAmount > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedLoan(loan)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-1"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Rembourser</span>
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLoanDetails(loan)} // Modifie ici
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLoans.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {rejectionModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center"
          aria-labelledby="rejection-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative z-50"
          >
            <div className="p-6">
              <h3
                className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
                id="rejection-modal-title"
              >
                <XCircle className="w-5 h-5 text-red-600" />
                Motif du rejet
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full h-32 resize-none p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                placeholder="Saisissez le motif du rejet..."
                maxLength={200}
              />
              <div className="mt-2 text-right text-sm text-gray-500">
                {rejectionReason.length}/200 caractères
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
              <button
                type="button"
                onClick={handleRejectLoan}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={!rejectionReason.trim()}
              >
                Confirmer le rejet
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectionModal(null);
                  setRejectionReason("");
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedLoan && (
        <RepaymentModal
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          refreshLoans={async () => {
            const updatedLoans = await getMembresEndettes();
            setLoans(updatedLoans);
          }}
        />
      )}
      {selectedLoanDetails && (
        <RepaymentDetailsModal
          loan={selectedLoanDetails}
          onClose={() => setSelectedLoanDetails(null)}
          sessionId={sessionEnCours?.id || idSession}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default RepaymentManager;
