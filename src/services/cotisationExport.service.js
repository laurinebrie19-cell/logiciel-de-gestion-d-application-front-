import axios from "axios";
import { apiConfig } from "./api.config";

// Export Excel d'une session
export const exportCotisationsExcelBySession = async (sessionId) => {
  const url = `${apiConfig.generateDocument}/export/excel?sessionId=${sessionId}`;
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

// Export PDF d'une session
export const exportCotisationsPdfBySession = async (sessionId) => {
  const url = `${apiConfig.generateDocument}/export/pdf/session/${sessionId}`;
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

// Export PDF d'une période (POST avec email et role)
export const exportCotisationsPdfByPeriode = async (periodeId, email, role) => {
  const url = `${
    apiConfig.generateDocument
  }/periodes/${periodeId}?periodeId=${periodeId}&email=${encodeURIComponent(
    email
  )}&role=${encodeURIComponent(role)}`;
  const response = await axios.get(url, null, { responseType: "blob" });
  return response.data;
};

// export Excel d'une période
export const exportCotisationsExcelByPeriode = async (
  periodeId,
  email,
  role
) => {
  const url = `${
    apiConfig.generateDocument
  }/periode/excel/${periodeId}?periodeId=${periodeId}&email=${encodeURIComponent(
    email
  )}&role=${encodeURIComponent(role)}`;
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

// Export PDF par intervalle de dates
export const exportCotisationsPdfByInterval = async (startDate, endDate) => {
  const url = `${apiConfig.generateDocument}/export/pdf?startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

// export excel par intervalle de date
export const exportPeriodesExcelByInterval = async (startDate, endDate) => {
  const url = `${apiConfig.generateDocument}/exports/excels?startDate=${startDate}&endDate=${endDate}`;
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};
