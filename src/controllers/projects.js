// Import project model functions
import { body, validationResult } from "express-validator";

import {
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
} from "../models/projects.js";

import { getCategoriesByServiceProjectId } from "../models/categories.js";
// Import organization model functions
import { getAllOrganizations } from "../models/organizations.js";

//Project Validation
const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required.")
    .bail()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required.")
    .bail()
    .isLength({ min: 1, max: 999 })
    .withMessage("Description must be less than 1000 characters."),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required.")
    .bail()
    .isLength({ min: 1, max: 199 })
    .withMessage("Location must be less than 200 characters."),

  body("date")
    .notEmpty()
    .withMessage("Project date is required.")
    .bail()
    .isISO8601()
    .withMessage("Please provide a valid date."),

  body("organizationId")
    .notEmpty()
    .withMessage("Please select an organization.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Please select a valid organization."),
];

// Define controller functions
const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

  res.render("projects", {
    title: "Upcoming Service Projects",
    projects,
  });
};

const showProjectDetailsPage = async (req, res) => {
  const id = req.params.id;

  const project = await getProjectDetails(id);
  const categories = await getCategoriesByServiceProjectId(id);

  res.render("project", {
    title: "Service Project Details",
    project,
    categories,
  });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();

  res.render("new-project", {
    title: "Add New Service Project",
    organizations,
  });
};

// Display the edit project form
const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const project = await getProjectDetails(projectId);

  if (!project) {
    req.flash("error", "Project not found.");
    return res.redirect("/projects");
  }

  const organizations = await getAllOrganizations();

  res.render("edit-project", {
    title: "Edit Service Project",
    project,
    organizations,
  });
};

const processNewProjectForm = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new project form
    return res.redirect("/new-project");
  }

  // Extract form data
  const { title, description, location, date, organizationId } = req.body;

  try {
    // Create the new project in the database
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);

    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

// Process the edited project form
const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  // Extract submitted form data
  const { title, description, location, date, organizationId } = req.body;

  try {
    // Update the existing project
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Service project updated successfully!");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating service project:", error);

    req.flash("error", "There was an error updating the service project.");
    res.redirect(`/edit-project/${projectId}`);
  }
};

// Export controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
};
