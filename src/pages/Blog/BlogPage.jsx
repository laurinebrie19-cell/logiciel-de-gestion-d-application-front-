import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

// Données temporaires (à remplacer par une API ou un CMS plus tard)
const blogPosts = [
  {
    id: 1,
    title: "Découvrez nos nouvelles formations en cybersécurité",
    date: "20 septembre 2025",
    author: "Sarah Johnson",
    category: "Formations",
    excerpt: "En réponse aux besoins croissants du marché, AL Infotech Academy lance de nouvelles formations certifiantes en cybersécurité...",
    content: `En réponse aux besoins croissants du marché, AL Infotech Academy lance de nouvelles formations certifiantes en cybersécurité. Ces programmes, développés en collaboration avec des experts du secteur, couvrent les dernières technologies et méthodologies en matière de sécurité informatique.

    Les formations incluent :
    - Analyse des menaces et gestion des risques
    - Sécurité des réseaux et des systèmes
    - Tests d&apos;intrusion et ethical hacking
    - Réponse aux incidents de sécurité
    
    Les inscriptions sont ouvertes pour la session de janvier 2026.`,
    image: "/src/assets/images/cyber-security.jpg",
    tags: ["Cybersécurité", "Formation", "Technologie"]
  },
  {
    id: 2,
    title: "Succès de notre première promotion DevOps",
    date: "18 septembre 2025",
    author: "Marc Dupont",
    category: "Réussites",
    excerpt: "Nous sommes fiers d&apos;annoncer que 100% de notre première promotion DevOps ont trouvé un emploi dans les 3 mois suivant leur formation...",
    content: `Nous sommes fiers d&apos;annoncer que 100% de notre première promotion DevOps ont trouvé un emploi dans les 3 mois suivant leur formation. Ce succès témoigne de la qualité de notre programme et de la pertinence de notre approche pédagogique axée sur la pratique.

    Quelques statistiques :
    - 100% de placement en entreprise
    - 85% des étudiants embauchés en CDI
    - Salaire moyen de départ : 45K€
    
    Les inscriptions pour la prochaine session sont maintenant ouvertes.`,
    image: "/src/assets/images/devops.jpg",
    tags: ["DevOps", "Emploi", "Formation"]
  },
  // ... autres articles
];

export const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "Formations", "Événements", "Réussites", "Actualités", "Partenariats"];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#0f172a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-6"
          >
            Blog et Actualités
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#94a3b8] text-lg text-center max-w-3xl mx-auto"
          >
            Restez informé des dernières actualités, événements et succès de notre académie
          </motion.p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                  ? "bg-[#0ea5e9] text-white"
                  : "bg-white text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Liste des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e2e8f0] hover:shadow-md transition-all"
            >
              <Link to={`/blog/${post.id}`} className="block">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 text-xs font-medium bg-[#f1f5f9] text-[#64748b] rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-[#64748b]">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0f172a] mb-3">
                    {post.title}
                  </h2>
                  <p className="text-[#64748b] mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-[#64748b]">
                      {post.author}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};
