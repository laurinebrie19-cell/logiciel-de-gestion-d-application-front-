import axios from "axios";
import { apiConfig } from "./api.config";

const etudiantApi = axios.create({
  baseURL: apiConfig.etudiant || "http://localhost:8066/api/etudiants",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllEtudiants = async () => {
  try {
    const response = await etudiantApi.get("");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants", error);
    throw error;
  }
};

export const getEtudiantById = async (id) => {
  try {
    const response = await etudiantApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération d'un étudiant", error);
    throw error;
  }
};

export const createEtudiant = async (data) => {
  try {
    const response = await etudiantApi.post("", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'un étudiant", error);
    throw error;
  }
};

export const updateEtudiant = async (id, data) => {
  try {
    const response = await etudiantApi.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification d'un étudiant", error);
    throw error;
  }
};

export const getEtudiantsByNiveau = async (niveauId) => {
  try {
    const response = await etudiantApi.get(`/niveau/${niveauId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants par niveau", error);
    throw error;
  }
};

export const deleteEtudiant = async (id) => {
  try {
    const response = await etudiantApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression d'un étudiant", error);
    throw error;
  }
};
