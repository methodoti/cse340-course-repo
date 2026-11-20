// Import any needed model functions
import { getAllCategories, getCategoryDetails, getCategoryByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';
    
    res.render('category', { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoryByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    // console.log('======> Processing category assignment for project ID:', projectId);
    // console.log('======> Form data received:', req.body);
    const selectedCategoryIds = req.body.categoryIds || []; // Assuming the form sends an array of selected category IDs

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    // Update the category assignments for the project
    await updateCategoryAssignments(projectId, categoryIdsArray);

    // Set a success flash message
    req.flash('success', 'Categories assigned to the project successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};