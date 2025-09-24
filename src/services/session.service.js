import axios from "axios";
import { apiConfig } from "./api.config";

const sessionAPI = axios.create({
  baseURL: apiConfig.session,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createSession = async (sessionData) => {
  try {
    console.log(sessionData);
    const response = await sessionAPI.post("", sessionData);
    console.log("reponse", response.data);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la création d'une session", error);
    throw error;
  }
};

export const getAllSessions = async () => {
  try {
    const response = await sessionAPI.get("");
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la récupération des sessions", error);
    throw error;
  }
};

export const getSessionById = async (id) => {
  try {
    const response = await sessionAPI.get(`${id}`);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la récupération d'une session", error);
    throw error;
  }
};

export const updateSession = async (id, sessionData) => {
  try {
    const response = await sessionAPI.put(`${id}`, sessionData);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la modification d'une session", error);
    throw error;
  }
};

export const terminateSession = async (id) => {
  try {
    const response = await sessionAPI.post(`${id}/terminate`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Erreur lors de la terminaison d'une session", error);
    throw error;
  }
};

export const deleteSession = async (id) => {
  try {
    const response = await sessionAPI.delete(`${id}`);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la suppression d'une session", error);
    throw error;
  }
};

export const startSession = async (id) => {
  try {
    const response = await sessionAPI.put(`${id}/demarrer`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("Une autre session est déjà en cours");
    }
    console.log("Erreur lors du démarrage de la session", error);
    throw error;
  }
};

export const putSessionEnAttente = async (id) => {
  try {
    const response = await sessionAPI.put(`${id}/en-attente`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Erreur lors de la mise en attente de la session", error);
    throw error;
  }
};
