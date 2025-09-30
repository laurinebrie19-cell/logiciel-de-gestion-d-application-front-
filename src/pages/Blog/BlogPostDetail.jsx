import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { blogPosts } from "../../data/blog";
import { ArrowLeft, Share2, Bookmark, Calendar, Tag, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const getPostById = (id) => {
  return blogPosts.find(post => post.id === Number(id));
};

export const BlogPostDetail = () => {
  const { id } = useParams();
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <ChevronLeft className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Article non trouvé</h1>
            <p className="text-slate-600 mb-8">Désolé, l&apos;article que vous recherchez n&apos;existe pas ou a été déplacé.</p>
          </div>
          <Link 
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au Blog
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Bouton retour */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-slate-50 transition-all text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour</span>
        </Link>
      </div>

      {/* Hero section */}
      <div className="relative bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900" />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Category & Date */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-indigo-500 text-white text-sm font-semibold rounded-full">
                {post.category}
              </span>
              <span className="flex items-center text-slate-400 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={post.authorImage}
                alt={post.author}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400"
              />
              <div className="text-left">
                <div className="font-semibold text-white">{post.author}</div>
                <div className="text-sm text-slate-400">{post.authorRole}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

            {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Article Content */}
          <div className="p-6 md:p-10">
            <div className="prose prose-lg prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                  h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                  h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3 text-indigo-900" {...props} />,
                  p: (props) => <p className="mb-4 text-slate-600 leading-relaxed" {...props} />,
                  ul: (props) => <ul className="my-4 list-disc pl-6 space-y-2" {...props} />,
                  li: (props) => <li className="text-slate-600" {...props} />,
                  strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags Section */}
            <div className="mt-12 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-x-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-500" />
                  <span className="font-semibold text-slate-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Share and Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span>Sauvegarder</span>
                </button>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/contact"
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation entre articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-between items-center"
        >
          {post.id > 1 && (
            <Link
              to={`/blog/${post.id - 1}`}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Article précédent</span>
            </Link>
          )}
          {post.id < blogPosts.length && (
            <Link
              to={`/blog/${post.id + 1}`}
              className="ml-auto flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <span>Article suivant</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};
