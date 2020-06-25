USE company_db;

-- queries to add employees, roles, departments

INSERT INTO department(name) VALUES(?);
INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);

-- queries to view employees, roles, departments

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

-- query to update

UPDATE employee SET role_id = ? WHERE employee(id) = ?;