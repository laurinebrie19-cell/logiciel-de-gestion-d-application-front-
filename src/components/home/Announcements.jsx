import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const announcements = [
  {
    id: 1,
    title: "Ouverture des inscriptions pour la rentrée 2026",
    date: "20 septembre 2025",
    type: "event",
    content: "Les inscriptions pour l&apos;année académique 2026 sont maintenant ouvertes. Profitez de nos formations en développement web, intelligence artificielle et cybersécurité.",
    time: "09:00",
    location: "En ligne",
    image: "/src/assets/images/inscription.jpg",
    category: "Admissions"
  },
  {
    id: 2,
    title: "Nouveau partenariat avec Microsoft",
    date: "22 septembre 2025",
    type: "news",
    content: "AL Infotech Academy devient partenaire officiel de Microsoft pour la formation Azure Cloud. Des certifications officielles seront incluses dans nos programmes.",
    time: "10:00",
    location: "Campus Principal",
    image: "/src/assets/images/microsoft.jpg",
    category: "Partenariat"
  },
  {
    id: 3,
    title: "Hackathon Intelligence Artificielle",
    date: "25 septembre 2025",
    type: "event",
    content: "Participez à notre hackathon IA et développez des solutions innovantes. Prix à gagner et opportunités de stage chez nos partenaires.",
    time: "08:30",
    location: "Lab Innovation",
    image: "/src/assets/images/hackathon.jpg",
    category: "Événement"
  },
  {
    id: 4,
    title: "Journée Portes Ouvertes",
    date: "28 septembre 2025",
    type: "event",
    content: "Découvrez nos installations, rencontrez nos formateurs et participez à des ateliers pratiques lors de notre journée portes ouvertes.",
    time: "10:00",
    location: "Campus Principal",
    image: "/src/assets/images/portes-ouvertes.jpg",
    category: "Événement"
  },
];

const AnnouncementCard = ({ announcement }) => {
  const typeColors = {
    reunion: "bg-blue-100 text-blue-800",
    event: "bg-purple-100 text-purple-800",
    deadline: "bg-red-100 text-red-800",
  };

  const typeIcons = {
    reunion: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    event: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    deadline: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-lg ${typeColors[announcement.type]} flex items-center justify-center`}>
          {typeIcons[announcement.type]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
          <p className="text-sm text-gray-500">{announcement.date}</p>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{announcement.content}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {announcement.time}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {announcement.location}
        </div>
      </div>
    </motion.div>
  );
};

const Announcements = () => {
  const [filter, setFilter] = useState("all");

  const filteredAnnouncements = announcements.filter(
    (a) => filter === "all" || a.type === filter
  );

  return (
    <section id="announcements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Annonces et événements
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Restez informé des dernières actualités, réunions et événements importants
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter("reunion")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === "reunion"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Réunions
          </button>
          <button
            onClick={() => setFilter("event")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === "event"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Événements
          </button>
          <button
            onClick={() => setFilter("deadline")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === "deadline"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Deadlines
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Announcements;
