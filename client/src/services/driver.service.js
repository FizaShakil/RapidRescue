import axiosInstance from "../axiosInstance";

export const getMyDriverProfile = () =>
  axiosInstance.get("/driver/my-profile");

export const getCurrentAssignment = () =>
  axiosInstance.get("/driver/my-current-assignment");

export const updateMyLocation = (data) =>
  axiosInstance.patch("/driver/update-my-location", data);

export const updateMyStatus = (data) =>
  axiosInstance.patch("/driver/update-my-status", data);

export const getMyAssignedBookings = (params) =>
  axiosInstance.get("/driver/my-assigned-bookings", { params });

export const getAssignedBookingById = (id) =>
  axiosInstance.get(`/driver/my-assigned-bookings/${id}`);

export const updateBookingStatus = (id, data) =>
  axiosInstance.patch(`/driver/my-assigned-bookings/${id}/update-status`, data);

export const addDriverNotes = (id, data) =>
  axiosInstance.patch(`/driver/my-assigned-bookings/${id}/add-notes`, data);

export const getPatientMedicalProfile = (id) =>
  axiosInstance.get(`/driver/my-assigned-bookings/${id}/patient-medical-profile`);
