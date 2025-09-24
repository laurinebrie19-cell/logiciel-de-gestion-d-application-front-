import { motion } from "framer-motion";

const schedules = [
  {
    day: "Lundi",
    courses: [
      { time: "08:00 - 10:00", name: "Mathématiques", room: "Salle 101", professor: "Dr. Martin" },
      { time: "10:15 - 12:15", name: "Physique", room: "Lab 201", professor: "Dr. Chen" },
      { time: "14:00 - 16:00", name: "Informatique", room: "Salle Info 301", professor: "Dr. Garcia" },
    ],
  },
  {
    day: "Mardi",
    courses: [
      { time: "09:00 - 11:00", name: "Chimie", room: "Lab 202", professor: "Dr. Brown" },
      { time: "13:00 - 15:00", name: "Anglais", room: "Salle 102", professor: "Mrs. Smith" },
    ],
  },
  {
    day: "Mercredi",
    courses: [
      { time: "08:00 - 10:00", name: "Programmation", room: "Salle Info 302", professor: "Dr. Lee" },
      { time: "10:15 - 12:15", name: "Algorithmes", room: "Salle Info 303", professor: "Dr. Wang" },
    ],
  },
  {
    day: "Jeudi",
    courses: [
      { time: "09:00 - 11:00", name: "Base de données", room: "Salle Info 304", professor: "Dr. Kim" },
      { time: "14:00 - 16:00", name: "Réseaux", room: "Lab 203", professor: "Dr. Johnson" },
    ],
  },
  {
    day: "Vendredi",
    courses: [
      { time: "08:00 - 10:00", name: "Projet", room: "Salle 103", professor: "Dr. Wilson" },
      { time: "10:15 - 12:15", name: "Soutenance", room: "Amphithéâtre", professor: "Dr. Davis" },
    ],
  },
];

const ScheduleCard = ({ schedule }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
        {schedule.day}
      </h3>
      <div className="space-y-4">
        {schedule.courses.map((course, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-600">{course.time}</span>
              <span className="text-sm text-gray-500">{course.room}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{course.name}</h4>
              <p className="text-sm text-gray-500">{course.professor}</p>
            </div>
            {index < schedule.courses.length - 1 && (
              <div className="border-b border-gray-100 pt-2" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Schedule = () => {
  return (
    <section id="schedule" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Emploi du temps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Consultez l'emploi du temps de la semaine et organisez vos activités
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {schedules.map((schedule, index) => (
            <ScheduleCard key={index} schedule={schedule} />
          ))}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ajouter un cours</h3>
            <p className="text-indigo-100">
              Connectez-vous pour gérer votre emploi du temps personnel
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Schedule;
