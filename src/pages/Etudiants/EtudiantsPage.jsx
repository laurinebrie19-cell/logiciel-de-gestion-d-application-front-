import EtudiantList from "./EtudiantList";
import EtudiantForm from "./EtudiantForm";
import EtudiantDetails from "./EtudiantDetails";
import { Routes, Route } from "react-router-dom";

const EtudiantsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<EtudiantList />} />
      <Route path="/nouveau" element={<EtudiantForm />} />
      <Route path="/modifier/:id" element={<EtudiantForm />} />
      <Route path=":id" element={<EtudiantDetails />} />
    </Routes>
  );
};

export default EtudiantsPage;
