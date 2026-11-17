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



// Export the model functions
export { getAllCategories, getCategoryDetails, getCategoryByProjectId };