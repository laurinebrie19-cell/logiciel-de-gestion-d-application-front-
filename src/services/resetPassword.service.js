import axios from "axios";
import { apiConfig } from "./api.config";

const userAPi = axios.create({
  baseURL: apiConfig.user,
  headers: {
    "Content-Type": "application/json",
  },
});

// Envoi du mail de réinitialisation
export const forgotPassword = async (email) => {
  try {
    const response = await userAPi.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.log("Erreur lors de l'envoi du mail de réinitialisation", error);
    throw error;
  }
};

// Confirmation de la réinitialisation
export const confirmResetPassword = async ({
  email,
  verificationCode,
  newPassword,
}) => {
  try {
    const params = new URLSearchParams({
      email,
      verificationCode,
      newPassword,
    });
    const response = await userAPi.post(
      `/confirm-reset-password?${params.toString()}`
    );
    console.log("param ", params);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la confirmation de réinitialisation", error);
    throw error;
  }
};

// Changement de mot de passe forcé
export const resetPassword = async ({ email, oldPassword, newPassword }) => {
  try {
    const response = await userAPi.post("/reset-password", {
      email,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.log("Erreur lors du changement de mot de passe", error);
    throw error;
  }
};
