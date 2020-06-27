const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //CHANGE WHEN UPLOADING!!!
    password: "Hellothere123!",
    database: "company_DB"
});

connection.connect((err) => {
    if(err) throw err;
    promptUser();
});

function promptUser() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What action would you like to take?",
        choices: [
            "View Employees",
            "View Roles",
            "View Departments",
            "Add Employees",
            "Add Roles",
            "Add Departments",
            "Update Role",
            "Delete Employee",
            "Delete Role",
            "Delete Department",
            "Exit Program"
        ]
    })
    .then(function(answer) {
        if(answer.action === "View Employees") { 
            view("employee");
        } else if(answer.action === "View Roles") {
            view("role");
        } else if(answer.action === "View Departments") {
            view("department");
        } else if(answer.action === "Add Employees") {
            addEmployees();
        } else if(answer.action === "Add Roles") {
            addRole();
        } else if(answer.action === "Add Departments") {
            addDepartment();
        } else if(answer.action === "Update Role") {
            updateRoles();
        } else if(answer.action === "Delete Employee") {
            deleteEmployees();
        } else if(answer.action === "Delete Role") {
            deleteRole();
        } else if(answer.action === "Delete Department") {
            deleteDepartment();
        } else if(answer.action === "Exit Program") {
            connection.end();
        }
    });

};

//View tables
function view(tableType) {
    let query = "SELECT * FROM " + tableType;
    connection.query(query, function(err, response) {
        if (err) throw err;
            console.table(response);
        promptUser();
    });
}; 

/**************************ADD FUNCTIONS******************************/
async function addEmployees() {
    let firstName = await textPrompt("First Name:");
    let lastName = await textPrompt("Last Name:");
    let role = await rolePrompt("What role will this employee have?");
    let idReturned = await getRoleIdByName(role);

    await connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [firstName.value, lastName.value, idReturned], (err, result) => {
        if (err) res.status(500);
        console.log(result);
    });
    promptUser();
};

async function addRole() {
    let roleName = await textPrompt("New Role Title:");
    let salary = await numberPrompt("Salary for Role:")
    let dept = await departmentPrompt("Department for New Role:");
    let idReturned = await getDepartmentIdByName(dept);

    await connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [roleName.value, salary.value, idReturned], (err, result) => {
        if (err) res.status(500);
        console.log(result);
    });
    promptUser();
}

async function addDepartment() {
    let deptName = await textPrompt("New Department Title:");
    
    await connection.query("INSERT INTO department (name) VALUES (?)", [deptName.value], (err, result) => {
        if (err) res.status(500);
        console.log(result);
    });
    promptUser();
}

async function updateRoles() {
    let employee = await employeePrompt("Which employee role do you wish to update?");
    let employeeIdReturned = await getEmployeeIdByName(employee);
    let newRole = await rolePrompt("What will their new role be?");
    let roleIdReturned = await getRoleIdByName(newRole);

    await connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleIdReturned, employeeIdReturned], (err, result) => {
        if (err) res.status(500);
        console.log(result)
    });
    promptUser();
};

/**************************DELETE FUNCTIONS******************************/
async function deleteEmployees() {
    let employee = await employeePrompt("What employee do you wish to remove?");

    await connection.query(`DELETE FROM employee WHERE last_name = ?`, [employee], function(err, result) {
        if (err) throw err;
        console.log("Deleted employee");
    });
    promptUser();
};

async function deleteRole() {
    let role = await rolePrompt("What employee do you wish to remove?");

    await connection.query(`DELETE FROM role WHERE title = ?`, [role], function(err, result) {
        if (err) throw err;
        console.log("Deleted role");
    });
    promptUser();
};

async function deleteDepartment() {
    let department = await departmentPrompt("What department do you wish to remove?");

    await connection.query(`DELETE FROM department WHERE name = ?`, [department], function(err, result) {
        if (err) throw err;
        console.log("Deleted department");
    });
    promptUser();
}

/**************************INQUIERER PROMPTS******************************/
function textPrompt(question) {
    return inquirer.prompt({
        name: "value",
        type: "input",
        message: question
    });
};

function numberPrompt(question) {
    return inquirer.prompt({
        name: "value",
        type: "number",
        message: question,
        validate: function(input) {
            if (!isNaN(input)) {
                return true;
            }
            return "Please enter a number value."
        }
    });
};

async function employeePrompt(question) {
    const allEmployeeNames = await getAllEmployeesByName();
    let employeeName = await inquirer.prompt({
        name: "value",
        type: "list",
        message: question,
        choices: allEmployeeNames
    });
    return employeeName.value;
}

async function departmentPrompt(question) {
    const allDepartmentNames = await getAllDepartmentsByName();
    let departmentName = await inquirer.prompt({
        name: "value",
        type: "list",
        message: question,
        choices: allDepartmentNames
    })
    return departmentName.value;
}

async function rolePrompt(question) {
    const allRoles = await getAllRoles();
    let role = await inquirer.prompt({
        name: "value",
        type: "list",
        message: question,
        choices: allRoles
    })
    return role.value;
};

/**************************GET FUNCTIONS******************************/
function getAllRoles() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM role", function (err, response) {
            if (err) reject(err);
            let selectionArr = [];
            for (let i = 0; i < response.length; i++) {
                selectionArr.push(response[i].title);
            }
            resolve(selectionArr);
            console.log(selectionArr);
        });
    });
};

function getAllEmployeesByName() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM employee", function (err, response) {
            if (err) reject(err);
            let selectionArr = [];
            for (let i = 0; i < response.length; i++) {
                selectionArr.push(response[i].last_name);
            }
            resolve(selectionArr);
            console.log(selectionArr);
        });
    });
};

function getAllDepartmentsByName() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM department", function (err, response) {
            if (err) reject(err);
            let selectionArr = [];
            for (let i = 0; i < response.length; i++) {
                selectionArr.push(response[i].name);
            }
            resolve(selectionArr);
            console.log(selectionArr);
        });
    });
};

function getDepartmentIdByName(givenDept) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM department", function (err, response) {
            if (err) reject(err);
            let resolution
            for (let i = 0; i < response.length; i++) {
                if (response[i].name === givenDept) {
                    resolution = response[i].id;
                };
            };  
            resolve(resolution);
        });
    }); 
};

function getEmployeeIdByName(givenName) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM employee", function (err, response) {
            if (err) reject(err);
            let resolution
            for (let i = 0; i < response.length; i++) {
                if (response[i].last_name === givenName) {
                    resolution = response[i].id;
                };
            };  
            resolve(resolution);
        });
    });       
};

function getRoleIdByName(givenTitle) {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM role", function (err, response) {
            if (err) reject(err);
            let resolution
            for (let i = 0; i < response.length; i++) {
                if (response[i].title === givenTitle) {
                    resolution = response[i].id;
                };
            };  
            resolve(resolution);
        });
    });       
};