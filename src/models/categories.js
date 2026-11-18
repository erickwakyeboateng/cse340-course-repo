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

// Get a single category by its ID
const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name,
      description
    FROM public.category
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
};

// Create a new category
const createCategory = async (name) => {
  const query = `
    INSERT INTO public.category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await db.query(query, [name]);

  return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const result = await db.query(query, [name, categoryId]);

  if (result.rows.length === 0) {
    throw new Error("Category not found");
  }

  return result.rows[0].category_id;
};

// Get all projects assigned to a specific category
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date
    FROM public.project_category pc
    JOIN public.project p
      ON pc.project_id = p.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date;
  `;

  const result = await db.query(query, [categoryId]);

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
  getCategoryById,
  createCategory,
  updateCategory,
  getProjectsByCategoryId,
  updateCategoryAssignments,
};
