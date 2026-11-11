// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";

// Define any controller functions
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

  res.render("project", {
    title: "Service Project Details",
    project,
  });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };
