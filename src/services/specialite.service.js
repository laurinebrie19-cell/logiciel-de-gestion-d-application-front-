import axios from "axios";
import { apiConfig } from "./api.config";

const specialiteApi = axios.create({
  baseURL: apiConfig.specialite,
  headers: {
    "Content-Type": "application/json",
  },
});

export const specialiteService = {
  createSpecialite: async (data) => {
    try {
      const response = await specialiteApi.post("", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création d'une spécialité", error);
      throw error;
    }
  },

  getSpecialites: async () => {
    try {
      const response = await specialiteApi.get("");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités", error);
      throw error;
    }
  },

  getSpecialite: async (id) => {
    try {
      const response = await specialiteApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération d'une spécialité", error);
      throw error;
    }
  },

  updateSpecialite: async (id, data) => {
    try {
      const response = await specialiteApi.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification d'une spécialité", error);
      throw error;
    }
  },

  deleteSpecialite: async (id) => {
    try {
      await specialiteApi.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression d'une spécialité", error);
      throw error;
    }
  }
};
