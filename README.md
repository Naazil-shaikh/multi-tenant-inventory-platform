# Multi-Tenant Inventory Platform

A backend-first inventory management system built to support multiple tenants with strict data isolation, role-based access control, and audit-safe inventory operations.

---

## Overview

This project is designed around a single backend instance serving multiple organizations (tenants).

Each request is executed in a tenant-aware context, ensuring that data access and mutations remain fully isolated. The system prioritizes correctness, authorization guarantees, and traceability over UI polish.

The frontend exists primarily to validate backend behavior and workflows.

---

## Core Design Principles

### Multi-Tenancy
- Single backend instance serving multiple tenants
- Tenant context resolved per request using headers
- No cross-tenant data access
- All queries and mutations are tenant-scoped by design

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Permission checks enforced at middleware level
- Clear separation between system-level and tenant-level roles

### Inventory Integrity
- Inventory quantities are never mutated directly
- All stock changes are recorded as transactions
- Write operations are traceable and auditable
- Designed to support historical inspection of inventory state

---

## Repository Layout

This repository follows a mono-repo structure:

- `backend/` contains the Node.js and Express backend, including business logic, data models, authorization layers, and inventory workflows.
- `frontend/` contains a React application used to interact with and exercise backend APIs.

The backend is the primary focus of this project.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Frontend
- React
- Redux Toolkit
- Axios

---

## Environment Variables

The backend requires a `.env` file (not committed):

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Running Locally
### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```


## Notes

- Backend correctness is prioritized over UI polish
- Authorization failures are explicit by design

- Most decisions favor safety and clarity over convenience

- The system is structured to be extended, not demoed

## Status

- Actively developed.

- Core backend functionality is stable and complete for tenant, membership, and inventory flows.
- The frontend remains functional and secondary to backend design.
