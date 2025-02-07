\c employee_db

INSERT INTO departments (name)
VALUES 
(Sales),
(Quality Assurance),
(Human Resources),
(Accounting),
(Administration);

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 60000, 1),
('QA Engineer', 60000, 2),
('HR Representative', 50000, 3),
('Accountant', 50000, 4),
('Manager', 80000, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
('Jim', 'Halbpert', 1, 5),
('Creed', 'Bratton', 2, 5),
('Kelly', 'Kapoor', 3, 5),
('Kevin', 'Malone', 4, 5),
('Michael', 'Scott', 5, NULL);
