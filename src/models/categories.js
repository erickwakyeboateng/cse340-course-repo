import db from "./db.js";

// Get all categories
const getAllCategories = async () => {
  const query = `
    SELECT
      category_id,
      name,
      description
    FROM public.category
    ORDER BY category_id;
  `;

  const result = await db.query(query);

  return result.rows;
};

// Get categories assigned to a specific project
const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.name,
      c.description
    FROM public.project_category pc
    JOIN public.category c
      ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_id;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

// Assign a category to a project
const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO public.project_category (category_id, project_id)
    VALUES ($1, $2);
  `;

  await db.query(query, [categoryId, projectId]);
};

// Update category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments
  const deleteQuery = `
    DELETE FROM public.project_category
    WHERE project_id = $1;
  `;

  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

// Export model functions
export {
  getAllCategories,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments,
};
