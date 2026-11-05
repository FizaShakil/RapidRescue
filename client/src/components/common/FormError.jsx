const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="w-full px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
      {message}
    </div>
  );
};

export default FormError;
