import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { X, CheckCircle, Calendar, DollarSign } from "lucide-react";
import { getHistoriqueRemboursements } from "../../../../services/rembousement.service.js";

const RepaymentDetailsModal = ({ loan, onClose }) => {
  const [repayments, setRepayments] = useState([]);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const data = await getHistoriqueRemboursements(loan.username); // Corrigé ici
        setRepayments(data);
      } catch (error) {
        console.error("Erreur lors du chargement des remboursements :", error);
      }
    };

    fetchRepayments();
  }, [loan.username]);

  const totalRepaid = Array.isArray(repayments)
    ? repayments.reduce((sum, rep) => sum + (Number(rep.montant) || 0), 0)
    : 0;
  const montant = loan.montant - totalRepaid;
  const remainingAmount = loan.montantnet - totalRepaid;
  const percentageRepaid = loan.montantnet
    ? Math.min((totalRepaid / loan.montantnet) * 100, 100)
    : 0;

  console.log("Montant net:", loan.montantnet);
  console.log("Remboursements:", repayments);
  console.log("Total remboursé:", totalRepaid);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Détails des remboursements
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations de l'emprunt */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Membre</p>
                <p className="font-medium text-gray-900">{loan.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'emprunt</p>
                <p className="font-medium text-gray-900">
                  {new Date(loan.dateEmprunt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant emprunté</p>

                <p className="font-medium text-gray-900">
                  {loan.montantEmprunt} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reste à payer</p>
                <p
                  className={`font-medium ${
                    remainingAmount > 0 ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {loan.remainingAmount} FCFA
                </p>

                <p className="text-sm text-gray-500">montant payer</p>
                <p
                  className={`font-medium ${
                    montant > 0 ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {loan.montant} FCFA
                </p>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progression du remboursement</span>
              <span>{Math.round(percentageRepaid)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${percentageRepaid}%` }}
              />
            </div>
          </div>

          {/* Timeline des remboursements */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              Historique des remboursements
            </h4>
            <div className="relative space-y-6">
              {repayments.map((repayment, index) => (
                <div key={repayment.id} className="relative pl-8 pb-6">
                  {index !== repayments.length - 1 && (
                    <div className="absolute left-3 top-6 h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    {/* Grille à 2 colonnes avec plus d'espace vertical */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          Montant remboursé :{" "}
                          <strong>{repayment.montant} FCFA</strong>
                        </span>
                      </div>
                      <div className="text-sm text-green-600 font-semibold">
                        Montant restant :{" "}
                        <strong>{repayment.remainingAmount} FCFA</strong>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(repayment.dateEmprunt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Traité par : {repayment.processedBy}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

RepaymentDetailsModal.propTypes = {
  loan: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    processedBy: PropTypes.string.isRequired,
    montant: PropTypes.number.isRequired,
    montantEmprunt: PropTypes.number.isRequired,
    statut: PropTypes.string.isRequired,
    montantnet: PropTypes.number.isRequired,
    dateRemboursement: PropTypes.string.isRequired,
    dateEmprunt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RepaymentDetailsModal;
