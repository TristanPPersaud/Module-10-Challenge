\c employee_db;

INSERT INTO department (name)
VALUES 
('Sales'),
('Quality Assurance'),
('Human Resources'),
('Accounting'),
('Administration');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 60000, 1),
('QA Engineer', 60000, 2),
('HR Representative', 50000, 3),
('Accountant', 50000, 4),
('Manager', 80000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Michael', 'Scott', 5, NULL),
('Jim', 'Halbpert', 1, 1),
('Creed', 'Bratton', 2, 1),
('Kelly', 'Kapoor', 3, 1),
('Kevin', 'Malone', 4, 1);

