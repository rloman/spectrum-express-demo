const port = 3000;

const mysql = require("mysql");
const express = require("express")();
const bp = require("body-parser");
express.use(bp.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "aydin",
  password: "zegikniet",
  database: "molveno"
});

connection.connect((err) => { if (err) throw err; });

function createNewUser(user) {
  return new Promise( (resolve, reject) => {
    connection.query("INSERT INTO guest SET ?", user, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
  });
}

function updateUser(id, name, username, email) {
  connection.query("update `users` set `name` = ?, `username` = ?, `email` = ? where `id` = ?;", [name, username, email, id], (err, result) => {
    if (err) throw err;
  });
}

function deleteUser(id) {
  connection.query("delete from `users` where `id` = ?;", id, (err, result) => {
    if (err) throw err;
  });
}

// IK WIL DUS: de connection.query() in een andere functie hebben, zoals bij post, put, etc
express.get("/users/list", (request, response) => {
  connection.query("select * from users;", (err, result) => {
    if (err) throw err;
    response.send(result);
  });
});

// eerst testen met Postman
express.get('/users/:id', (request, response) => {
  const id = +request.params.id;
  connection.query('select * from users where id=?;', [id], (err, result) => {
      if(err) throw err;
      response.send(result);
  });
});

express.post("/users/new", async (request, response) => {
  console.log(request.ip + ": Added new user");
  var body = request.body;

  const sqlresult = await createNewUser(body);
  response.send(sqlresult);
});

express.put("/users/update", (request, response) => {
  console.log(request.ip + ": Updated an existing user");
  var body = request.body;

  updateUser(body["id"], body["name"], body["username"], body["email"]);
  response.send("Success");
});

express.delete("/users/delete", (request, response) => {
  console.log(request.ip + ": Deleted a user");
  var body = request.body;

  deleteUser(body["id"]);
  response.send("Success");
});

express.listen(port);
console.log("Server listening on port: " + port);