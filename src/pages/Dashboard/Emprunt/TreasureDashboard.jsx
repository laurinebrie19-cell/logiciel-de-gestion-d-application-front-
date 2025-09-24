import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  Download,
  X,
} from "lucide-react";
import EmpruntService from "../../../services/emprunt.service";
import { getAllSessions } from "../../../services/session.service";
import Spinner from "../../../components/common/Spinner";
import Toast, { showToast } from "../../../components/common/Toasts";
import { useAuth } from "../../../contexts/AutContext";
import ExportEmpruntModal from "../../Emprunt/components/Modal/ExportEmpruntModal";
import {
  exportEmpruntsPdfBySession,
  exportEmpruntsPdfByPeriode,
  exportEmpruntsPdfByInterval,
} from "../../../services/empruntExport.service";

const TreasurerDashboard = () => {
  const { sessionEnCours } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [rejectionModal, setRejectionModal] = useState(null);
  const [approvalModal, setApprovalModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    pendingRequests: 0,
    totalBorrowers: 0,
  });
  const [submittedLoans, setSubmittedLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [showMotifModal, setShowMotifModal] = useState(false);
  const [motifModalContent, setMotifModalContent] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);

  const [totalEmprunts, setTotalEmprunts] = useState(0);
  const [totalEmpruntsActifs, setTotalEmpruntsActifs] = useState(0);
  const [totalEmpruntsRembourses, setTotalEmpruntsRembourses] = useState(0);

  // États pour l'exportation
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Charger toutes les sessions disponibles
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsData = await getAllSessions();
        console.log("session emprunt : ", sessionsData);
        setSessions(sessionsData);

        // Par défaut, utiliser la session en cours
        if (sessionEnCours) {
          setSelectedSession(sessionEnCours);
        } else if (sessionsData.length > 0) {
          // Sinon, prendre la première session active disponible
          const activeSession = sessionsData.find(
            (s) => s.status === "EN_COURS"
          );
          if (activeSession) {
            setSelectedSession(activeSession);
          } else {
            setSelectedSession(sessionsData[0]);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions:", error);
        showToast({
          type: "error",
          message: "Impossible de charger les sessions",
        });
      }
    };

    fetchSessions();
  }, [sessionEnCours]);

  // Effet pour charger les données du dashboard quand la session change
  useEffect(() => {
    if (selectedSession?.id) {
      fetchDashboardData(selectedSession.id);
    }
  }, [selectedSession]);

  // Focus auto sur la recherche à l'ouverture
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Fonction pour charger les montants selon la session
  const fetchMontants = async (sessionId) => {
    try {
      setLoading(true);
      console.log("Chargement des montants pour la session:", sessionId);

      const [total, actifs, rembourses] = await Promise.all([
        EmpruntService.getMontantTotalEmpruntsBySession(sessionId),
        EmpruntService.getMontantTotalEmpruntsHorsAttenteBySession(sessionId),
        EmpruntService.getMontantTotalRembourseOuValide(sessionId),
      ]);

      console.log("Montants reçus:", { total, actifs, rembourses });

      setTotalEmprunts(Number(total || 0));
      setTotalEmpruntsActifs(Number(actifs || 0));
      setTotalEmpruntsRembourses(Number(rembourses || 0));
    } catch (error) {
      console.error("Détails de l'erreur:", error.response || error);
      showToast(
        "error",
        `Erreur lors du chargement des montants: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Fonction de gestion du changement de session
  const handleSessionChange = (session) => {
    setSelectedSession(session);
    setShowSessionDropdown(false);
  };

  const fetchDashboardData = async (sessionId) => {
    try {
      setLoading(true);

      // Charger les montants pour cette session
      await fetchMontants(sessionId);

      // Filtrer les emprunts par statut et session
      const allLoans = await EmpruntService.getAllEmpruntsBySession(sessionId);
      const emprunts = allLoans || [];

      // Filtrer les emprunts par statut pour cette session
      const soumis = emprunts.filter(
        (loan) => loan.statut === "SOUMIS" && loan.sessionId === sessionId
      );
      const enAttente = emprunts.filter(
        (loan) => loan.statut === "EN_ATTENTE" && loan.sessionId === sessionId
      );
      const valides = emprunts.filter(
        (loan) => loan.statut === "VALIDE" && loan.sessionId === sessionId
      );

      setSubmittedLoans(soumis);
      setPendingLoans(enAttente);
      setApprovedLoans(valides);

      // Statistiques
      const pendingRequests = soumis.length + enAttente.length;

      // Emprunteurs uniques pour cette session
      const totalBorrowers = new Set(
        emprunts
          .filter(
            (loan) =>
              (loan.statut === "VALIDE" || loan.statut === "REMBOURSE") &&
              loan.sessionId === sessionId
          )
          .map((loan) => loan.membreId)
      ).size;

      setStats({
        pendingRequests,
        totalBorrowers,
      });

      setLoanHistory(emprunts);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      showToast("error", "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'export des emprunts
  const handleExport = async ({
    exportType,
    selectedPeriodeId,
    intervalDates,
    user,
  }) => {
    setExportLoading(true);
    showToast("info", "Génération du rapport en cours...");

    try {
      let blob;

      if (exportType === "session") {
        if (!selectedSession?.id) {
          showToast("error", "Aucune session sélectionnée");
          return;
        }
        blob = await exportEmpruntsPdfBySession(
          selectedSession.id,
          user.email,
          user.role
        );
      } else if (exportType === "periode") {
        if (!selectedPeriodeId) {
          showToast("error", "Veuillez sélectionner une période");
          return;
        }
        blob = await exportEmpruntsPdfByPeriode(
          selectedPeriodeId,
          user.email,
          user.role
        );
      } else if (exportType === "interval") {
        if (!intervalDates.startDate || !intervalDates.endDate) {
          showToast("error", "Veuillez sélectionner un intervalle de dates");
          return;
        }

        blob = await exportEmpruntsPdfByInterval(
          intervalDates.startDate,
          intervalDates.endDate,
          user.email,
          user.role
        );
      }

      if (blob && blob.size > 100) {
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" })
        );
        setPdfPreviewUrl(url);
        setPdfPreviewOpen(true);
        showToast("success", "Rapport généré avec succès !");
      } else {
        showToast("warning", "Le rapport généré est vide");
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      showToast("error", "Erreur lors de l'export du rapport");
    } finally {
      setExportLoading(false);
      setExportModalOpen(false);
    }
  };

  const handleLoanAction = async (loanId, action, reason = "") => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.id) throw new Error("Utilisateur non connecté");

      if (action === "approve") {
        await EmpruntService.acceptEmprunt(loanId, userData.id, interestRate);
        setApprovalModal(null);
        setInterestRate("");
      } else if (action === "reject") {
        const refuserEmpruntDto = {
          tresoriereId: userData.id,
          motif: reason,
        };
        await EmpruntService.refuseEmprunt(loanId, refuserEmpruntDto);
        setRejectionModal(null);
        setRejectionReason("");
      }

      showToast(
        "success",
        action === "approve"
          ? "Emprunt approuvé avec succès"
          : "Emprunt rejeté avec succès"
      );

      // Recharger les données pour la session sélectionnée
      if (selectedSession?.id) {
        fetchDashboardData(selectedSession.id);
      }
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        error.response?.data?.message || "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      SOUMIS: "bg-orange-100 text-orange-800",
      EN_ATTENTE: "bg-orange-100 text-orange-800",
      VALIDE: "bg-green-100 text-green-800",
      REFUSE: "bg-red-100 text-red-800",
      REMBOURSE: "bg-blue-100 text-blue-800",
      ANNULE: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      SOUMIS: "Soumis",
      EN_ATTENTE: "En attente",
      VALIDE: "Validé",
      REFUSE: "Refusé",
      REMBOURSE: "Remboursé",
      ANNULE: "Annulé",
    };
    return labels[status] || status;
  };

  // Filtrage de l'historique selon la recherche
  const filteredLoanHistory = loanHistory.filter((loan) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;
    const membre = loan.membre || {};
    return (
      (membre.firstName && membre.firstName.toLowerCase().includes(search)) ||
      (membre.lastName && membre.lastName.toLowerCase().includes(search)) ||
      (membre.email && membre.email.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      {/* Sélecteur de session */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <button
            onClick={() => setShowSessionDropdown(!showSessionDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <Filter size={16} />
            <span>
              {selectedSession
                ? selectedSession.titreSession
                : "Sélectionner une session"}
            </span>
            <ChevronDown size={16} />
          </button>

          {showSessionDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <ul className="py-2 max-h-64 overflow-y-auto">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    onClick={() => handleSessionChange(session)}
                    className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${
                      session.id === selectedSession?.id
                        ? "bg-indigo-100 font-semibold"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{session.titreSession}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          session.status === "EN_COURS"
                            ? "bg-green-100 text-green-700"
                            : session.status === "TERMINE"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {session.status === "EN_COURS"
                          ? "En cours"
                          : session.status === "TERMINE"
                          ? "Terminée"
                          : "En attente"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bouton d'export */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={() => setExportModalOpen(true)}
          disabled={!selectedSession}
        >
          <Download className="w-5 h-5" />
          Exporter les emprunts
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 : Total des emprunts */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 32px 0 rgba(80,80,200,0.15)",
          }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
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
              <p className="text-sm opacity-90">Total des emprunts</p>
              <h3 className="text-2xl font-bold">
                {Number(totalEmprunts).toLocaleString("fr-FR")} FCFA
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card 2 : Emprunts actifs */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.08,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 32px 0 rgba(60,200,120,0.13)",
          }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
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
              <p className="text-sm opacity-90">Emprunts actifs</p>
              <h3 className="text-2xl font-bold">
                {Number(totalEmpruntsActifs).toLocaleString("fr-FR")} FCFA
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card 3 : Demandes à traiter */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.16,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 32px 0 rgba(255,140,0,0.13)",
          }}
          className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
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
              <p className="text-sm opacity-90">Demandes à traiter</p>
              <h3 className="text-2xl font-bold">{stats.pendingRequests}</h3>
            </div>
          </div>
        </motion.div>

        {/* Card 4 : Emprunts remboursés/validés */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.24,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 32px 0 rgba(80,120,255,0.13)",
          }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
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
              <p className="text-sm opacity-90">Emprunteurs</p>
              <h3 className="text-2xl font-bold">{stats.totalBorrowers}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Demandes à traiter améliorées */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500" />
          Demandes à traiter
          <span className="ml-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
            {stats.pendingRequests}
          </span>
        </h2>

        {submittedLoans.length > 0 || pendingLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...submittedLoans, ...pendingLoans].map((loan) => (
              <LoanRequestCard
                key={loan.id}
                loan={loan}
                onApprove={() => setApprovalModal(loan.id)}
                onReject={() => setRejectionModal(loan.id)}
                loading={loading}
                getStatusStyle={getStatusStyle}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Clock className="w-12 h-12 text-orange-200 mb-2" />
            <p className="text-gray-500 text-lg">Aucune demande à traiter</p>
          </div>
        )}
      </div>

      {/* Historique complet */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            Historique des emprunts
          </h2>
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border  border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500  text-sm transition"
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[700px]">
            <thead className="sticky top-0 bg-indigo-50 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Membre
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Montant
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Intérêt
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Garant
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Motif
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Date demande
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Statut
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">
                  Traitement
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLoanHistory.map((loan, idx) => (
                <tr
                  key={loan.id}
                  className={`transition-colors duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-base shadow">
                      {loan.membre?.firstName?.[0] || "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {loan.membre?.lastName} {loan.membre?.firstName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {loan.membre?.email || ""}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-700">
                    {Number(loan.montantEmprunt).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="py-3 px-4">
                    {loan.interet ? (
                      <span className="text-green-600 font-semibold">
                        {loan.interet}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {loan.garant ? (
                      <span className="text-indigo-700 font-medium">
                        {loan.garant.firstName} {loan.garant.lastName}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 max-w-xs truncate cursor-pointer underline decoration-dotted decoration-indigo-400"
                    title="Cliquez pour voir le motif complet"
                    onClick={() => {
                      setMotifModalContent(loan.motif);
                      setShowMotifModal(true);
                    }}
                  >
                    {loan.motif && loan.motif.length > 10
                      ? loan.motif.slice(0, 10) + "..."
                      : loan.motif}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(loan.dateDemande).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        loan.statut
                      )}`}
                    >
                      {getStatusLabel(loan.statut)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {loan.dateValidation
                      ? new Date(loan.dateValidation).toLocaleDateString(
                          "fr-FR"
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLoanHistory.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">
                Aucun résultat pour cette recherche
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modale d'export */}
      <ExportEmpruntModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        periodes={selectedSession?.periodes || []}
        loading={exportLoading}
        sessionId={selectedSession?.id}
        sessionTitle={selectedSession?.titreSession}
        user={JSON.parse(localStorage.getItem("user")) || {}}
        onExport={handleExport}
      />
      {/* Prévisualisation PDF */}
      {pdfPreviewOpen && pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 relative">
            <button
              onClick={() => setPdfPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Prévisualisation du rapport
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Vérifiez le contenu avant de télécharger
              </p>
            </div>

            <div className="w-full h-[70vh] bg-gray-50 rounded-lg overflow-hidden border">
              <iframe
                src={pdfPreviewUrl}
                title="Prévisualisation PDF"
                className="w-full h-full"
              />
            </div>

            <div className="flex justify-end items-center gap-4 mt-4">
              <button
                onClick={() => setPdfPreviewOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Fermer
              </button>
              <a
                href={pdfPreviewUrl}
                download={`emprunts_${
                  selectedSession?.titreSession || "export"
                }.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Download className="w-5 h-5" />
                Télécharger le PDF
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Modal d'approbation */}
      {approvalModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center"
          aria-labelledby="approval-modal-title"
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
                className="text-xl font-semibold text-gray-900 mb-4"
                id="approval-modal-title"
              >
                Confirmer la validation de l'emprunt
              </h3>
              {/* Affichage du garant */}
              {(() => {
                const currentApprovalLoan = [
                  ...submittedLoans,
                  ...pendingLoans,
                ].find((loan) => loan.id === approvalModal);
                return currentApprovalLoan?.garant ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Garant
                    </label>
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                      <Users className="w-5 h-5" />
                      {currentApprovalLoan.garant.firstName}{" "}
                      {currentApprovalLoan.garant.lastName}
                    </div>
                  </div>
                ) : null;
              })()}
              <div className="mb-4 text-gray-700">
                Êtes-vous sûr de vouloir valider cette demande d'emprunt ?
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
              <button
                onClick={() => handleLoanAction(approvalModal, "approve")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Spinner size="sm" />
                    <span className="ml-2">Validation...</span>
                  </span>
                ) : (
                  "Confirmer la validation"
                )}
              </button>
              <button
                onClick={() => setApprovalModal(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de rejet */}
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
                className="text-xl font-semibold text-gray-900 mb-4"
                id="rejection-modal-title"
              >
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
                onClick={() =>
                  handleLoanAction(rejectionModal, "reject", rejectionReason)
                }
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={loading || !rejectionReason.trim()}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Spinner size="sm" />
                    <span className="ml-2">Traitement...</span>
                  </span>
                ) : (
                  "Confirmer le rejet"
                )}
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal motif complet */}
      {showMotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowMotifModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600 text-xl"
              aria-label="Fermer"
            >
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-2 text-indigo-700">
              Motif complet
            </h4>
            <p className="text-gray-700 whitespace-pre-line">
              {motifModalContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant de carte pour les demandes d'emprunt
const LoanRequestCard = ({
  loan,
  onApprove,
  onReject,
  loading,
  getStatusStyle,
  getStatusLabel,
}) => {
  const [showMotif, setShowMotif] = useState(false);

  const motifTronque =
    loan.motif && loan.motif.length > 35
      ? loan.motif.slice(0, 10) + "..."
      : loan.motif;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow group hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-lg shadow">
            {loan.membre?.firstName?.[0] || "?"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {loan.membre?.lastName} {loan.membre?.firstName}
            </h3>
            <p className="text-xs text-gray-500">
              Demande le{" "}
              {new Date(loan.dateDemande).toLocaleDateString("fr-FR")}
            </p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2 ${getStatusStyle(
                loan.statut
              )}`}
            >
              {getStatusLabel(loan.statut)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xl font-bold text-indigo-700">
            {Number(loan.montantEmprunt).toLocaleString("fr-FR")} FCFA
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs text-gray-500 max-w-[180px] truncate cursor-pointer underline decoration-dotted decoration-indigo-400"
              title="Cliquez pour voir le motif complet"
              onClick={() => setShowMotif(true)}
            >
              Motif : {motifTronque}
            </span>
            {loan.garant && (loan.garant.firstName || loan.garant.lastName) && (
              <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1">
                <Users className="w-4 h-4" />
                Garant : {loan.garant.lastName} {loan.garant.firstName}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Approuver</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={onReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 shadow"
              disabled={loading}
            >
              <XCircle className="w-4 h-4" />
              <span>Rejeter</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal motif complet */}
      {showMotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowMotif(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600 text-xl"
              aria-label="Fermer"
            >
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-2 text-indigo-700">
              Motif complet
            </h4>
            <p className="text-gray-700 whitespace-pre-line">{loan.motif}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
LoanRequestCard.propTypes = {
  loan: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getStatusStyle: PropTypes.func.isRequired,
  getStatusLabel: PropTypes.func.isRequired,
};

export default TreasurerDashboard;
