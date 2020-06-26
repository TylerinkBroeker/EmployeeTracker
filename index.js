//CONSIDER CHANGING NAMES OF SQL FILES
//CONSIDER CHANGING NAMES OF DATABASES
//CONSIDER NAMES AND ORDER OF FUNCTIONS,
//RMEMBER TO CHANGE PASSWORD WHEN UPLOADING

/************************     GET FUNCTIONALITY IN DELETE AND ADD EMPLOYEE FUNCTIONS      ***********************/


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
            "UPDATE",
            "DELETE",
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
            employeePrompt();
        } else if(answer.action === "Add Departments") {
            console.log("add department");
        } else if(answer.action === "UPDATE") {
            console.log("update: Departments, roles or employees");
        } else if(answer.action === "DELETE") {
            deleteEmployees();
        } else if(answer.action === "Exit Program") {
            connection.end();
        }
    });

};

//View table
function view(tableType) {
    let query = "SELECT * FROM " + tableType;
    connection.query(query, function(err, response) {
        if (err) throw err;
            console.table(response);
        promptUser();
    });
};

//Add Employees
async function addEmployees() {
    let firstName = await textPrompt("First Name:");
    let lastName = await textPrompt("Last Name:");
    let role = await rolePrompt("What role will this employee have?");
    let idReturned = await getRoleIdByName(role);

    await connection.query("INSERT INTO employee SET ?", {
        first_name: firstName,
        last_name: lastName,
        role_id: idReturned,
        manager_id: null
    })
    promptUser();
};

async function addRole() {
    //inquirer text input for title
    //inquirer decimal input for salary
    //inquirer list input for department
    //increment id
}

async function addDepartment() {
    //inquirer text input for title
    //increment id
}

async function updateRoles() {
    //inquirer prompt a list of each part of current roles for user to select
    //inquirer prompt user to overwrite part of role that user wishes to change
}

//Delete employees
async function deleteEmployees() {
    let employee = await employeePrompt("What employee do you wish to remove?");
    
    await connection.query(`DELETE FROM employee WHERE last_name = ${employee}`, function(err, result) {
        if (err) throw err;
        console.log("Deleted employee");
    })
}




// INQUIRER PROMPTS
function textPrompt(question) {
    return inquirer.prompt({
        name: "value",
        type: "input",
        message: question
    });
};

async function employeePrompt(question) {
    const allEmployeeNames = await getAllEmployeesByName();
    let employeeName = await inquirer.prompt({
        name: "value",
        type: "list",
        message: question,
        choices: allEmployeeNames
    })
    return employeeName.value;
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


//get functions
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
    })        
};