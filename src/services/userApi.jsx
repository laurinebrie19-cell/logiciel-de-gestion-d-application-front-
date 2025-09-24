import { mockUsers } from "./mockUser";

export const userApi = {
  getUsers: async () => {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockUsers;
  },

  getUserById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },

  createUser: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser = {
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString().split("T")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}`,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id, userData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    const updatedUser = { ...mockUsers[index], ...userData };
    mockUsers[index] = updatedUser;
    return updatedUser;
  },

  deleteUser: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    mockUsers.splice(index, 1);
    return { success: true };
  },
};

/* import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const userApi = {
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  }
}; */
