import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";

// Cette fonction sera remplacée par un appel API dans une vraie application
const getPostById = (id) => {
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
      
      Les inscriptions sont ouvertes pour la session de janvier 2026.

      ## Programme détaillé

      ### Module 1 : Fondamentaux de la cybersécurité
      - Introduction aux concepts de base
      - Panorama des menaces actuelles
      - Cadre juridique et conformité

      ### Module 2 : Sécurité des réseaux
      - Architecture réseau sécurisée
      - Configuration des pare-feu
      - Détection et prévention des intrusions

      ### Module 3 : Tests d&apos;intrusion
      - Méthodologie de test
      - Outils et techniques
      - Rédaction de rapports

      ### Module 4 : Réponse aux incidents
      - Création d&apos;un plan de réponse
      - Investigation numérique
      - Récupération et leçons apprises

      ## Débouchés professionnels

      Les diplômés de cette formation pourront prétendre aux postes suivants :
      - Analyste en cybersécurité
      - Pentesteur
      - Responsable de la sécurité des systèmes d&apos;information
      - Consultant en sécurité informatique

      ## Modalités d&apos;inscription

      Pour vous inscrire à cette formation :
      1. Remplissez le formulaire de candidature en ligne
      2. Participez à un entretien de motivation
      3. Passez un test technique d&apos;évaluation
      4. Recevez votre confirmation d&apos;inscription

      N&apos;hésitez pas à nous contacter pour plus d&apos;informations.`,
      image: "/src/assets/images/cyber-security.jpg",
      tags: ["Cybersécurité", "Formation", "Technologie"],
      author_image: "/src/assets/images/author1.jpg",
      author_role: "Responsable des formations en cybersécurité"
    }
    // ... autres articles
  ];
  return blogPosts.find(post => post.id === Number(id));
};

export const BlogPostDetail = () => {
  const { id } = useParams();
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0f172a] mb-4">Article non trouvé</h1>
          <Link 
            to="/blog"
            className="text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
          >
            Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero section avec image */}
      <div className="relative h-[60vh] bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-sm font-medium bg-[#0ea5e9] text-white rounded-full">
                  {post.category}
                </span>
                <span className="text-[#94a3b8]">{post.date}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-4">
                <img
                  src={post.author_image}
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-white">{post.author}</div>
                  <div className="text-sm text-[#94a3b8]">{post.author_role}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenu de l'article */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.article 
            className="lg:col-span-2 prose prose-lg prose-slate max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.article>

          <motion.aside
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-[#f1f5f9] text-[#64748b] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">
                Intéressé par cette formation ?
              </h3>
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-3 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-[#0284c7] transition-colors"
                >
                  Nous contacter
                </Link>
                <Link
                  to="/inscription"
                  className="block w-full text-center px-6 py-3 bg-white text-[#0ea5e9] font-medium rounded-lg border border-[#0ea5e9] hover:bg-[#f1f5f9] transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};
