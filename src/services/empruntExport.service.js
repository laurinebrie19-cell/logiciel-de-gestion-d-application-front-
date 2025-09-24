import axios from "axios";
import { apiConfig } from "./api.config";

// Export PDF par session
export const exportEmpruntsPdfBySession = async (sessionId, email, role) => {
  const response = await axios.get(
    `${apiConfig.empruntExport}/session/${sessionId}?email=${encodeURIComponent(
      email
    )}&role=${encodeURIComponent(role)}`,
    { responseType: "blob" }
  );
  return response.data;
};

// Export PDF par période
export const exportEmpruntsPdfByPeriode = async (periodeId, email, role) => {
  const response = await axios.get(
    `${apiConfig.empruntExport}/periode/${periodeId}?email=${encodeURIComponent(
      email
    )}&role=${encodeURIComponent(role)}`,
    { responseType: "blob" }
  );
  return response.data;
};

// Export PDF par intervalle de dates
export const exportEmpruntsPdfByInterval = async (
  dateDebut,
  dateFin,
  email,
  role
) => {
  const response = await axios.get(
    `${
      apiConfig.empruntExport
    }/intervalle?dateDebut=${dateDebut}&dateFin=${dateFin}&email=${encodeURIComponent(
      email
    )}&role=${encodeURIComponent(role)}`,
    { responseType: "blob" }
  );
  return response.data;
};
