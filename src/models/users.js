import db from './db.js';

/**
 * Creates a new user in the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} passwordHash - The password hash of the user.
 * @returns {number} The id of the newly created user record.
 */
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id, created_at)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4), DEFAULT)
        RETURNING user_id;
    `;

    const default_role = 'user'; // Default role for new users
    const queryParams = [name, email, passwordHash, default_role];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

export { createUser };