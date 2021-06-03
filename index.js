
const config = require("./config");
const { prompt } = require("inquirer");
require("console.table");

const art = require("asciiart-logo")

// Ask main questions
async function mainQuestions() {
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "ALL_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "ALL_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "View All Roles",
                    value: "ALL_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "ALL_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]);

    // Get answer
    switch (choice) {
        case "ALL_EMPLOYEES":
            return allEmployees();
        case "ALL_ROLES":
            return allRoles();
        case "ALL_DEPARTMENTS":
            return allDepartments();
        case "ALL_EMPLOYEES_BY_DEPARTMENT":
            return allEmployeesByDepartment();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "ADD_ROLE":
            return addRole();
        case "REMOVE_EMPLOYEE":
            return removeEmployee();
        case "REMOVE_DEPARTMENT":
            return removeDepartment();
        case "REMOVE_ROLE":
            return removeRole();
        case "UPDATE_EMPLOYEE_ROLE":
            return updateEmployeeRole();
        case "UPDATE_EMPLOYEE_MANAGER":
            return updateEmployeeManager();
        case "VIEW_EMPLOYEES_BY_MANAGER":
            return allEmployeesByManager();
        default:
            return quit();
    }
}

// Create quit function
function quit() {

    console.log(art({
        name: "GOODBYE!",
        font: "DOS Rebel",
        borderColor: 'bold-red',
        logoColor: 'bold-green'}).render()
        );

    process.exit();
}

// Show all employees function
async function allEmployees() {
    const employees = await config.allEmployees();

    // Get employees database
    console.table(employees);

    mainQuestions();
}

// Show all roles function
async function allRoles() {
    const roles = await config.allRoles();

    console.table(roles);

    mainQuestions();
}

// Show all departments function
async function allDepartments() {
    const departments = await config.allDepartments();

    console.table(departments);

    mainQuestions();
}

// Create add employee function
async function addEmployee() {
    const roles = await config.allRoles();
    const employees = await config.allEmployees();

    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
    });

    employee.role_id = roleId;

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managerChoices.unshift({ name: "None", value: null });

    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
    });

    employee.manager_id = managerId;

    await config.createEmployee(employee);

    console.log(
        `Added ${employee.first_name} ${employee.last_name} to the database`
    );

    mainQuestions();
}

// Create add department function
async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);

    await config.createDepartment(department);

    console.log(`Added ${department.name} to the database`);

    mainQuestions();
}

// Create add role function
async function addRole() {
    const departments = await config.allDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const role = await prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        }
    ]);

    await config.createRole(role);

    console.log(`Added ${role.title} to the database`);

    mainQuestions();
}

// Remove employee from table function
async function removeEmployee() {
    const employees = await config.allEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices
        }
    ]);

    await config.removeEmployee(employeeId);

    console.log("Employee is removed");

    mainQuestions();
}

// Remove role from table function
async function removeRole() {
    const roles = await config.allRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message:
                "Which role do you want to remove?",
            choices: roleChoices
        }
    ]);

    await config.removeRole(roleId);

    console.log("Role is removed");

    mainQuestions();
}

// Remove department from table function
async function removeDepartment() {
    const departments = await config.allDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message:
            "Which department would you like to remove?",
        choices: departmentChoices
    });

    await config.removeDepartment(departmentId);

    console.log(`Department is removed`);

    mainQuestions();
}

// Show all employees by department function
async function allEmployeesByDepartment() {
    const departments = await config.allDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices
        }
    ]);

    const employees = await config.allEmployeesByDepartment(departmentId);

    console.table(employees);

    mainQuestions();
}

// Create a function to update an employee role
async function updateEmployeeRole() {
    const employees = await config.allEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        }
    ]);

    const roles = await config.allRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
            choices: roleChoices
        }
    ]);

    await config.updateEmployeeRole(employeeId, roleId);

    console.log("Updated employee's role");

    mainQuestions();
}

// Create a function to update an employee's manager
async function updateEmployeeManager() {
    const employees = await config.allEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager do you want to update?",
            choices: employeeChoices
        }
    ]);

    const managers = await config.allPossibleManagers(employeeId);

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message:
                "Which employee do you want to set as manager for the selected employee?",
            choices: managerChoices
        }
    ]);

    await config.updateEmployeeManager(employeeId, managerId);

    console.log("Updated employee's manager");

    mainQuestions();
}

// Show all employees by manager function
async function allEmployeesByManager() {
    const managers = await config.allEmployees();

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee do you want to see direct reports for?",
            choices: managerChoices
        }
    ]);

    const employees = await config.allEmployeesByManager(managerId);

    if (employees.length === 0) {
        console.log("The selected employee has no direct reports");
    } else {
        console.table(employees);
    }

    mainQuestions();
}

// Create logo
function addArt() {

    console.log(art({
        name: "Employee Tracker",
        font: "DOS Rebel",
        borderColor: 'bold-red',
        logoColor: 'bold-green'}).render()
        );
  
    mainQuestions();
}

addArt();