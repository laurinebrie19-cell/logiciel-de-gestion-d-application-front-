import axios from "axios";
import { apiConfig } from "./api.config";

const matiereApi = axios.create({
  baseURL: apiConfig.matiere || "http://localhost:8066/api/matieres",
  headers: {
    "Content-Type": "application/json",
  },
});

export const matiereService = {
  createMatiere: async (data) => {
    try {
      const response = await matiereApi.post("", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'une matière", error);
      throw error;
    }
  },

  getAllMatieres: async () => {
    try {
      const response = await matiereApi.get("");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières", error);
      throw error;
    }
  },

  getMatiereById: async (id) => {
    try {
      const response = await matiereApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'une matière", error);
      throw error;
    }
  },

  updateMatiere: async (id, data) => {
    try {
      const response = await matiereApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'une matière", error);
      throw error;
    }
  },

  deleteMatiere: async (id) => {
    try {
      const response = await matiereApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression d'une matière", error);
      throw error;
    }
  },

  getMatieresByNiveau: async (niveauId) => {
    try {
      const response = await matiereApi.get(`/niveau/${niveauId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières par niveau", error);
      throw error;
    }
  },

  getMatieresBySpecialite: async (specialiteId) => {
    try {
      const response = await matiereApi.get(`/specialite/${specialiteId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières par spécialité", error);
      throw error;
    }
  },

  getMatieresByNiveauAndSpecialite: async (niveauId, specialiteId) => {
    try {
      const response = await matiereApi.get(`/niveau/${niveauId}/specialite/${specialiteId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières par niveau et spécialité", error);
      throw error;
    }
  },

  getMatieresTroncCommunByNiveau: async (niveauId) => {
    try {
      const response = await matiereApi.get(`/niveau/${niveauId}/tronc-commun`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières de tronc commun par niveau", error);
      throw error;
    }
  },

  getMatieresSpecialiteByNiveau: async (niveauId, specialiteId) => {
    try {
      const response = await matiereApi.get(`/niveau/${niveauId}/specialite/${specialiteId}/specialite-seule`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des matières spécifiques par niveau et spécialité", error);
      throw error;
    }
  }
};
