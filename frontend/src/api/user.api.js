import api from "./axios";

export const loginUser = (data) => {
  return api.post("/users/login", data);
};

export const registerUser = (formData) => {
  return api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logoutUser = () => {
  return api.post("/users/logout");
};

export const refreshAccessToken = () => {
  return api.post("/users/refresh-token");
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updatePassword = (data) => {
  return api.post("/users/change-password", data);
};

export const updateAccountDetails = (data) => {
  return api.patch("/users/me", data);
};

export const updateUserAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return api.patch("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserCoverImage = (file) => {
  const formData = new FormData();
  formData.append("coverImage", file);

  return api.patch("/users/me/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
