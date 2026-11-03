import axiosInstance from "../axiosInstance";

export const getMyMedicalProfile = () =>
  axiosInstance.get("/users/my-medical-profile");

export const createMedicalProfile = (data) =>
  axiosInstance.post("/users/create-medical-profile", data);

export const updateMedicalProfile = (data) =>
  axiosInstance.patch("/users/update-medical-profile", data);
