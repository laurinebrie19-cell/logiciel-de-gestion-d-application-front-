import PropTypes from 'prop-types';
import { useState } from 'react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 19h

const EmploiDuTempsCalendar = ({ emplois }) => {
  const [selectedEmploi, setSelectedEmploi] = useState(emplois[0]);

  if (!emplois.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun emploi du temps disponible</p>
      </div>
    );
  }

  const getSeanceForHour = (jour, heure) => {
    return selectedEmploi?.seances?.find(
      (seance) =>
        seance.jour === jour &&
        parseInt(seance.heureDebut.split(':')[0]) <= heure &&
        parseInt(seance.heureFin.split(':')[0]) > heure
    );
  };

  const getSeanceHeight = (seance) => {
    const debut = parseInt(seance.heureDebut.split(':')[0]);
    const fin = parseInt(seance.heureFin.split(':')[0]);
    return (fin - debut) * 100; // 100px par heure
  };

  return (
    <div className="space-y-4">
      {/* Sélecteur d'emploi du temps */}
      {emplois.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedEmploi?.id}
            onChange={(e) => setSelectedEmploi(emplois.find(em => em.id.toString() === e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {emplois.map((emploi) => (
              <option key={emploi.id} value={emploi.id}>
                {emploi.titre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grille de l'emploi du temps */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* En-tête des jours */}
            <div className="bg-gray-100 p-4 text-center font-medium text-gray-500"></div>
            {JOURS.map((jour) => (
              <div key={jour} className="bg-gray-100 p-4 text-center font-medium text-gray-900">
                {jour}
              </div>
            ))}

            {/* Grille horaire */}
            {HEURES.map((heure) => (
              <>
                {/* Colonne des heures */}
                <div key={heure} className="bg-white p-2 text-right text-sm text-gray-500 border-t">
                  {`${heure}:00`}
                </div>

                {/* Cellules des cours */}
                {JOURS.map((jour) => {
                  const seance = getSeanceForHour(jour, heure);
                  return (
                    <div
                      key={`${jour}-${heure}`}
                      className="bg-white border-t relative min-h-[100px]"
                    >
                      {seance && parseInt(seance.heureDebut.split(':')[0]) === heure && (
                        <div
                          className="absolute inset-x-1 bg-indigo-100 border border-indigo-200 rounded-lg p-2 overflow-hidden"
                          style={{
                            height: `${getSeanceHeight(seance)}px`,
                            minHeight: '100px'
                          }}
                        >
                          <div className="text-sm font-medium text-indigo-900">
                            {seance.matiereNom}
                          </div>
                          <div className="text-xs text-indigo-700">
                            {seance.enseignantNom}
                          </div>
                          <div className="text-xs text-indigo-600">
                            {seance.salleNom}
                          </div>
                          <div className="text-xs text-indigo-500">
                            {seance.heureDebut} - {seance.heureFin}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

EmploiDuTempsCalendar.propTypes = {
  emplois: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    titre: PropTypes.string.isRequired,
    seances: PropTypes.arrayOf(PropTypes.shape({
      jour: PropTypes.string.isRequired,
      heureDebut: PropTypes.string.isRequired,
      heureFin: PropTypes.string.isRequired,
      matiereNom: PropTypes.string.isRequired,
      enseignantNom: PropTypes.string.isRequired,
      salleNom: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
};

export default EmploiDuTempsCalendar;
