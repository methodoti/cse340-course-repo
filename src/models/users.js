import db from './db.js';
import bcrypt from 'bcrypt';

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

const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM users
        WHERE email = $1;
    `;
    const queryParams = [email];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (isPasswordValid) {
        delete user.password_hash; // Remove password hash before returning user object
        // user.password_hash = undefined; // Remove password hash before returning user object
        return user;
    } else {
        return null; // Invalid password
    }
};

export { createUser, authenticateUser };