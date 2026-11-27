import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for user registration form
const userRegistrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('User name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('User name must be between 3 and 100 characters'),
    body('email')
        .trim() // repeat it on login
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters')
        .toLowerCase(), // repeat it on login
        // .normalizeEmail(), // repeat it on login
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 72 })
        .withMessage('Password must be between 6 and 72 characters long')
];

// Define validation and sanitization rules for login form
const loginValidation = [
    body('email')
        .trim() 
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters')
        .toLowerCase(), 
        // .normalizeEmail(), 
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: 72 })
        .withMessage('Invalid email or password. Please try again.')
];

const showUserRegistrationForm = (req, res) => {
    const title = 'User Registration';
    res.render('register', { title });
};

const processUserRegistrationForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the register form
        return res.redirect('/register');
    }    
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        // (genSalt is async; bcrypt.hash(password, 10) runs both steps automatically)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Call the model function to create a new user
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error creating user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }
};

const showLoginForm = async (req, res) => {
    const title = 'User Login';
    res.render('login', { title });
};

const processLoginForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the login form
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        // Call the model function to authenticate the user
        const user = await authenticateUser(email, password);

        if (user) {
            // Authentication successful - store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');
            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }
            res.redirect('/dashboard'); // Redirect to a protected route after login
        } else {
            // Authentication failed - invalid credentials
            req.flash('error', 'Invalid email or password. Please try again.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    // Destroy the session to log out the user
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'You have been logged out successfully.');
    res.redirect('/login'); // Redirect to the login page after logout
};

const requireLogin = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
}; 

const showDashboard = (req, res) => {
    const user = req.session.user;
    const name = user.name;
    const email = user.email;
    const title = 'User Details';
    res.render('dashboard', { title, name, email });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }

        const userRole = req.session.user.role_name;
        if (userRole !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/'); // Redirect to the root page
        }

        // User has required role, continue
        next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    userRegistrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    loginValidation,
    requireLogin,
    showDashboard,
    requireRole
};