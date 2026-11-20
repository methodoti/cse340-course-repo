import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        WHERE c.category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoryByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
            JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)
    `;

    const queryParams = [categoryId, projectId];
    await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
        // console.log(`======> Assigned category ${categoryId} to project ${projectId}`);
    }
};


// Export the model functions
    export {
        getAllCategories,
        getCategoryDetails,
        getCategoryByProjectId,
        updateCategoryAssignments
    };