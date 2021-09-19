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

  const query =
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
