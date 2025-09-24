import axios from "axios";
import { apiConfig } from "./api.config";

const remboursementAPI = axios.create({
  baseURL: apiConfig.rembourssement,
  headers: {
    "Content-Type": "application/json",
  },
});

// Effectuer un remboursement
export const effectuerRemboursement = async (remboursementData) => {
  try {
    const response = await remboursementAPI.post(
      "/effectuer",
      remboursementData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l’envoi du remboursement", error);
    throw error;
  }
};

//Obtenir la liste des membres endettés
export const getMembresEndettes = async () => {
  try {
    const response = await remboursementAPI.get("/membres-endettes");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des membres endettés", error);
    throw error;
  }
};
// Obtenir tous les remboursements
export const getAllRemboursements = async () => {
  try {
    const response = await remboursementAPI.get("/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des remboursements", error);
    throw error;
  }
};

// Obtenir un remboursement par ID
export const getRemboursementById = async (id) => {
  try {
    const response = await remboursementAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du remboursement avec l’ID ${id}`,
      error
    );
    throw error;
  }
};
// Obtenir les détails d’un remboursement par ID
export const getDetailsRemboursement = async (id) => {
  try {
    const response = await remboursementAPI.get(`/details/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des détails du remboursement avec l’ID ${id}`,
      error
    );
    throw error;
  }
};

// Obtenir l’historique des remboursements d’un utilisateur
export const getHistoriqueRemboursements = async (username) => {
  try {
    const response = await remboursementAPI.get(`/historique/${username}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l’historique pour ${username}`,
      error
    );
    throw error;
  }
};

// Obtenir les remboursements en attente
export const getRemboursementsEnAttente = async () => {
  try {
    const response = await remboursementAPI.get("/statut/EN_ATTENTE");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements en attente",
      error
    );
    throw error;
  }
};

// Obtenir les remboursements en cours
export const getRemboursementsEnCours = async () => {
  try {
    const response = await remboursementAPI.get("/statut/EN_COURS");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements en cours",
      error
    );
    throw error;
  }
};

// Obtenir les remboursements validés
export const getRemboursementsAttentes = async () => {
  try {
    const response = await remboursementAPI.get("/statut/EN_ATTENTE");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements en attente",
      error
    );
    throw error;
  }
};

// Obtenir les remboursements terminés
export const getRemboursementsValides = async () => {
  try {
    const response = await remboursementAPI.get("/statut/EN_VALIDE");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements validés",
      error
    );
    throw error;
  }
};

//Obtenir les remboursements terminés
export const getRemboursementsTermines = async () => {
  try {
    const response = await remboursementAPI.get("/statut/ TERMINE");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements terminés",
      error
    );
    throw error;
  }
};

// Valider tous les remboursements en attente pour un trésorier donné
export const validerRemboursementsEnAttente = async (idtresorier) => {
  try {
    const response = await remboursementAPI.put(
      `/valider-en-attente/${idtresorier}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la validation des remboursements en attente",
      error
    );
    throw error;
  }
};

//Obtenir le montant total des remboursements pour une session
export const getMontantTotalRemboursementsBySession = async (sessionId) => {
  try {
    const response = await remboursementAPI.get(
      `/montant_total/session/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du montant total", error);
    return 0; // Valeur par défaut
  }
};

// Obtenir les remboursements d'un membre pour une session spécifique
export const getRemboursementsByMembreAndSession = async (
  membreId,
  sessionId
) => {
  try {
    const response = await remboursementAPI.get(
      `/membre/${membreId}/session/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des remboursements par membre et session",
      error
    );
    return [];
  }
};

// Obtenir le montant total remboursé par un membre dans une session
export const getMontantTotalRemboursementsParMembreEtSession = async (
  sessionId,
  membreId
) => {
  try {
    const response = await remboursementAPI.get(
      `/total/${sessionId}/${membreId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du total par membre", error);
    return 0;
  }
};

// Rejeter un remboursement
export const rejeterRemboursement = async (idTresorier, decisionDto) => {
  try {
    const response = await remboursementAPI.patch(
      `/traiter/${idTresorier}`,
      decisionDto
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors du rejet du remboursement", error);
    throw error;
  }
};
