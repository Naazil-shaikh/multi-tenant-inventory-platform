import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { standardRateLimiter } from "./middlewares/rateLimiter.milleware.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-Id"],
  })
);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-Id"],
//   })
// );

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(standardRateLimiter);

import userRouter from "./routes/user.routes.js";
import tenantRouter from "./routes/tenant.routes.js";
import membershipRouter from "./routes/membership.routes.js";
import branchRouter from "./routes/branch.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import inventoryTransactionRouter from "./routes/inventoryTransaction.routes.js";
import inventoryAlertRouter from "./routes/inventoryAlert.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import aiRouter from "./routes/ai.routes.js";
import testRouter from "./routes/test.routes.js";
import debugRouter from "./routes/debug.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { branchInventory } from "./services/branch.service.js";
import { verifyJwt } from "./middlewares/auth.middleware.js";
import { resolveTenantContext } from "./middlewares/tenantContext.middleware.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/memberships", membershipRouter);
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/products", productRouter);

app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/inventory-transactions", inventoryTransactionRouter);
app.use("/api/v1/inventory-alerts", inventoryAlertRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/debug", debugRouter);

app.use(errorHandler);

export { app };
