const SoraLogo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl", 
    large: "text-3xl md:text-4xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pulse line */}
      <div className="flex items-center">
        <svg 
          width={size === "large" ? "60" : "40"} 
          height={size === "large" ? "30" : "20"} 
          viewBox="0 0 60 20" 
          className="text-sora-teal"
        >
          <path
            d="M0 10 L15 10 L20 5 L25 15 L30 2 L35 18 L40 10 L60 10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {/* SORA Text */}
      <span className={`font-bold tracking-wide ${sizeClasses[size]}`}>
        SORA ALLY
      </span>
    </div>
  );
};

export default SoraLogo;