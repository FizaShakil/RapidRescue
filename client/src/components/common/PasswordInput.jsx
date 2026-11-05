import { useState } from "react";

const PasswordInput = ({ label, id, error, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none transition
            focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs select-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
