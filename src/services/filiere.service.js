import axios from "axios";
import { apiConfig } from "./api.config";

const filiereApi = axios.create({
  baseURL: apiConfig.filiere,
  headers: {
    "Content-Type": "application/json",
  },
});

export const filiereService = {
  createFiliere: async (data) => {
    try {
      const response = await filiereApi.post("", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'une filière", error);
      throw error;
    }
  },

  getSpecialitesByFiliere: async (filiereId) => {
    try {
      const response = await filiereApi.get(`/${filiereId}/specialites`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités d'une filière", error);
      throw error;
    }
  },

  getFilieres: async () => {
    try {
      const response = await filiereApi.get("");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des filières", error);
      throw error;
    }
  },

  getFiliere: async (id) => {
    try {
      const response = await filiereApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'une filière", error);
      throw error;
    }
  },

  updateFiliere: async (id, data) => {
    try {
      const response = await filiereApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'une filière", error);
      throw error;
    }
  },

  deleteFiliere: async (id) => {
    try {
      await filiereApi.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une filière", error);
      throw error;
    }
  }
};
