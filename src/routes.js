import express from "express";

import { showHomePage } from "./controllers/index.js";

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
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

import {
  showProjectsPage,
  showProjectDetailsPage,
  processNewProjectForm,
  showNewProjectForm,
  projectValidation,
} from "./controllers/projects.js";

const router = express.Router();

// Home page
router.get("/", showHomePage);

// Organizations
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

// New organization form (GET)
router.get("/new-organization", showNewOrganizationForm);

router.get("/edit-organization/:id", showEditOrganizationForm);

// Process new organization form (POST)
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);

// Route to handle the edit organization form submission
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);

// Projects
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/new-project", showNewProjectForm);
// Route to handle new project form submission
router.post("/new-project", projectValidation, processNewProjectForm);

// Categories
router.get("/categories", showCategoriesPage);
router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);

router.post(
  "/project/:projectId/assign-categories",
  processAssignCategoriesForm,
);

// Error-handling routes
router.get("/test-error", testErrorPage);

export default router;
