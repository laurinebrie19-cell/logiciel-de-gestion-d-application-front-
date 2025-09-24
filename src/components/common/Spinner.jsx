import PropTypes from "prop-types";

const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full border-4 border-gray-200 rounded-full border-t-indigo-600"></div>
      </div>
    </div>
  );
};
Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Spinner;
