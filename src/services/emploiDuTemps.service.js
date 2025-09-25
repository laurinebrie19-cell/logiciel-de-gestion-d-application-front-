import axios from "axios";
import { apiConfig } from "./api.config";

const emploiDuTempsApi = axios.create({
  baseURL: apiConfig.emploiDuTemps,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllEmploisDuTemps = async () => {
  try {
    const response = await emploiDuTempsApi.get("");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getEmploisDuTempsByFiliere = async (filiereId) => {
  try {
    const response = await emploiDuTempsApi.get(`/filiere/${filiereId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getEmploisDuTempsByFiliereAndNiveau = async (filiereId, niveauId) => {
  try {
    const response = await emploiDuTempsApi.get(`/filiere/${filiereId}/niveau/${niveauId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getEmploiDuTempsById = async (id) => {
  try {
    const response = await emploiDuTempsApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createEmploiDuTemps = async (data) => {
  try {
    const response = await emploiDuTempsApi.post("", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateEmploiDuTemps = async (id, data) => {
  try {
    const response = await emploiDuTempsApi.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Erreur lors de la mise à jour de l\'emploi du temps:', error);
    throw error.response?.data || error;
  }
};

export const deleteEmploiDuTemps = async (id) => {
  try {
    await emploiDuTempsApi.delete(`/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};
