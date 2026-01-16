import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", verifyJwt, changeCurrentPassword);
router.get("/me", verifyJwt, getCurrentUser);
router.patch("/me", verifyJwt, updateAccountDetails);

router.patch(
  "/me/avatar",
  verifyJwt,
  upload.single("avatar"),
  updateUserAvatar
);

router.patch(
  "/me/cover",
  verifyJwt,
  upload.single("coverImage"),
  updateUserCoverImage
);

export default router;
