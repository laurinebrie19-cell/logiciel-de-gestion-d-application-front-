import axios from "axios";
import { apiConfig } from "./api.config";

const statApi = axios.create({
  baseURL: apiConfig.statistic, // attention : c'est bien "statistic" (pas "statistique") dans ton api.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Récupère la situation globale de tous les membres pour une session spécifique
export const getSituationsGlobalesParSession = async (sessionId) => {
  try {
    const response = await statApi.get(`/session/${sessionId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des situations globales par session",
      error
    );
    return [];
  }
};

// Récupère la situation globale d'un membre pour une session spécifique
export const getSituationGlobaleParMembreAndSession = async (
  membreId,
  sessionId
) => {
  try {
    const response = await statApi.get(
      `/membre/${membreId}/session/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la situation du membre pour la session",
      error
    );
    return null;
  }
};

// Exporte la situation globale d'un membre pour une session spécifique (PDF)
export const exportSituationParMembreAndSession = async (
  membreId,
  sessionId
) => {
  try {
    const response = await statApi.get(
      `/export/${membreId}/session/${sessionId}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'export PDF membre/session", error);
    return null;
  }
};

// Exporte les situations globales de tous les membres pour une session donnée (PDF)
export const exportToutesLesSituationsParSession = async (sessionId) => {
  try {
    const response = await statApi.get(`/export/session/${sessionId}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'export PDF global par session", error);
    return null;
  }
};

export const exportMembresEndettes = async () => {
  try {
    const response = await statApi.get("/pdf/membres-endettes", {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'export PDF membres endettés", error);
    return null;
  }
};
