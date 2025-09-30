import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "../../data/blog";
import Header from "../../components/home/Header";

export const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const allCategories = blogPosts.map(post => post.category);
    return ["all", ...new Set(allCategories)];
  }, []);

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            Notre Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto"
          >
            Découvrez les dernières tendances, nos succès et les actualités de l&apos;écosystème tech à travers les articles de nos experts.
          </motion.p>
        </div>
      </div>

      {/* Filtres et Liste des articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
            >
              {category === 'all' ? 'Toutes les catégories' : category}
            </motion.button>
          ))}
        </div>

        {/* Grille des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group border border-transparent hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/blog/${post.id}`} className="block">
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-500">{post.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{post.author}</p>
                      <p className="text-xs text-slate-500">{post.authorRole}</p>
                    </div>
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
