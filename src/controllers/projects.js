// Import any needed model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails } from '../models/projects.js';

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
    const title = 'Project Details';

    console.log('Project Details:', projectDetails);

    res.render('project', { title, projectDetails });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };