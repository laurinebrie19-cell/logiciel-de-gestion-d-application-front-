import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { createEmploiDuTemps, updateEmploiDuTemps } from '../../services/emploiDuTemps.service';
import { showToast } from '../../components/common/Toasts';
import { matiereService } from '../../services/matiere.service';
import { getAllUsers } from '../../services/user.service';
import { getAllSalles } from '../../services/salle.service';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const EmploiDuTempsForm = ({ emploiDuTemps, niveaux, filieres, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [matieres, setMatieres] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [salles, setSalles] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        dateDebut: '',
        dateFin: '',
        filiereId: '',
        niveauId: '',
        seances: []
    });

    useEffect(() => {
        if (emploiDuTemps) {
            // S'assurer que chaque séance a son ID
            const seancesWithIds = emploiDuTemps.seances.map(seance => ({
                ...seance,
                id: seance.id || null // Conserver l'ID existant ou null pour les nouvelles séances
            }));

            setFormData({
                ...emploiDuTemps,
                dateDebut: emploiDuTemps.dateDebut.split('T')[0],
                dateFin: emploiDuTemps.dateFin.split('T')[0],
                seances: seancesWithIds
            });
        }
        loadDependencies();
    }, [emploiDuTemps]);

    const loadDependencies = async () => {
        try {
            const [matieresData, usersData, sallesData] = await Promise.all([
                matiereService.getAllMatieres(),
                getAllUsers(),
                getAllSalles()
            ]);

            // Filtrer pour ne garder que les enseignants
            const enseignantsData = usersData.filter(user =>
                user.roles && user.roles.includes("Enseignant")
            );

            setMatieres(matieresData);
            setEnseignants(enseignantsData);
            setSalles(sallesData);
        } catch (error) {
            showToast('error', 'Erreur lors du chargement des données');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (emploiDuTemps) {
                // Pour la mise à jour, on garde les IDs
                await updateEmploiDuTemps(emploiDuTemps.id, formData);
                showToast('success', 'Emploi du temps mis à jour avec succès');
            } else {
                // Pour la création, on retire les IDs des séances
                const dataForCreation = {
                    ...formData,
                    seances: formData.seances.map(seance => ({
                        jour: seance.jour,
                        heureDebut: seance.heureDebut,
                        heureFin: seance.heureFin,
                        matiereId: seance.matiereId,
                        enseignantId: seance.enseignantId,
                        salleId: seance.salleId
                    }))
                };
                await createEmploiDuTemps(dataForCreation);
                showToast('success', 'Emploi du temps créé avec succès');
            }
            onSuccess();
        } catch (error) {
            showToast('error', error.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const addSeance = () => {
        setFormData({
            ...formData,
            seances: [
                ...formData.seances,
                {
                    jour: 'Lundi',
                    heureDebut: '08:00',
                    heureFin: '10:00',
                    matiereId: '',
                    enseignantId: '',
                    salleId: ''
                }
            ]
        });
    };

    const updateSeance = (index, field, value) => {
        const newSeances = [...formData.seances];
        newSeances[index] = {
            ...newSeances[index],
            [field]: value,
            id: newSeances[index].id // Préserver l'ID existant
        };
        setFormData({ ...formData, seances: newSeances });
    };

    const removeSeance = (index) => {
        setFormData({
            ...formData,
            seances: formData.seances.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {emploiDuTemps ? 'Modifier' : 'Créer'} un emploi du temps
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Titre</label>
                            <input
                                type="text"
                                value={formData.titre}
                                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Filière</label>
                            <select
                                value={formData.filiereId}
                                onChange={(e) => setFormData({ ...formData, filiereId: e.target.value, niveauId: '' })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Sélectionner une filière</option>
                                {filieres.map((filiere) => (
                                    <option key={filiere.id} value={filiere.id}>
                                        {filiere.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Niveau</label>
                            <select
                                value={formData.niveauId}
                                onChange={(e) => setFormData({ ...formData, niveauId: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                disabled={!formData.filiereId}
                            >
                                <option value="">Sélectionner un niveau</option>
                                {niveaux.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>
                                        {niveau.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de début</label>
                            <input
                                type="date"
                                value={formData.dateDebut}
                                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                            <input
                                type="date"
                                value={formData.dateFin}
                                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Séances */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-gray-900">Séances</h4>
                            <button
                                type="button"
                                onClick={addSeance}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter une séance
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.seances.map((seance, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg relative"
                                >
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Jour</label>
                                        <select
                                            value={seance.jour}
                                            onChange={(e) => updateSeance(index, 'jour', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            {JOURS.map((jour) => (
                                                <option key={jour} value={jour}>
                                                    {jour}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Début</label>
                                        <input
                                            type="time"
                                            value={seance.heureDebut}
                                            onChange={(e) => updateSeance(index, 'heureDebut', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Fin</label>
                                        <input
                                            type="time"
                                            value={seance.heureFin}
                                            onChange={(e) => updateSeance(index, 'heureFin', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Matière</label>
                                        <select
                                            value={seance.matiereId}
                                            onChange={(e) => updateSeance(index, 'matiereId', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Sélectionner</option>
                                            {matieres.map((matiere) => (
                                                <option key={matiere.id} value={matiere.id}>
                                                    {matiere.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Enseignant</label>
                                        <select
                                            value={seance.enseignantId}
                                            onChange={(e) => updateSeance(index, 'enseignantId', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Sélectionner</option>
                                            {enseignants.map((enseignant) => (
                                                <option key={enseignant.id} value={enseignant.id}>
                                                    {enseignant.firstName} {enseignant.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Salle</label>
                                        <select
                                            value={seance.salleId}
                                            onChange={(e) => updateSeance(index, 'salleId', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Sélectionner</option>
                                            {salles.map((salle) => (
                                                <option key={salle.id} value={salle.id}>
                                                    {salle.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSeance(index)}
                                        className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EmploiDuTempsForm.propTypes = {
    emploiDuTemps: PropTypes.object,
    niveaux: PropTypes.array.isRequired,
    filieres: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default EmploiDuTempsForm;
