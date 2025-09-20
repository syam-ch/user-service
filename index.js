const express = require("express");
const app = express();

const users = [{ id: 1, name: "Siva" }, { id: 2, name: "Demo User" }];

app.get("/users", (req, res) => res.json(users));

app.listen(3001, () => console.log("User Service running on port 3001"));
