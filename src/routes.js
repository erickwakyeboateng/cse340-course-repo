import express from "express";

import { showHomePage } from "./controllers/index.js";
import { testErrorPage } from "./controllers/errors.js";

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
router.post("/new-project", projectValidation, processNewProjectForm);

router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);

// Categories
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetail);

// New category
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);

router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);

router.post(
  "/project/:projectId/assign-categories",
  processAssignCategoriesForm,
);

// Edit category
router.get("/edit-category/:id", showEditCategoryForm);

router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

// Error-handling routes
router.get("/test-error", testErrorPage);

export default router;
