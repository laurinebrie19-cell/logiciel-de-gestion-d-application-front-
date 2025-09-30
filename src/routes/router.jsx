import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayouts";
import Dashboard from "../pages/Dashboard/DahboardPage/Dashboard";
import EmploiDuTemps from "../pages/EmploiDuTemps/EmploiDuTemps";
import UserList from "../pages/TestUser/UserList";
import AjoutNote from "../pages/Notes/AjoutNote";
import NotesEtudiant from "../pages/Notes/NotesEtudiant";
import NotesParNiveau from "../pages/Notes/NotesParNiveau";
import UserForm from "../pages/TestUser/UserForm";
import UserDetails from "../pages/TestUser/UserDetails";
import EtudiantsPage from "../pages/Etudiants/EtudiantsPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { BlogPage } from "../pages/Blog/BlogPage";
import { BlogPostDetail } from "../pages/Blog/BlogPostDetail";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import UnauthorizedPage from "../pages/Unautorized/Unauthorized";
import NotFound from "../pages/NotFound/NotFoundPage";
import RoleList from "../pages/Parametrage/Roles/RoleList.jsx";
import RoleForm from "../pages/Parametrage/Roles/RoleForm.jsx";
import Notification from "../pages/Parametrage/Notification/SettingsPage.jsx";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import FonctionBureauList  from "../pages/Parametrage/FonctionBureau/FonctionBureauList";
import FonctionBureauForm from "../pages/Parametrage/FonctionBureau/FonctionBureauForm";
import ParametrageAcademique from "../pages/Parametrage/Academique/ParametrageAcademique.jsx";
import AnnonceManager from "../pages/Dashboard/Annonce/AnnonceManager";
import MesNiveaux from "../pages/Enseignant/MesNiveaux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:id",
    element: <BlogPostDetail />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",

    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/layout",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
  },

  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),

    children: [
      
      {
        path: "dashboard",
        element: (
          <PrivateRoute permission="USER_READ">
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "etudiants/*",
        element: (
          <PrivateRoute permission="ETUDIANT_READ">
            <EtudiantsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateRoute permission="USER_READ">
            <UserList />
          </PrivateRoute>
        ),
      },
      {
        path: "users/create",
        element: (
          <PrivateRoute permission="USER_CREATE">
            <UserForm />
          </PrivateRoute>
        ),
      },
      {
        path: "users/edit/:id",
        element: (
          <PrivateRoute permission="USER_UPDATE">
            <UserForm />
          </PrivateRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <PrivateRoute permission="USER_READ">
            <UserDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles",
        element: (
          <PrivateRoute permission="ROLE_READ">
            <RoleList />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/annonces",
        element: (
          <PrivateRoute permission="ANNONCE_READ">
            <AnnonceManager />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/academique",
        element: (
          <PrivateRoute permission="FILIERE_READ">
            <ParametrageAcademique />
          </PrivateRoute>
        ),
      },
      {
        path: "emploi-du-temps",
        element: (
          <PrivateRoute permission="EMPLOI_READ">
            <EmploiDuTemps />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles/create",
        element: (
          <PrivateRoute permission="ROLE_CREATE">
            <RoleForm />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles/edit/:id",
        element: (
          <PrivateRoute permission="ROLE_UPDATE">
            <RoleForm />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute permission="NOTIFICATION_READ">
            <Notification />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/fonctions-bureau",
        element: (
          <PrivateRoute permission="FONCTION_BUREAU_READ">
            <FonctionBureauList />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/fonctions-bureau/create",
        element: (
          <PrivateRoute permission="FONCTION_BUREAU_CREATE">
            <FonctionBureauForm />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/fonctions-bureau/edit", 
        element: (
          <PrivateRoute permission="FONCTION_BUREAU_UPDATE">
            <FonctionBureauForm />
          </PrivateRoute>
        ),
      },
      {
        path: "mes-niveaux",
        element: (
          <PrivateRoute permission="MATIERE_READ">
            <MesNiveaux />
          </PrivateRoute>
        ),
      },
      {
        path: "notes/ajouter",
        element: (
          <PrivateRoute permission="NOTE_CREATE">
            <AjoutNote />
          </PrivateRoute>
        ),
      },
      {
        path: "notes/mes-notes",
        element: (
          <PrivateRoute permission="NOTE_READ">
            <NotesEtudiant />
          </PrivateRoute>
        ),
      },
      {
        path: "notes/niveau",
        element: (
          <PrivateRoute permission="NOTE_READ_ALL">
            <NotesParNiveau />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
