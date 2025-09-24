import { useEffect, useState, useRef } from "react";
import { Loader2, ImagePlus, Edit2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../../components/Toasts";
import {
  getEnteteConfig,
  updateEnteteConfig,
  getEnteteImage,
  uploadEnteteImage,
} from "../../../services/entete.service";

const initialFields = {
  Ville: "",
  nomEntreprise: "",
  BPEntreprise: "",
  Tel: "",
};

export default function ReportHeaderConfig() {
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  // Charger les configurations et l'image
  useEffect(() => {
    setLoading(true);
    getEnteteConfig()
      .then((data) => setFields(data))
      .catch(() => showErrorToast("Erreur lors du chargement des paramètres"))
      .finally(() => setLoading(false));

    fetchImage();
  }, []);

  const fetchImage = () => {
    setImgLoading(true);
    getEnteteImage()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      })
      .catch(() => setImageUrl(null))
      .finally(() => setImgLoading(false));
  };

  // Gestion du drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const allowedTypes=['image/jpeg', 'image/png']
    const file = e.dataTransfer.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
    else showErrorToast("Format non autorisé. Utilisez PNG ou JPG uniquement.")
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {

      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
    else showErrorToast("Format non autorisé. Utilisez PNG ou JPG uniquement.")
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setImgLoading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      await uploadEnteteImage(imageFile);
      showSuccessToast("Logo mis à jour !");
      setImageFile(null);
      setPreview(null);
      fetchImage();
    } catch {
      showErrorToast("Erreur lors de l'envoi du logo");
    } finally {
      setImgLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEnteteConfig(fields);
      showSuccessToast("Paramètres enregistrés !");
    } catch {
      showErrorToast("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-t-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ImagePlus className="w-7 h-7 text-indigo-200" />
          <span>En-tête des rapports de cotisation</span>
        </h1>
        <p className="text-indigo-200 mt-1">
          Personnalisez l’en-tête et le logo qui apparaîtront sur vos rapports.
        </p>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl p-8 border-t border-indigo-100">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Drag & Drop Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo de l’association
              </label>
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition
                  ${
                    preview || imageUrl
                      ? "border-indigo-400"
                      : "border-gray-300 hover:border-indigo-400"
                  }
                `}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
                style={{ minHeight: 120 }}
              >
                {imgLoading ? (
                  <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
                ) : preview ? (
                  <img
                    src={preview}
                    alt="Aperçu"
                    className="max-h-24 object-contain mb-2"
                  />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Logo actuel"
                    className="max-h-24 object-contain mb-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImagePlus className="w-10 h-10 mb-2" />
                    <span>Glissez-déposez une image ici ou cliquez</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-indigo-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                  title="Modifier le logo"
                >
                  <Edit2 className="w-4 h-4 text-indigo-500" />
                </button>
              </div>
              {preview && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-indigo-700"
                    onClick={handleImageUpload}
                    disabled={imgLoading}
                  >
                    {imgLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Enregistrer le logo"
                    )}
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:underline text-sm"
                    onClick={() => {
                      setImageFile(null);
                      setPreview(null);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>

            {/* Champs de configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  name="Ville"
                  value={fields.Ville}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-gray-400"
                  placeholder="Ex: Yaoundé"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l’entreprise/association
                </label>
                <input
                  name="nomEntreprise"
                  value={fields.nomEntreprise}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 focus:outline-none"
                  placeholder="Ex: MUASMO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BP Entreprise
                </label>
                <input
                  name="BPEntreprise"
                  value={fields.BPEntreprise}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  placeholder="Ex: 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  name="Tel"
                  value={fields.Tel}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  placeholder="Ex: +237 693636363"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 
                text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl 
                transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
              >
                {saving && <Loader2 className="animate-spin w-5 h-5" />}
                Enregistrer les paramètres
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
