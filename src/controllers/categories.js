import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByServiceProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";
import { body, validationResult } from "express-validator";

// Category validation
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters."),
];

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

// Display the new category form
const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";

  res.render("new-category", { title });
};

// Process the new category form
const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-category");
  }

  const { name } = req.body;

  try {
    await createCategory(name);

    req.flash("success", "Category added successfully!");
    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23505") {
      req.flash("error", "A category with this name already exists.");
      return res.redirect("/new-category");
    }

    throw error;
  }
};

// Display the edit category form
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    req.flash("error", "Category not found.");
    return res.redirect("/categories");
  }

  const title = "Edit Category";

  res.render("edit-category", { title, category });
};

// Process the edit category form
const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);

    req.flash("success", "Category updated successfully!");
    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23505") {
      req.flash("error", "A category with this name already exists.");
      return res.redirect(`/edit-category/${categoryId}`);
    }

    throw error;
  }
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
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
