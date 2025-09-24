import axios from "axios";
import { apiConfig } from "./api.config";

const authAPI = axios.create({
  baseURL: apiConfig.auth,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthService = {
  login: async (loginData) => {
    try {
      const response = await authAPI.post(
        "/login",
        JSON.stringify({
          ...loginData,
          email: loginData.email.toLowerCase(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User logged in:", user);
        return user;
      } else {
        console.error("Login failed:", response.status, response.data);
        throw { status: response.status, data: response.data };
      }
    } catch (error) {
      console.error("Erreur lors de la récupération d'une cotisation", error);
      throw error;
    }
  },
};

export default AuthService;
