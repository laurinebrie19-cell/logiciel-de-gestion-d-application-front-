import axios from "axios";
import { apiConfig } from "./api.config";

const notificationAPI = axios.create({
  baseURL: apiConfig.notificationPreference || "/api/notifications/preferences",
  headers: {
    "Content-Type": "application/json",
  },
});

// Récupérer les préférences de notification d'un utilisateur
export const getNotificationPreference = async (userId) => {
  try {
    const response = await notificationAPI.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des préférences de notification:",
      error
    );
    throw error;
  }
};

// Mettre à jour les préférences de notification d'un utilisateur
export const updateNotificationPreference = async (
  userId,
  receiveEmailNotifications
) => {
  try {
    const response = await notificationAPI.put(
      `/${userId}?receiveEmailNotifications=${receiveEmailNotifications}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des préférences de notification:",
      error
    );
    throw error;
  }
};
