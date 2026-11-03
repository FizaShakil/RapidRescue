import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatDate";

const TRACKABLE_STATUSES = ["confirmed", "en_route", "arrived", "transporting"];

const BookingCard = ({ booking }) => {
  const canTrack = TRACKABLE_STATUSES.includes(booking.status);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-mono">#{booking._id.slice(-8).toUpperCase()}</span>
          <StatusBadge status={booking.status} />
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            booking.bookingType === "emergency"
              ? "bg-red-50 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}>
            {booking.bookingType === "emergency" ? "Emergency" : "Non-Emergency"}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 mt-1">{booking.pickupLocation?.address}</p>
        {booking.dropLocation?.address && (
          <p className="text-xs text-gray-500">→ {booking.dropLocation.address}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{formatDate(booking.createdAt)}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {canTrack && (
          <Link
            to={`/user/track/${booking._id}`}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center"
          >
            Track
          </Link>
        )}
        <Link
          to={`/user/bookings/${booking._id}`}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
