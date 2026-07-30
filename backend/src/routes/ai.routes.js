// routes/ai.routes.js

import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { chatController } from "../controllers/ai.controller.js";

const router = Router();

router.post("/chat", verifyJwt, resolveTenantContext, chatController);

export default router;
