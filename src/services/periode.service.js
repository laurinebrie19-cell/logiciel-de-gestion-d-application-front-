import axios from "axios";
import { apiConfig } from "./api.config";

const periodeAPI = axios.create({
  baseURL: apiConfig.periode,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPeriodes = async () => {
  try {
    const response = await periodeAPI.get("");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des périodes:", error);
    throw error;
  }
};

export const getPeriodeById = async (id) => {
  try {
    const response = await periodeAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la période:", error);
    throw error;
  }
};

export const createPeriode = async (periodeData) => {
  try {
    const response = await periodeAPI.post("", periodeData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la période:", error);
    throw error;
  }
};

export const updatePeriodeStatus = async (id, action) => {
  try {
    const response = await periodeAPI.post(`/${id}/${action}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la période:",
      error
    );
    throw error;
  }
};
