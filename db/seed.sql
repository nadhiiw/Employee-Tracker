
use employees;

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Sales"),("Engineering"),("Finance"),("Legal");


-- EMPLOYEE ROLE SEEDS -------
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2),
      ("Legal Team Lead", 250000, 4),
      ("Accountant", 125000, 3),
      ("Sales Lead", 100000, 1),
      ("Salesperson", 80000, 1),
      ("Software Engineer", 120000, 2),
      ("Lawyer", 190000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jessica", "Haze", null, 1),
      ("Tiffany", "Patric", null, 2),
      ("Mia","Lam",null,3),
      ("Bently", "Lao", 1, 4),
      ("Chris", "Melby", 4, 5),
      ("Jason", "Baker", 1, 6),
      ("Tom", "Nice", 2, 7);