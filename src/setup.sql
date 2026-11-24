-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
	project_id SERIAL PRIMARY KEY,
	organization_id INT NOT NULL REFERENCES organization(organization_id),
	title VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(255) NOT NULL,
	date DATE NOT NULL
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders (organization_id: 1)
(1, 'Park Pavilion Construction', 'Building a new covered pavilion for community gatherings in the central park.', 'Central Park', '2027-01-15'),
(1, 'Playground Equipment Repair', 'Replacing old chains on swings and tightening bolts on playground slides.', 'Westside Playground', '2027-02-20'),
(1, 'Community Center Ramp', 'Installing a wheelchair-accessible concrete ramp at the entrance of the community center.', 'Main St. Community Center', '2027-03-10'),
(1, 'Bus Stop Shelter Renovation', 'Repairing roofs and repainting benches at three major bus stops in the neighborhood.', 'Downtown Transit Corridor', '2027-04-05'),
(1, 'Library Bookshelf Assembly', 'Building and securing new solid wood bookshelves for the expanded youth section.', 'City Public Library', '2027-05-12'),

-- GreenHarvest Growers (organization_id: 2)
(2, 'Spring Seedling Planting', 'Planting tomato and pepper seedlings in the raised beds of the community garden.', 'Northside Urban Farm', '2027-01-25'),
(2, 'Compost Bin Construction', 'Building three large wooden compost bins for the neighborhood to share organic waste.', 'East Avenue Garden', '2027-02-28'),
(2, 'Rainwater Harvesting Setup', 'Installing water collection barrels and connecting them to the greenhouse irrigation system.', 'GreenHarvest HQ', '2027-03-15'),
(2, 'Neighborhood Weeding Day', 'Clearing invasive weeds from the public flower beds along the riverwalk.', 'Riverwalk Path', '2027-04-10'),
(2, 'Fall Harvest and Distribution', 'Harvesting ripe vegetables and packing them into boxes for local food banks.', 'South District Farm', '2027-05-20'),

-- UnityServe Volunteers (organization_id: 3)
(3, 'Food Pantry Organization', 'Sorting canned goods and organizing shelves at the local community food pantry.', 'Downtown Food Bank', '2027-01-10'),
(3, 'Winter Coat Drive', 'Collecting, inspecting, and organizing donated winter coats for homeless shelters.', 'UnityServe Main Office', '2027-02-15'),
(3, 'Senior Center Tech Help', 'Assisting elderly residents with setting up smartphones and making video calls.', 'Oakridge Retirement Home', '2027-03-22'),
(3, 'Beach Cleanup Morning', 'Walking the coastline to collect plastic waste and debris after the stormy season.', 'Sunset Beach', '2027-04-18'),
(3, 'After-School Tutoring', 'Providing math and reading assistance to middle school students.', 'Lincoln Middle School', '2027-05-25');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

-- ========================================
-- Project Category Linking Table
-- ========================================
CREATE TABLE project_category (
	project_id INT NOT NULL REFERENCES project(project_id),
	category_id INT NOT NULL REFERENCES category(category_id),
	PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Construction'),
('Gardening'),
('Education'),
('Community Service'),
('Environmental Cleanup');

-- ================================================================
-- Insert sample data: Project Categories Linking Table
-- ================================================================
INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders Projects
(1, 1), -- Park Pavilion Construction: Construction
(2, 1), -- Playground Equipment Repair: Construction
(3, 1), -- Community Center Ramp: Construction
(4, 1), -- Bus Stop Shelter Renovation: Construction
(5, 1), -- Library Bookshelf Assembly: Construction
-- GreenHarvest Growers Projects
(6, 2), -- Spring Seedling Planting: Gardening
(7, 2), -- Compost Bin Construction: Gardening
(8, 2), -- Rainwater Harvesting Setup: Gardening
(9, 2), -- Neighborhood Weeding Day: Gardening
(10, 2), -- Fall Harvest and Distribution: Gardening
-- UnityServe Volunteers Projects
(11, 3), -- Food Pantry Organization: Education
(12, 3), -- Winter Coat Drive: Education	
(13, 3), -- Senior Center Tech Help: Education
(14, 5), -- Beach Cleanup Morning: Environmental Cleanup
(15, 3), -- After-School Tutoring: Education
(15, 4); -- After-School Tutoring: Community Service

-- ========================================
-- Roles Table
-- ========================================
CREATE TABLE roles (
	role_id SERIAL PRIMARY KEY,
	role_name VARCHAR(50) UNIQUE NOT NULL,
	role_description TEXT
);

-- ========================================
-- Insert sample data: Roles
-- ========================================
INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role_id INT REFERENCES roles(role_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);