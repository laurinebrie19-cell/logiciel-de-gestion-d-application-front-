import { motion } from "framer-motion";
import PropTypes from "prop-types";

export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  options,
  className = "",
}) => {
  const baseInputClasses = `
    block w-full px-4 py-3 
    rounded-xl border border-gray-200 
    focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
    transition-all duration-200
    ${error ? "border-red-300 text-red-900 placeholder-red-300" : ""}
    ${className}
  `;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClasses}
          >
            <option value="">Sélectionner</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClasses}
            placeholder={placeholder}
          />
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "date", "select"]),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default FormField;
