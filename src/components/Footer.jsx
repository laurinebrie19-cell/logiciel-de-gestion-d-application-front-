import PropTypes from "prop-types";

const Footer = ({ isSidebarOpen }) => {
  return (
    <footer
      className={`bg-indigo-700 shadow-inner ${
        isSidebarOpen ? "md:ml-64" : ""
      } transition-all duration-300 fixed bottom-0 left-0 right-0 z-10`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-white">
            © {new Date().getFullYear()} Al Infotech Sarl | Tous droits
            réservés.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="/terms" className="text-white hover:text-gray-200">
              Conditions d'utilisation
            </a>
            <a href="/privacy" className="text-white hover:text-gray-200">
              Politique de confidentialité
            </a>
            <a href="/contact" className="text-white hover:text-gray-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};

export default Footer;
