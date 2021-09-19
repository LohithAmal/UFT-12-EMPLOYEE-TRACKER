USE employeesData;

INSERT INTO department(name)
VALUE ("sales");

INSERT INTO department(name)
VALUE ("Engineering");

INSERT INTO department(name)
VALUE ("Finance");

INSERT INTO department(name)
VALUE ("Legal");



INSERT INTO role (title,salary, department_id)
VALUES("Sales Lead", 100000, 1);
INSERT INTO role (title,salary, department_id)
VALUES("Lead Engineer", 150000, 2);
INSERT INTO role (title,salary, department_id)
VALUES("Software Engineer", 120000, 2);
INSERT INTO role (title,salary, department_id)
VALUES("Accountant", 10000, 3);
INSERT INTO role (title,salary, department_id)
VALUES("Legal Team Lead", 250000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Marcin","Jerzyk", 1, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Amal","Lohith", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Enrique","Rivas", 3, null );

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jaswinder","Seehra", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Susanne"," Roca", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Heli","Perera", 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Tulasiha","Ramalingam", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Marcia","Williams", 1, 2);




