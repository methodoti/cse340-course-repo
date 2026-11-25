import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
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

export { showUserRegistrationForm, processUserRegistrationForm, userRegistrationValidation };