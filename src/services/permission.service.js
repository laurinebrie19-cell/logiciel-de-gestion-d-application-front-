import axios from "axios";
import {apiConfig} from "./api.config.js";

const permissionAPI = axios.create({
    baseURL: apiConfig.permission,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAllPermissions = async () => {
    try {
        const response = await permissionAPI.get("/getAllPermissions");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des permissions:", error);
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des permissions");
    }
}