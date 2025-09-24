import axios from "axios";
import { apiConfig } from "./api.config";

const niveauApi = axios.create({
  baseURL: apiConfig.niveau,
  headers: {
    "Content-Type": "application/json",
  },
});

export const niveauService = {
  createNiveau: async (data) => {
    try {
      const response = await niveauApi.post("", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'un niveau", error);
      throw error;
    }
  },

  getNiveaux: async () => {
    try {
      const response = await niveauApi.get("");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des niveaux", error);
      throw error;
    }
  },

  getNiveau: async (id) => {
    try {
      const response = await niveauApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'un niveau", error);
      throw error;
    }
  },

  updateNiveau: async (id, data) => {
    try {
      const response = await niveauApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'un niveau", error);
      throw error;
    }
  },

  deleteNiveau: async (id) => {
    try {
      await niveauApi.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'un niveau", error);
      throw error;
    }
  }
};
