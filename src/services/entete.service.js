import axios from "axios";
import { apiConfig } from "./api.config";

const enteteAPI = axios.create({
  baseURL: apiConfig.configuration,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getEnteteConfig = async () => {
  const response = await enteteAPI.get("");
  return response.data;
};

export const updateEnteteConfig = async (fields) => {
  const response = await enteteAPI.post("/create", fields);
  return response.data;
};

export const getEnteteImage = async () => {
  const response = await enteteAPI.get("/getImage", { responseType: "blob" });
  return response.data;
};

export const uploadEnteteImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await enteteAPI.post("/uploadImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
