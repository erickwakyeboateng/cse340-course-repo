import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments,
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";

// Display all categories
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

// Display category details and associated projects

const showCategoryDetail = async (req, res) => {
  const categoryId = req.params.id;

  const category = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);

  res.render("category", {
    title: category.name,
    category,
    projects,
  });
};
// Display the category assignment form
const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

// Process category assignments
const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIdsArray);

  req.flash("success", "Categories updated successfully.");

  res.redirect(`/project/${projectId}`);
};

// Export controller functions
export {
  showCategoriesPage,
  showCategoryDetail,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
