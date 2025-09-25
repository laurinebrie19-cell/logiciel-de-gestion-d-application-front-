import axios from "axios";
import { apiConfig } from "./api.config";

const annonceApi = axios.create({
  baseURL: apiConfig.annonce,
  headers: {
    "Content-Type": "application/json",
  },
});

export const annonceService = {
  createAnnonce: async (data) => {
    try {
      // S'assurer que les IDs sont des nombres
      const formattedData = {
        ...data,
        typeAnnonceId: Number(data.typeAnnonceId),
        categorieAnnonceId: Number(data.categorieAnnonceId)
      };
      
      const response = await annonceApi.post("", formattedData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      throw error;
    }
  },

  getAnnonceById: async (id) => {
    try {
      const response = await annonceApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'annonce:", error);
      throw error;
    }
  },

  getAllAnnonces: async () => {
    try {
      const response = await annonceApi.get("");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
      throw error;
    }
  },

  updateAnnonce: async (id, data) => {
    try {
      // S'assurer que les IDs sont des nombres
      const formattedData = {
        ...data,
        typeAnnonceId: Number(data.typeAnnonceId),
        categorieAnnonceId: Number(data.categorieAnnonceId)
      };
      
      const response = await annonceApi.put(`/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification de l'annonce:", error);
      throw error;
    }
  },

  deleteAnnonce: async (id) => {
    try {
      await annonceApi.delete(`/${id}`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce:", error);
      throw error;
    }
  },

  getAnnoncesByCategory: async (categoryId) => {
    try {
      const response = await annonceApi.get(`/category/${categoryId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces par catégorie:", error);
      throw error;
    }
  },

  getAnnoncesByType: async (typeId) => {
    try {
      const response = await annonceApi.get(`/type/${typeId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces par type:", error);
      throw error;
    }
  },

  getActiveAnnonces: async () => {
    try {
      const response = await annonceApi.get("/active");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces actives:", error);
      throw error;
    }
  },
};
