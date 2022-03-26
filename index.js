import express from "express";
const app = express();
import md5 from "md5"

import db from "./database/database.js"

require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// Default response for any other request

// Insert here other API endpoints
app.get("/api/users", (req, res, next) => {
  var sql = "select * from user";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/user/:id", (req, res, next) => {
  var sql = "select * from user where id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/user/", (req, res, next) => {
    var errors = [];
  if (!req.body.password) {
    errors.push("No password specified");
}
  if (!req.body.email) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
}
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };
  var sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
  var params = [data.name, data.email, data.password];
  db.run(sql, params, function (err, result) {
      if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
        message: "success",
        data: data,
      id: this.lastID,
    });
  });
});

app.patch("/api/user/:id", (req, res, next) => {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null,
};
  db.run(
    `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
           [data.name, data.email, data.password, req.params.id],
    function (err, result) {
        if (err) {
        res.status(400).json({ error: res.message });
        return;
    }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
    });
    }
    );
});

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        "DELETE FROM user WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
          res.status(400).json({ error: res.message });
        return;
    }
    res.json({ message: "deleted", changes: this.changes });
    }
  );
});

app.use(function (req, res) {
  res.status(404).json({ message: "Url Not found!" });
});