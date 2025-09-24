import { motion } from "framer-motion";

const stats = [
  { id: 1, number: "1000+", label: "Étudiants formés" },
  { id: 2, number: "95%", label: "Taux d&apos;insertion" },
  { id: 3, number: "50+", label: "Partenaires entreprises" },
  { id: 4, number: "15+", label: "Formateurs experts" },
];

const features = [
  "Formations adaptées aux besoins du marché",
  "Équipe pédagogique expérimentée",
  "Accompagnement vers l&apos;emploi",
  "Infrastructure moderne",
  "Pédagogie active et pratique",
  "Réseau d&apos;alumni dynamique",
];

export const About = () => {
  return (
    <section id="about" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative">
              <div className="aspect-w-3 aspect-h-2 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/src/assets/images/login-illustration.jpg"
                  alt="AL Infotech Academy Campus"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#0ea5e9] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#0ea5e9] font-medium">Notre campus</p>
                    <p className="text-[#0f172a] font-semibold">Infrastructures modernes</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-[#0ea5e9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-[#0f172a]">
                À Propos d&apos;AL Infotech Academy
              </h2>
              <p className="mt-4 text-lg text-[#64748b]">
                Fondée avec la vision de former les talents numériques de demain, 
                AL Infotech Academy s&apos;engage à offrir une formation d&apos;excellence 
                dans les métiers de l&apos;informatique et du digital.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="text-center p-6 rounded-xl border border-[#e2e8f0] bg-white shadow-sm hover:border-[#0ea5e9] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-3xl font-bold text-[#0ea5e9] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-[#64748b]">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10"
            >
              <h3 className="text-xl font-semibold text-[#0f172a] mb-4">
                Nos Points Forts
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] group-hover:bg-[#0ea5e9] flex items-center justify-center transition-colors duration-200">
                      <svg
                        className="w-5 h-5 text-[#0ea5e9] group-hover:text-white transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-[#64748b] group-hover:text-[#0ea5e9] transition-colors duration-200">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
