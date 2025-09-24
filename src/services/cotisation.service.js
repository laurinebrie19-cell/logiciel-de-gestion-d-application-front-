import axios from "axios";
import { apiConfig } from "./api.config";

const cotisationAPI = axios.create({
  baseURL: apiConfig.cotisation,
  headers: {
    "Content-Type": "application/json",
  },
});

// Créer une cotisation
export const createCotisation = async (cotisationData) => {
  try {
    const response = await cotisationAPI.post("", cotisationData);
    return response.data; // { status, message, data }
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Mettre à jour une cotisation
export const updateCotisation = async (id, cotisationData) => {
  try {
    const response = await cotisationAPI.put(`/${id}`, cotisationData);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Supprimer une cotisation
export const deleteCotisation = async (id) => {
  try {
    const response = await cotisationAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer toutes les cotisations
export const getAllCotisations = async () => {
  try {
    const response = await cotisationAPI.get("/");
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer une cotisation par ID
export const getCotisationById = async (id) => {
  try {
    const response = await cotisationAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer les cotisations par période
export const getCotisationsByPeriodeId = async (periodeId) => {
  try {
    const response = await cotisationAPI.get(`/by-periode/${periodeId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer les membres ayant cotisé pour une période
export const getMembresParPeriode = async (periodeId) => {
  try {
    const response = await cotisationAPI.get(`/membres/${periodeId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer les non-cotisants pour une période
export const getNonCotisants = async (periodeId) => {
  try {
    const response = await cotisationAPI.get(`/non-cotisants/${periodeId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer les cotisations d'une session
export const getCotisationsBySession = async (sessionId) => {
  try {
    const response = await cotisationAPI.get(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer toutes les cotisations d'un membre pour une session
export const getAllCotisationsByMembreIdAndSessionId = async (
  membreId,
  sessionId
) => {
  try {
    const response = await cotisationAPI.get(`/${membreId}/${sessionId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer toutes les cotisations d'un membre
export const getCotisationsDuMembre = async (membreId) => {
  try {
    const response = await cotisationAPI.get(`/membre/${membreId}`);
    return {
      status: 200,
      message: "Cotisations du membre récupérées avec succès.",
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Erreur réseau",
      data: null,
    };
  }
};

// Récupérer le total des cotisations d'un membre pour une session
export const getTotalCotisationByMembreIdAndSessionId = async (
  membreId,
  sessionId
) => {
  try {
    const response = await cotisationAPI.get(
      `/membres/${membreId}/sessions/${sessionId}/`
    );
    return response.data?.data ?? 0;
  } catch (error) {
    return 0;
  }
};
