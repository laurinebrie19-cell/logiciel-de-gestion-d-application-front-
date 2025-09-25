import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Auth/Login.jsx";
import MainLayout from "../layouts/MainLayouts";
import Dashboard from "../pages/Dashboard/DahboardPage/Dashboard";
import EmploiDuTemps from "../pages/EmploiDuTemps/EmploiDuTemps";
import UserList from "../pages/TestUser/UserList";
import UserForm from "../pages/TestUser/UserForm";
import UserDetails from "../pages/TestUser/UserDetails";
import EtudiantsPage from "../pages/Etudiants/EtudiantsPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { BlogPage } from "../pages/Blog/BlogPage";
import { BlogPostDetail } from "../pages/Blog/BlogPostDetail";

import Settings from "../pages/Parametrage/Emprunt/LoanSettings";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import UnauthorizedPage from "../pages/Unautorized/Unauthorized";
import NotFound from "../pages/NotFound/NotFoundPage";
import RoleList from "../pages/Parametrage/Roles/RoleList.jsx";
import RoleForm from "../pages/Parametrage/Roles/RoleForm.jsx";
import Notification from "../pages/Parametrage/Notification/SettingsPage.jsx";
import ReportHeaderConfig from "../pages/Parametrage/Configuration/ReportHeaderConfig";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import FonctionBureauList  from "../pages/Parametrage/FonctionBureau/FonctionBureauList";
import FonctionBureauForm from "../pages/Parametrage/FonctionBureau/FonctionBureauForm";
import ParametrageAcademique from "../pages/Parametrage/Academique/ParametrageAcademique.jsx";
import AnnonceManager from "../pages/Dashboard/Annonce/AnnonceManager";

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
          <PrivateRoute permission="USER_READ">
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
        path: "admin/settings",
        element: (
          <PrivateRoute permission="SESSION_MANAGE_BALANCE">
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles",
        element: (
          <PrivateRoute permission="USER_MANAGE_ROLES">
            <RoleList />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/annonces",
        element: (
          <PrivateRoute permission="USER_MANAGE_ROLES">
            <AnnonceManager />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/academique",
        element: (
          <PrivateRoute permission="USER_MANAGE_ROLES">
            <ParametrageAcademique />
          </PrivateRoute>
        ),
      },
      {
        path: "emploi-du-temps",
        element: (
          <PrivateRoute permission="USER_READ">
            <EmploiDuTemps />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles/create",
        element: (
          <PrivateRoute permission="USER_MANAGE_ROLES">
            <RoleForm />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/roles/edit/:id",
        element: (
          <PrivateRoute permission="USER_MANAGE_ROLES">
            <RoleForm />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute permission="USER_READ">
            <Notification />
          </PrivateRoute>
        ),
      },
    
      {
        path: "admin/report-header",
        element: (
          <PrivateRoute permission="UPDATE_MODELE_EN_TETE">
            <ReportHeaderConfig />
          </PrivateRoute>
        ),
      },
            {
        path: "admin/fonctions-bureau",
        element: (
          <PrivateRoute permission="BUREAU_MANAGE">
            <FonctionBureauList />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/fonctions-bureau/create",
        element: (
          <PrivateRoute permission="BUREAU_MANAGE">
            <FonctionBureauForm />
          </PrivateRoute>
        ),
      },
      {
  path: "admin/fonctions-bureau/edit", 
  element: (
    <PrivateRoute permission="BUREAU_MANAGE">
      <FonctionBureauForm />
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
