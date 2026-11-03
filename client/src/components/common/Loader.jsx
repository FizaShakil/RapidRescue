const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
