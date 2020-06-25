//CONSIDER CHANGING NAMES OF SQL FILES
//CONSIDER CHANGING NAMES OF DATABASES
//CONSIDER NAMES AND ORDER OF FUNCTIONS,
//RMEMBER TO CHANGE PASSWORD WHEN UPLOADING


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
            viewEmployees();
        } else if(answer.action === "View Roles") {
            viewRoles();
        } else if(answer.action === "View Departments") {
            viewDepartments();
        } else if(answer.action === "Add Employees") {
            addEmployees();
        } else if(answer.action === "Add Roles") {
            addRole();
        } else if(answer.action === "Add Departments") {
            console.log("add department");
        } else if(answer.action === "UPDATE") {
            console.log("update: Departments, roles or employees");
        } else if(answer.action === "DELETE") {
            console.log("delete: Departments, roles or employees");
        } else if(answer.action === "Exit Program") {
            connection.end();
        }
    });

};

//View employees
function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(err, response) {
        if (err) throw err;
            console.table(response);
        promptUser();
    });
};

//View roles
function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function(err, response) {
        if (err) throw err;
            console.table(response);
        promptUser();
    });
};

//View departments
function viewDepartments() {
    let query = "SELECT * FROM department";
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
    

    promptUser();
};

async function addRole() {
    //inquirer text input for title
    //inquirer decimal input for salary
    //inquirer list input for department
    //increment id

    connection.query("SELECT title FROM role", function(err, response) {
        if (err) throw err;
            let titles = [];
            for(let i = 0; i < response.length; i++) {
                titles.push(response[i].title);
            }
            console.log(titles);
            console.log(typeof titles);
            // console.table(response);
            // console.log(response.length);
        promptUser();
    });

}

async function addDepartment() {
    //inquirer text input for title
    //increment id
}

async function updateRoles() {
    //inquirer prompt a list of each part of current roles for user to select
    //inquirer prompt user to overwrite part of role that user wishes to change
}



// INQUIRER PROMPTS
function textPrompt(question) {
    return inquirer.prompt({
        name: "value",
        type: "input",
        message: question
    });
};

async function rolePrompt(question) {
    const allRoles = await getAllRoles();
    let role = await inquirer.prompt({
        name: "value",
        type: "list",
        message: question,
        choices: allRoles
    });
};

function getAllRoles() {
return new Promise(function(resolve, reject) {
    connection.query("SELECT title FROM role", function(err, response) {
        if (err) reject(err);
        let titles = [];
        for(let i = 0; i < response.length; i++) {
            titles.push(response[i].title);
        }
        resolve(titles);
    });
});
};



