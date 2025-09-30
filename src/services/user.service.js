import axios from "axios";
import { apiConfig } from "./api.config";

const userAPi = axios.create({
  baseURL: apiConfig.user,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async () => {
  try {
    const response = await userAPi.get("/getAllUsers");
    // Assurons-nous que response.data est un tableau
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error; // Propager l'erreur pour la gérer dans le composant
  }
};

export const getUserById = async (id) => {
  try {
    const response = await userAPi.get(`/getUserById/${id}`);
    return response.data;
  } catch (error) {
    console.log("erreur de recuperer d'un user", error);
  }
};

export const createUser = async (data) => {
  try {
    console.log(data);
    const response = await userAPi.post("/createUser", data);

    return response.data;
  } catch (error) {
    console.log("erreur lors de la creation d'un user", error);
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await userAPi.put(`/updateUser/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("erreur lors d la modification d'un user", error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await userAPi.delete(`/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    console.log("erreur lors de la suppression d'un user", error);
  }
};

export const getNiveauxByEnseignant = async (enseignantId) => {
  try {
    const response = await userAPi.get(`/${enseignantId}/niveaux`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des niveaux de l'enseignant:", error);
    throw error;
  }
};
