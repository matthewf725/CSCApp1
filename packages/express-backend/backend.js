// packages/express-backend/backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// IMPORTANT: these are the starter-provided service functions
// (you just copied them from the instructor's repo into ./models)
import {
  findUsers,
  findUserById,
  addUser,           // or createUser depending on the starter; both patterns are common
  deleteUserById,
} from "./models/user-services.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// --- DB connection ---
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cscapp";
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users
// supports: /users, /users?name=, /users?job=, and /users?name=&job=
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  // Build a combined filter (this satisfies the “name+job at once” requirement)
  const filter = {};
  if (name) filter.name = name;
  if (job)  filter.job  = job;

  // NOTE: starter services return a Mongoose Query (thenable)
  findUsers(filter)
    .then((list) => res.send({ users_list: list }))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  findUserById(id)
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

  // Depending on the starter you pasted, this might be addUser(...) or createUser(...)
  addUser({ name, job })
    .then((created) => res.status(201).send(created))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal server error.");
    });
});

// DELETE /users/:id  (MUST use DB: findByIdAndDelete in the service)
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  deleteUserById(id)
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
