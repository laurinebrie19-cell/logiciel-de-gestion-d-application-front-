import axios from "axios";
import { apiConfig } from "./api.config";

const salleApi = axios.create({
  baseURL: apiConfig.salle,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllSalles = async () => {
  try {
    const response = await salleApi.get("");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    throw error;
  }
};

export const getSalleById = async (id) => {
  try {
    const response = await salleApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la salle:", error);
    throw error;
  }
};

export const createSalle = async (data) => {
  try {
    const response = await salleApi.post("", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la salle:", error);
    throw error;
  }
};

export const updateSalle = async (id, data) => {
  try {
    const response = await salleApi.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification de la salle:", error);
    throw error;
  }
};

export const deleteSalle = async (id) => {
  try {
    await salleApi.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la salle:", error);
    throw error;
  }
};
