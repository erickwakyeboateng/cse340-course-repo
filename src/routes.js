import express from "express";

import { showHomePage } from "./controllers/index.js";
import { testErrorPage } from "./controllers/errors.js";

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsers,
} from "./controllers/users.js";

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  processEditOrganizationForm,
  showEditOrganizationForm,
} from "./controllers/organizations.js";

import {
  showCategoriesPage,
  showCategoryDetail,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";

import {
  showProjectsPage,
  showProjectDetailsPage,
  processNewProjectForm,
  showNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
} from "./controllers/projects.js";

const router = express.Router();

// Home page
router.get("/", showHomePage);

// Organizations
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// New organization form (GET)
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);

router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);

// Process new organization form (POST)
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);

// Route to handle the edit organization form submission
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);

// Projects
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);

router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);

// Categories
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetail);

// New category
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);

router.get(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  showAssignCategoriesForm,
);

router.post(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  processAssignCategoriesForm,
);

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// User login routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// Protected dashboard route
router.get("/dashboard", requireLogin, showDashboard);

// Edit category
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);

router.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  processEditCategoryForm,
);

//Users Route
router.get("/users", requireRole("admin"), showUsers);

// Error-handling routes
router.get("/test-error", testErrorPage);

export default router;
