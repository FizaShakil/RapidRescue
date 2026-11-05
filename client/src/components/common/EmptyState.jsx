const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-gray-400 text-xl">📋</span>
      </div>
      <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-4 max-w-xs">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
