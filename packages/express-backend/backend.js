// packages/express-backend/backend.js
import express from "express";
import cors from "cors";
import userServices from "./models/user-services.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users (supports none, name, job, and name+job combined)
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userServices
    .getUsers(name, job)
    .then((list) => res.send({ users_list: list }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userServices
    .findUserById(id)
    .then((doc) => {
      if (!doc) return res.status(404).send("Resource not found.");
      res.send(doc);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Invalid id.");
    });
});

// POST /users
app.post("/users", (req, res) => {
  const { name, job } = req.body || {};
  if (!name || !job) return res.status(400).send("Invalid user payload.");
  userServices
    .addUser({ name, job })
    .then((created) => res.status(201).send(created))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userServices
    .deleteUserById(id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("Resource not found.");
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Invalid id.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
