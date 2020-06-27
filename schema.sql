
DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;
USE company_db;

-- department table
CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

-- role table
CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

-- employee table
CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES role(id),
    -- FOREIGN KEY(manager_id) REFERENCES manager (id)
);


-- select from functions
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
