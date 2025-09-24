import axios from "axios";
import { apiConfig } from "./api.config";

/**
 * Service pour l'exportation des données de remboursement
 */

// Export PDF par session
export const exportRemboursementsPdfBySession = async (
  sessionId,
  email,
  role
) => {
  try {
    const response = await axios.get(
      `${
        apiConfig.remboursementExport
      }/remboursements/session/${sessionId}?email=${encodeURIComponent(
        email
      )}&role=${encodeURIComponent(role)}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'export PDF des remboursements par session:",
      error
    );
    throw error;
  }
};

// Export PDF par période
export const exportRemboursementsPdfByPeriode = async (
  periodeId,
  email,
  role
) => {
  try {
    const response = await axios.get(
      `${
        apiConfig.remboursementExport
      }/remboursements/periode/${periodeId}?email=${encodeURIComponent(
        email
      )}&role=${encodeURIComponent(role)}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'export PDF des remboursements par période:",
      error
    );
    throw error;
  }
};

// Export PDF par intervalle de dates
export const exportRemboursementsPdfByInterval = async (
  dateDebut,
  dateFin,
  email,
  role
) => {
  try {
    // Formater les dates au format (YYYY-MM-DD) si elles ne le sont pas déjà
    const formatDate = (date) => {
      // Si c'est déjà une chaîne au format YYYY-MM-DD, on la retourne
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      // Sinon, on essaie de la convertir
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    const formattedDateDebut = formatDate(dateDebut);
    const formattedDateFin = formatDate(dateFin);

    console.log("Dates d'export:", formattedDateDebut, formattedDateFin);

    const response = await axios.get(
      `${
        apiConfig.remboursementExport
      }/remboursements/intervalle?dateDebut=${formattedDateDebut}&dateFin=${formattedDateFin}&email=${encodeURIComponent(
        email
      )}&role=${encodeURIComponent(role)}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'export PDF des remboursements par intervalle:",
      error
    );
    throw error;
  }
};
