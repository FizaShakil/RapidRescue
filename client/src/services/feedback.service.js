import axiosInstance from "../axiosInstance";

export const submitFeedback = (data) =>
  axiosInstance.post("/users/submit-feedback", data);

export const getMyFeedback = () =>
  axiosInstance.get("/users/my-feedback");
