
import React, { useState, useEffect } from "react";


import Toast from "../../../../components/common/Toasts";

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { DollarSign, X } from "lucide-react";
import Spinner from "../../../../components/common/Spinner";
import { effectuerRemboursement } from "../../../../services/rembousement.service";
import { useAuth } from "../../../../contexts/AutContext"; // Assurez-vous que le chemin est correct


const RepaymentModal = ({ loan, onClose, refreshLoans }) => {
  const { user, sessionEnCours } = useAuth();  // Récupère user et sessionEnCours
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [idtresorier, setIdtresorier] = useState(null);
const [idSession, setIdSession] = useState(null);



 // Récupération des ids depuis user, session, ou localStorage au montage
  useEffect(() => {
    if (user?.id) {
      setIdtresorier(user.id);
      localStorage.setItem("idtresorier", user.id);
    } else {
      const idtresorierFromStorage = localStorage.getItem("idtresorier");
      if (idtresorierFromStorage) setIdtresorier(parseInt(idtresorierFromStorage));
    }
    console.log("user:", user);
  

    if (sessionEnCours?.id) {
      setIdSession(sessionEnCours.id);
      localStorage.setItem("idSession", sessionEnCours.id);
    } else {
      const idSessionFromStorage = localStorage.getItem("idSession");
      if (idSessionFromStorage) setIdSession(parseInt(idSessionFromStorage));
    }
    console.log("sessionEnCours:", sessionEnCours);
  }, [user, sessionEnCours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const montantNum = parseFloat(montant);

    if (!montant || montantNum <= 0 || montantNum > loan.remainingAmount) {
      setToast({ type: "error", message: "Montant invalide" });
      return;
    }

    setLoading(true);

    try {
      await effectuerRemboursement({
  iduser: loan.iduser, // selon ta structure de loan
  idSession,
  idtresorier,
  idemprunt: loan.idemprunt,  // id de l'emprunt
  montant: montantNum,
});
 setToast({
        type: "success",
        message: "Remboursement enregistré avec succès",
      });




      if (refreshLoans) await refreshLoans();
      onClose();
    } catch (error) {
      console.log(idSession)
      console.error("Erreur remboursement :", error);
      setToast({ type: "error", message: "Erreur lors du remboursement." });

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Rembourser un emprunt
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">Membre : <strong>{loan.username}</strong></p>
          <p className="text-gray-700">
            Montant restant : <strong>{loan.remainingAmount} FCFA</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant à rembourser
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                max={loan.remainingAmount}
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />

            </div>


          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? <Spinner size="sm" /> : "Valider"}
            </button>
          </div>
          </div>
        </form>

    
      </motion.div>
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

RepaymentModal.propTypes = {
  loan: PropTypes.shape({
                          // iduser (ou change selon le backend)
    iduser: PropTypes.number.isRequired,
    idemprunt: PropTypes.number.isRequired, 
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    firstName:PropTypes.string.isRequired,
    email:PropTypes.string.isRequired,
    remainingAmount: PropTypes.number.isRequired,
    dateRemboursement: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,

  refreshLoans: PropTypes.func,

};

export default RepaymentModal;
