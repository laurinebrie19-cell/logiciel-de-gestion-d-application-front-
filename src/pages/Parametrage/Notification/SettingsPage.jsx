import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { Mail, Loader2, Bell } from "lucide-react";
import {
  getNotificationPreference,
  updateNotificationPreference,
} from "../../../services/notificationPreference.service";
import { useAuth } from "../../../contexts/AutContext";
import { showSuccessToast, showErrorToast } from "../../../components/Toasts";
import PropTypes from "prop-types";

const SettingsPage = () => {
  const { user } = useAuth();
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getNotificationPreference(user.id)
      .then((data) => {
        setReceiveEmailNotifications(
          typeof data.receiveEmailNotifications === "boolean"
            ? data.receiveEmailNotifications
            : true
        );
      })
      .catch(() => showErrorToast("Erreur lors du chargement des préférences."))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotificationPreference(user.id, receiveEmailNotifications);
      showSuccessToast("Préférence enregistrée !");
    } catch {
      showErrorToast("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-t-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-indigo-300" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-100">
            Paramètres de notification
          </span>
        </h1>
        <p className="text-indigo-200 text-lg">
          Personnalisez vos préférences de notification pour rester informé
        </p>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8 border-t border-indigo-100">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="relative">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
              <div className="absolute -inset-1 rounded-full bg-indigo-100 animate-pulse -z-10" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <SettingSwitch
              label="Recevoir les notifications par email"
              description="Soyez alerté par email pour chaque cotisation ou emprunt."
              checked={receiveEmailNotifications}
              onChange={() => setReceiveEmailNotifications((v) => !v)}
              icon={<Mail className="w-5 h-5 text-indigo-500" />}
            />

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 
                text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl 
                transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
              >
                {saving && (
                  <Loader2 className="animate-spin w-5 h-5" />
                )}
                Enregistrer ma préférence
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

function SettingSwitch({ label, description, checked, onChange, icon }) {
  return (
    <div className="flex items-start gap-4 bg-gradient-to-br from-gray-50 to-white 
    rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="mt-1 p-2 bg-indigo-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{label}</span>
        </div>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? "bg-gradient-to-r from-indigo-600 to-blue-600" : "bg-gray-300"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
      >
        <span
          className={`${
            checked ? "translate-x-6" : "translate-x-1"
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md`}
        />
      </Switch>
    </div>
  );
}

export default SettingsPage;

SettingSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
};
