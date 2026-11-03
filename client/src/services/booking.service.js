import axiosInstance from "../axiosInstance";

export const createBooking = (data) =>
  axiosInstance.post("/users/create-booking", data);

export const getMyBookings = (params) =>
  axiosInstance.get("/users/my-bookings", { params });

export const getMyBookingById = (id) =>
  axiosInstance.get(`/users/my-bookings/${id}`);

export const cancelBooking = (id, data) =>
  axiosInstance.patch(`/users/cancel-booking/${id}`, data);

// Tracking re-uses the booking detail endpoint — the backend populates
// assignedAmbulance.currentLocation and assignedDriver.currentLocation.
// No dedicated tracking endpoint exists on the backend.
export const getBookingForTracking = (id) =>
  axiosInstance.get(`/users/my-bookings/${id}`);
