DROP DATABASE IF EXISTS employee_db; -- Drops employee_db database if it already exists. 

CREATE DATABASE employee_db; -- Creates employee_db database. 

\c employee_db; -- Uses employee_db; 

CREATE TABLE department ( -- Creates department table 
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (manager_id) INTEGER REFERENCES employees(id) ON DELETE SET NULL, 
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);

