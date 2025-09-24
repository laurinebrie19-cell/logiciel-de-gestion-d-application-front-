import axios from "axios";
import { apiConfig } from "./api.config";

const fonctionBureauAPI = axios.create({
  baseURL: apiConfig.fonctionBureau,
  headers: {
    "Content-Type": "application/json",
  },
});

// Créer une fonction
export const createFonctionBureau = async (data) => {
  try {
    const response = await fonctionBureauAPI.post("", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la fonction:", error);
    throw error;
  }
};

// Récupérer toutes les fonctions
export const getAllFonctionsBureau = async () => {
  try {
    const response = await fonctionBureauAPI.get("");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des fonctions:", error);
    throw error;
  }
};

// Récupérer une fonction par ID
export const getFonctionBureauById = async (id) => {
  try {
    const response = await fonctionBureauAPI.get(`${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la fonction:", error);
    throw error;
  }
};

// Mettre à jour une fonction
export const updateFonctionBureau = async (id, data) => {
  try {
    const response = await fonctionBureauAPI.put(`${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la fonction:", error);
    throw error;
  }
};

// Supprimer une fonction
export const deleteFonctionBureau = async (id) => {
  try {
    await fonctionBureauAPI.delete(`${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la fonction:", error);
    throw error;
  }
};