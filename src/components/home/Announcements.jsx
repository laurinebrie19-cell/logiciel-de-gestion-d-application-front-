import { motion } from "framer-motion";
import AnnoncesList from './AnnoncesList';

const Announcements = () => {
  return (
    <section id="announcements" className="bg-gray-50 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <AnnoncesList />
      </motion.div>
    </section>
  );
};

export default Announcements;
