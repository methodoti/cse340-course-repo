// Import any needed model functions
import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getCategoryByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Project title must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 255 })
        .withMessage('Location cannot exceed 255 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization selection is required')
        .isInt()
        .withMessage('Please select a valid organization')
];


// Define the number of upcoming projects to retrieve
const NUMBER_OF_UPCOMING_PROJECTS = 5; 

// Define any controller functions 
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Define a controller function to show project details
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoryByProjectId(projectId);
    const title = 'Project Details';

    // console.log('Project Details:', projectDetails);

    res.render('project', { title, projectDetails, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors and flash them to the user
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
    // Extract form data from req.body
    // Use destructuring to get the form fields
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Call the model function to create a new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);
    
        // Set a success flash message
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';

    res.render('edit-project', { title, projectDetails, organizations });
};
    
const processEditProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors and flash them to the user
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the edit project form
        return res.redirect(`/edit-project/${req.params.id}`);
    }
    
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, organizationId, title, description, location, date);
    // Set a success flash message
    req.flash('success', 'Service project updated successfully!');
    
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};