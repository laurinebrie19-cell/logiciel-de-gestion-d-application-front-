import axios from "axios";
import { apiConfig } from "./api.config";

const categorieAnnonceApi = axios.create({
  baseURL: apiConfig.categorieAnnonce,
  headers: {
    "Content-Type": "application/json",
  },
});

export const categorieAnnonceService = {
  createCategorieAnnonce: async (data) => {
    try {
      console.log('Données envoyées à l\'API:', data);
      const response = await categorieAnnonceApi.post("", data);
      console.log('Réponse de l\'API:', response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'une catégorie d'annonce", error.response || error);
      throw error;
    }
  },

  getAllCategorieAnnonces: async () => {
    try {
      const response = await categorieAnnonceApi.get("");
      console.log('API Response:', response); // Pour déboguer
      // Si les données sont dans une propriété spécifique de la réponse
      const data = response.data;
      if (!Array.isArray(data)) {
        console.warn('La réponse de l\'API n\'est pas un tableau:', data);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories d'annonce", error);
      throw error;
    }
  },

  getCategorieAnnonce: async (id) => {
    try {
      const response = await categorieAnnonceApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'une catégorie d'annonce", error);
      throw error;
    }
  },

  updateCategorieAnnonce: async (id, data) => {
    try {
      const response = await categorieAnnonceApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'une catégorie d'annonce", error);
      throw error;
    }
  },

  deleteCategorieAnnonce: async (id) => {
    try {
      await categorieAnnonceApi.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une catégorie d'annonce", error);
      throw error;
    }
  }
};
