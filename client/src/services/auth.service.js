import axiosInstance from "../axiosInstance";

export const registerUser = (data) =>
  axiosInstance.post("/users/register", data);

export const loginUser = (data) =>
  axiosInstance.post("/users/login", data);

export const logoutUser = () =>
  axiosInstance.post("/users/logout");

export const refreshToken = () =>
  axiosInstance.post("/users/refresh-token");

export const changePassword = (data) =>
  axiosInstance.post("/users/change-password", data);

// Used on app startup to verify the stored token is still valid
export const getCurrentUser = () =>
  axiosInstance.get("/users/my-profile");
