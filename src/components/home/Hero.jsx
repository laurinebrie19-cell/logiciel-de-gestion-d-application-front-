import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] py-20 sm:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0ea5e9] opacity-10"></div>
        <div
          className="absolute bottom-0 left-0 right-0 top-0 bg-[url('/src/assets/images/7070628_3275432.svg')] bg-cover bg-center opacity-30"
          style={{ filter: "grayscale(100%)" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Forgez Votre Avenir{" "}
            <span className="text-[#0ea5e9]">
              dans le Numérique
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-[#94a3b8]"
          >
            AL Infotech Academy vous offre une formation d&apos;excellence pour devenir 
            un professionnel reconnu dans les métiers de l&apos;informatique. Rejoignez 
            une communauté dynamique et construisez votre carrière avec nous.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              to="/auth/login"
              className="rounded-lg bg-[#0ea5e9] px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0284c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9] transition-all"
            >
              Commencer maintenant
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-white hover:text-[#0ea5e9] transition-colors"
            >
              En savoir plus <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
