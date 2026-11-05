const config = {
  pending:      { label: "Pending",      cls: "bg-yellow-100 text-yellow-800" },
  confirmed:    { label: "Confirmed",    cls: "bg-blue-100 text-blue-800" },
  en_route:     { label: "En Route",     cls: "bg-indigo-100 text-indigo-800" },
  arrived:      { label: "Arrived",      cls: "bg-purple-100 text-purple-800" },
  transporting: { label: "Transporting", cls: "bg-orange-100 text-orange-800" },
  completed:    { label: "Completed",    cls: "bg-green-100 text-green-800" },
  cancelled:    { label: "Cancelled",    cls: "bg-red-100 text-red-800" },
};

const StatusBadge = ({ status }) => {
  const { label, cls } = config[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
