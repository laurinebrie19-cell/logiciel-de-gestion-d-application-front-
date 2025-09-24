import axios from "axios";
import { apiConfig } from "./api.config";

const roleAPi = axios.create({
  baseURL: apiConfig.role,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllRoles = async () => {
  try {
    const response = await roleAPi.get("/getAllRoles");
    return response.data;
  } catch (error) {
    console.log("erreur de recuperer de tous les roles", error);
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await roleAPi.get(`/getRoleById/${id}`);
    return response.data;
  } catch (error) {
    console.log("erreur de recuperer d'un role", error);
  }
};

export const createRole = async (data) => {
  try {
    const response = await roleAPi.post("/createRole", data);
    return response.data;
  } catch (error) {
    console.log("erreur lors de la creation d'un role", error);
  }
};

export const updateRole = async (id, data) => {
  try {
    const response = await roleAPi.put(`/updateRole/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("erreur lors d la modification d'un role", error);
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await roleAPi.delete(`/deleteRole/${id}`);
    return response.data;
  } catch (error) {
    console.log("erreur lovc de la suppression d'un role", error);
  }
};
