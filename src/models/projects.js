import db from "./db.js";
export { getAllProjects, getProjectsByOrganizationId };

const getAllProjects = async () => {
  const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name,
            TO_CHAR(p.project_date, 'FMMonth DD, YYYY') AS formatted_date
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        project_date
      FROM project
      WHERE organization_id = $1
      ORDER BY project_date;
    `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};
