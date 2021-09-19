// ============>
// dependencies
// ==================
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// ========================>
// database connection if succesfull console('connect')
// =====================================================

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Quality8055]",
  database: "employeesDB"
});

//=================>
// connect to server and sql
// ========================= 
connection.connect( (err) => {
  if (err) throw err; 
// ==================>
// run app function if the connection succesfull
//============================================== 
 runApp();
});

// ===============>
// user prompt to select what they need to execute
// ===============================================

function runApp() {

  inquirer.prompt({
    type: "rawlist",
    name: "task",
    message: "Would you like to do?",
    choices: [
      'View Employees',
      'View Employees by Department',
      "Add Employee",
      "Remove Employees",
      "Update Employee Role",
      "Add Role",
      "End"]
})
// =====================>
// once user select the prompt according to the selection execute corresponding functions.
// =============================================================================
.then(function ({ task }) {
  switch (task) {
    case "View Employees":
      viewEmployee();
      break;
    case "View Employees by Department":
      viewEmployeeByDepartment();
      break;
    
    case "Add Employee":
      addEmployee();
      break;
    case "Remove Employees":
      removeEmployees();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "Add Role":
      addRole();
      break;
  // ====================>
  // incase user select END this will end connection
  // ===============================================
    case "End":
      connection.end();
      break;
  }
});
}

// ====================>
// this function execute when user select to viewemployee()
// ==============================================================
  function viewEmployee(){
  console.log("Viewing employees\n");

  let query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query,  (err, res)=> {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed!\n");

    runApp();
  });
}

//===============================>
//this function execute when user select to viewemployeebydepartment
// =================================================================

function viewEmployeeByDepartment() {
  console.log("Viewing employees by department\n");

  let query =
    `SELECT d.id, d.name, r.salary AS budget
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name`

  connection.query(query, (err, res)=> {
    if (err) throw err;

    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));
    console.table(res);
    console.log("Department view succeed!\n");

    promptDepartment(departmentChoices);
  });
  
}

// ======================>
// department choices user to select on inquirer prompt
// =====================================================

function promptDepartment(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "departmentId",
        message: "Which department would you choose?",
        choices: departmentChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  WHERE d.id = ?`

      connection.query(query, answer.departmentId,  (err, res) =>{
        if (err) throw err;

        console.table("response ", res);
        console.log(res.affectedRows + "Employees are viewed!\n");

        runApp();
      });
    });
}


//===============================>
//this function execute when user select to addEmployee
// ====================================================

function addEmployee() {
  console.log("Inserting an employee!")

  let query =
    `SELECT r.id, r.title, r.salary 
      FROM role r`

  connection.query(query, (err, res) => {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
  });
}

// =====================>
// inquirer user selection for rolechoices
// =======================================


function promptInsert(roleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "enter Employee first name !"
      },
      {
        type: "input",
        name: "last_name",
        message: "enter Employee second name !"
      },
      {
        type: "list",
        name: "roleId",
        message: "enter Employee role",
        choices: roleChoices
      }
    ])
    .then((answer)=> {
      console.log(answer);
// =======================================>
// insert the user inserted employee information to database.
// ==========================================================
      let query = `INSERT INTO employee SET ?`
      connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        (err, res)=> {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          runApp();
        });
      });
    }

  //===============================>
//this function execute when user select to removeEmployee
// =======================================================

function removeEmployees() {
  console.log("Deleting an employee");

  let query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  connection.query(query,  (err, res)=> {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
}
  
// =========================>
// inquirer prompt for user to input which employee need to remove
// ===============================================================

function promptDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      let query = `DELETE FROM employee WHERE ?`;

      connection.query(query, { id: answer.employeeId },  (err, res)=> {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        runApp();
      });
      
    });
}

 //===============================>
//this function execute when user select to updateEmployee
// =======================================================


function updateEmployeeRole() { 
  employeeArray();

}

function employeeArray() {
  console.log("Updating an employee");

 let query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query,  (err, res)=> {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    console.log("employeeArray To Update!\n")

    roleArray(employeeChoices);
  });
}


function roleArray(employeeChoices) {
  console.log("a role is updating!!");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`
  let roleChoices;

  connection.query(query, (err, res)=> {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    console.log("roleArray to Update!\n")

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}


function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
      {
        type: "rawlist",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      let query = `UPDATE employee SET role_id = ? WHERE id = ?`

      connection.query(query,
        [ answer.roleId,  
          answer.employeeId
        ],
        (err, res) => {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          runApp();
        });
      
    });
}


 //===============================>
//this function execute when user select to addRole
// =======================================================

function addRole() {

  let query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

  connection.query(query,  (err, res)=> {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Department array!");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Role title?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then( (answer)=> {

      var query = `INSERT INTO role SET ?`

      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      },
        (err, res)=> {
          if (err) throw err;

          console.table(res);
          console.log("Role Inserted!");

          runApp();
        });

    });
}