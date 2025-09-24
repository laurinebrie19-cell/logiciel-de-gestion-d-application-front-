import axios from "axios";
import { apiConfig } from "./api.config";

const empruntAPI = axios.create({
  baseURL: apiConfig.emprunt,
  headers: {
    "Content-Type": "application/json",
  },
});

const EmpruntService = {
  // Création d'un emprunt
  createEmprunt: async (createEmpruntDto) => {
    try {
      const response = await empruntAPI.post("", createEmpruntDto);
      return response.data;
    } catch (error) {
      console.error("Errreur lors de la demande d'emprunt ", error);
      throw error;
    }
  },

  // Mise à jour d'un emprunt
  updateEmprunt: async (id, updateEmpruntDto) => {
    try {
      const response = await empruntAPI.put(`/${id}`, updateEmpruntDto);
      return response.data;
    } catch (error) {
      console.error("Errreur lors de la mise à jour d'emprunt ", error);
      throw error;
    }
  },

  // Remboursement d'un emprunt
  repayEmprunt: async (id, membreId) => {
    try {
      await empruntAPI.put(`/${id}/remboursement/${membreId}`);
    } catch (error) {
      console.error("Errreur d'emprunt ", error);
      throw error;
    }
  },

  // Accepter un emprunt
  acceptEmprunt: async (id, userId, interestRate) => {
    try {
      await empruntAPI.put(
        `/${id}/accept/${userId}?interestRate=${parseFloat(interestRate)}`
      );
    } catch (error) {
      console.error("Errreur lors de la validation d'emprunt ", error);
      throw error;
    }
  },

  // Refuser un emprunt
  refuseEmprunt: async (id, refuserEmpruntDto) => {
    try {
      await empruntAPI.put(`/${id}/refuse`, refuserEmpruntDto);
    } catch (error) {
      console.error("Errreur lors du refus d'emprunt ", error);
      throw error;
    }
  },

  // Annuler un emprunt
  cancelEmprunt: async (id, membreId) => {
    try {
      await empruntAPI.put(`/${id}/cancel/${membreId}`);
    } catch (error) {
      console.error("Errreur lors de l'annulation d'emprunt ", error);
      throw error;
    }
  },

  // Récupérer un emprunt par ID
  getEmpruntById: async (id) => {
    try {
      const response = await empruntAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Errreur lors de la récupération d'emprunt ", error);
      throw error;
    }
  },

  // Récupérer les emprunts d'un membre
  getEmpruntsByMembre: async (membreId) => {
    try {
      const response = await empruntAPI.get(`/membre/${membreId}`);
      return response.data;
    } catch (error) {
      console.error("Errreur lors de la recuperation d'emprunt ", error);
      throw error;
    }
  },

  // Récupérer tous les emprunts
  getAllEmprunts: async () => {
    try {
      const response = await empruntAPI.get("");
      return response.data;
    } catch (error) {
      console.error(
        "Errreur lors de la récupération de tous les d'emprunt ",
        error
      );
      throw error;
    }
  },

  // Récupérer les emprunts par statut
  getEmpruntsByStatut: async (statut) => {
    try {
      const response = await empruntAPI.get(`/statut/${statut}`);
      return response.data;
    } catch (error) {
      console.error(
        "Errreur lors de la récupération  d'emprunt par statut",
        error
      );
      throw error;
    }
  },

  // Récupérer les emprunts non remboursés
  getEmpruntsNonRembourses: async () => {
    try {
      const response = await empruntAPI.get("/non-rembourses");
      return response.data;
    } catch (error) {
      console.error(
        "Errreur lors de la récupération d'emprunt remboursés ",
        error
      );
      throw error;
    }
  },
  // Récupérer le montant total des emprunts pour une session
  getMontantTotalEmpruntsBySession: async (sessionId) => {
    try {
      const response = await empruntAPI.get(
        `/session/${sessionId}/montant-total`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du montant total des emprunts",
        error
      );
      throw error;
    }
  },

  // Récupérer le montant total des emprunts actifs (hors attente) pour une session
  getMontantTotalEmpruntsHorsAttenteBySession: async (sessionId) => {
    try {
      const response = await empruntAPI.get(
        `/session/${sessionId}/montant-total-actifs`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du montant total des emprunts actifs",
        error
      );
      throw error;
    }
  },
  // Récupérer tous les emprunts d'une session
  getAllEmpruntsBySession: async (sessionId) => {
    try {
      const response = await empruntAPI.get(`/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emprunts par session",
        error
      );
      throw error;
    }
  },

  // Récupérer le montant total des emprunts remboursés ou validés
  getMontantTotalRembourseOuValide: async (sessionId) => {
    try {
      const response = await empruntAPI.get(
        `/total-rembourse-valide/${sessionId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du montant total remboursé/validé",
        error
      );
      throw error;
    }
  },

  // Récupérer les emprunts d'un membre dans une session donnée
  getEmpruntsByMembreAndSession: async (membreId, sessionId) => {
    try {
      const response = await empruntAPI.get(
        `/membre/${membreId}/session/${sessionId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emprunts par membre et session",
        error
      );
      throw error;
    }
  },
  // Récupérer les emprunts avec filtrage par rôle
  getEmpruntsByMembreAndSessionWithRole: async (membreId, sessionId, role) => {
    try {
      const response = await empruntAPI.get(
        `/bySession?membreId=${membreId}&sessionId=${sessionId}&role=${role}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emprunts filtrés par rôle",
        error
      );
      throw error;
    }
  },
  getMontantTotalEmpruntsHorsAttenteByMembreAndSession: async (
    membreId,
    sessionId
  ) => {
    try {
      const response = await empruntAPI.get(
        `/membre/${membreId}/session/${sessionId}/total-actif`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du montant total des emprunts actifs d'un membre",
        error
      );
      return 0; // Retourne 0 en cas d'erreur au lieu de propager l'exception
    }
  },
};

export default EmpruntService;
