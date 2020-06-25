USE company_db;

-- Create starter data for department table
INSERT INTO department (name) 
VALUES 
('Engineering'),
('Accounting'),
('Legal'), 
('Ops'), 
('Sales');

-- Create starter data for role table
INSERT INTO role (title, salary, department_id) 
VALUES
("Head Engineer", 150000, 1),
("Engineer", 100000, 1),
("Accountant", 80000, 2),
("Counsel", 100000, 3),
("Head Counsel", 130000, 3),
("Office Manager", 80000, 4),
("Operations Manager", 100000, 4),
("Sales Representative", 80000, 5),
("Lead Sales Representative", 90000, 5);

-- Create starter data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Finn", "Mertens", 1, null),
("Ahzek", "Ahriman", 2, 1),
("Steven", "Universe", 3, null),
("Legolas", "Greenleaf", 4, 5),
("Molly", "Templar", 5, null),
("Crag", "Hack", 6, 7),
("Obi Wan", "Kenobi", 7, null),
("Dwight", "Schrute", 8, 9),
("Ismark", "Kolyanovich", 9, null);