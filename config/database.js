var mysql_package = require('mysql');

var connection_data = mysql_package.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database:"vm_new"
});
connection_data.connect(function(error) {
  connection_data.query("SELECT roles.*, role_has_permissions.*  FROM roles   JOIN role_has_permissions ON roles.id = role_has_permissions.role_id;", function (error, result) {
  let text = ""; 
    console.log(result ,"22222");
  });

})