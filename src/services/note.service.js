import axios from "axios";
import { apiConfig } from "./api.config";

const noteApi = axios.create({
  baseURL: apiConfig.note,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ajouterNote = async (noteData) => {
  try {
    const response = await noteApi.post("/ajouter", noteData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la note:", error);
    throw error;
  }
};

export const getNotesParEtudiant = async (etudiantId) => {
  try {
    const response = await noteApi.get(`/etudiant/${etudiantId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notes de l'étudiant:", error);
    throw error;
  }
};

export const getNotesParMatiereEtNiveau = async (matiereId, niveauId) => {
  try {
    const response = await noteApi.get(`/matiere/${matiereId}/niveau/${niveauId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notes par matière et niveau:", error);
    throw error;
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const response = await noteApi.put(`/${noteId}`, noteData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note:", error);
    throw error;
  }
};
