import inquirer from 'inquirer';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();


const db = new Pool ({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});




async function mainMenu() {
    try{
    const answer = inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Please select an option',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }]).then(answer => {
            switch (answer.action) {
                case 'View all departments':
                   viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('See you next time!');
                    
                    process.exit();
            }
            
        });
} catch (error) {
    if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.error('Prompt couldn\'t be rendered in the current environment');
    } else if (error instanceof ExitPromptError) {
        // Handle the exit prompt error
        console.log('Prompt closed. Exiting application...');
        await db.end(); // Close the database connection
        process.exit();
    } else {
        // Handle other errors
        console.error('An error occurred:', error);
    }

}
}

const viewDepartments = async () => {
    try {
        const query = 'SELECT * FROM department';
        const result = await db.query(query);
        console.table(result.rows);
    } catch (error) {
        console.error('Error retrieving departments:', error.stack);
    }
    mainMenu();
};

const viewRoles = async () => {
    try {
        const query = 'SELECT * FROM role';
        const result = await db.query(query);
        console.table(result.rows);
    } catch (error) {
        console.error('Error retrieving roles:', error.stack);
    }
    mainMenu();
};

const viewEmployees = async () => {
    try {
        const query = 'SELECT * FROM employees';
        const result = await db.query(query);
        console.table(result.rows)
    } catch (error) {
        console.error('Error retrieving employees:', error.stack);
    }
    mainMenu();
};

const addDepartment = async () => {
    const {name} = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]);
    
    try {
        const query = 'INSERT INTO department (name) VALUES ($1)'; // ($1) Represents placeholder that will be filled with a parameter entered by user.
        await db.query(query, [name]);
        console.table(`Department ${name} has been successfully added.`);
    } catch (error) {
        console.error('Error adding department:', error.stack);
    }
    mainMenu();
};

const addRole = async () => {
   const {title, salary, department_id} = await inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for this role:',
        validate: (input) => {
            const number = parseFloat(input);
            return !isNaN(number) && number > 0 ? true : 'Please enter a valid salary.';
        }
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'Enter this roles department ID:',
        validate: (input) => {
            return !isNaN(input) ? true : 'Please input a valid department ID.'
        }
    }
   ]);
    
   try {
    const result = await db.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
        [title, salary, department_id]
    );
    console.log('Role added successfully:', result);
} catch (error) {
    console.error('Error adding role:', error);
}
    mainMenu();
};

const addEmployee = async () => {
    const {first_name, last_name, role_id, manager_id} = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'type',
            name: 'role_id',
            message: 'Enter the role ID for this employee:',
            validate: (input) => {
                return !isNaN(input) ? true : 'Please input a valid role ID.'
            }
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID for this employee. If the employee does not have a manager ID leave this field blank.',
            validate: (input) => {
                return input === '' || !isNaN(input) ? true : 'Please enter a valid manager ID or leave the field blank.'
            }
        }
    ])
    
    try {
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        await db.query(query, [first_name, last_name, role_id, manager_id]);
        console.table(`Employee ${first_name} ${last_name} has been successfully added.`);
    } catch (error) {
        console.error('Error adding employee:', error.stack);
    }
    mainMenu();
};

const updateEmployeeRole = async () => {
    try {
        let validInput = false;
        let id, new_role_id;
        
        while (!validInput) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'id',
                    message: 'Enter the ID for the employee whose role you want to update:',
                    validate: (input) => {
                        if (!input) {
                            return 'Employee ID cannot be empty.';
                        }
                        if (isNaN(input)) {
                            return 'Employee ID must be a number.';
                        }
                        return true;
                    },
                },
                {
                    type: 'input',
                    name: 'new_role_id',
                    message: 'Enter the new role ID for the employee:',
                    validate: (input) => {
                        if (!input) {
                            return 'New role ID cannot be empty.';
                        }
                        if (isNaN(input)) {
                            return 'New role ID must be a number.';
                        }
                        return true;
                    },
                },
            ]);

            id = answers.id;
            new_role_id = answers.new_role_id;

            validInput = true; 
        }

        const query = 'UPDATE employees SET role_id = $1 WHERE id = $2';
        await db.query(query, [new_role_id, id]);
        console.log(`Employee role updated successfully.`);
    } catch (error) {
        console.error('Error updating employee role:', error.stack);
    }
    mainMenu();
};

mainMenu();


