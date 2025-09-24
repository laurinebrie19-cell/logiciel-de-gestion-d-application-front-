import "./App.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/router";
import { AuthProvider } from "./contexts/AutContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={Router} />
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
