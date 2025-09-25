import axios from "axios";
import { apiConfig } from "./api.config";

const typeAnnonceApi = axios.create({
  baseURL: apiConfig.typeAnnonce,
  headers: {
    "Content-Type": "application/json",
  },
});

export const typeAnnonceService = {
  createTypeAnnonce: async (data) => {
    try {
      const response = await typeAnnonceApi.post("", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'un type d'annonce", error);
      throw error;
    }
  },

  getAllTypeAnnonces: async () => {
    try {
      const response = await typeAnnonceApi.get("");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des types d'annonce", error);
      throw error;
    }
  },

  getTypeAnnonce: async (id) => {
    try {
      const response = await typeAnnonceApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'un type d'annonce", error);
      throw error;
    }
  },

  updateTypeAnnonce: async (id, data) => {
    try {
      const response = await typeAnnonceApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'un type d'annonce", error);
      throw error;
    }
  },

  deleteTypeAnnonce: async (id) => {
    try {
      await typeAnnonceApi.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'un type d'annonce", error);
      throw error;
    }
  }
};
