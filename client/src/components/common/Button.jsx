const Button = ({ children, loading, className = "", ...props }) => {
  return (
    <button
      disabled={loading || props.disabled}
      className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition
        bg-red-600 text-white hover:bg-red-700 active:bg-red-800
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
