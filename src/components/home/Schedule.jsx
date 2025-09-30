import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, User, MapPin, Filter, Loader } from 'lucide-react';
import { getEmploisDuTempsByFiliereAndNiveau } from "../../services/emploiDuTemps.service";
import { filiereService } from "../../services/filiere.service";
import { niveauService } from "../../services/niveau.service";

const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const ScheduleCard = ({ day, courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          {day}
        </h3>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Aucun cours prévu</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {day}
      </h3>
      <div className="space-y-4 overflow-y-auto">
        {courses.map((course, index) => (
          <div key={index} className="flex flex-col gap-2 p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-indigo-600">{course.time}</span>
              <span className="inline-flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" /> {course.room}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Book className="w-4 h-4 mr-2 text-gray-500" /> {course.name}
              </h4>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <User className="w-4 h-4 mr-2 text-gray-500" /> {course.professor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Schedule = () => {
  const [emplois, setEmplois] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [filieresData, niveauxData] = await Promise.all([
          filiereService.getFilieres(),
          niveauService.getNiveaux()
        ]);
        setFilieres(filieresData);
        setNiveaux(niveauxData);
        if (filieresData.length > 0 && niveauxData.length > 0) {
          setSelectedFiliere(filieresData[0].id.toString());
          setSelectedNiveau(niveauxData[0].id.toString());
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des filtres:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedFiliere && selectedNiveau) {
      const fetchEmplois = async () => {
        setLoading(true);
        try {
          const data = await getEmploisDuTempsByFiliereAndNiveau(selectedFiliere, selectedNiveau);
          setEmplois(data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'emploi du temps:", error);
          setEmplois([]);
        } finally {
          setLoading(false);
        }
      };
      fetchEmplois();
    }
  }, [selectedFiliere, selectedNiveau]);

  const schedulesByDay = useMemo(() => {
    const grouped = {};
    
    if (emplois.length > 0) {
      // On prend le premier emploi du temps trouvé
      const seances = emplois[0].seances || [];
      seances.forEach(seance => {
        if (!grouped[seance.jour]) {
          grouped[seance.jour] = [];
        }
        grouped[seance.jour].push({
          time: `${seance.heureDebut} - ${seance.heureFin}`,
          name: seance.matiereNom,
          room: seance.salleNom,
          professor: seance.enseignantNom,
        });
      });
    }

    // Trier les cours par heure de début
    for (const day in grouped) {
      grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    }

    return JOURS_SEMAINE.map(day => ({
      day,
      courses: grouped[day] || []
    }));
  }, [emplois]);

  return (
    <section id="schedule" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3"
          >
            <Calendar className="w-10 h-10 text-indigo-600" />
            Emploi du temps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Consultez l'emploi du temps de la semaine et organisez vos activités.
          </motion.p>
        </div>

        {/* Filtres */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto"
        >
          <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <Filter className="w-6 h-6 mr-2 text-indigo-600" />
            <h3>Filtrer l'emploi du temps</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={!filieres.length}
            >
              {filieres.length ? (
                filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)
              ) : (
                <option>Chargement...</option>
              )}
            </select>
            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={!niveaux.length}
            >
              {niveaux.length ? (
                niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)
              ) : (
                <option>Chargement...</option>
              )}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {schedulesByDay.map((schedule, index) => (
              <ScheduleCard key={index} day={schedule.day} courses={schedule.courses} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Schedule;
