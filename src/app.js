const express = require("express");
const db = require("./ultils/database");
const TodoLists = require("./models/todoLists.models");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());

db.authenticate()
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.error(err));

db.sync()
  .then(() => console.log("Base de datos sincroninzada"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("servidor funcionando");
});

app.get("/api/v1/todos/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    const excludeAttributes = {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    };
    if (id) {
      const todo = await TodoLists.findByPk(id, excludeAttributes);
      res.status(200).json(todo);
    } else {
      const todoLists = await TodoLists.findAll(excludeAttributes);
      res.status(200).json(todoLists);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/api/v1/todos", async (req, res) => {
  try {
    const newTodo = req.body;
    await TodoLists.create(newTodo);
    res.status(201).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

app.put("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    await TodoLists.update(
      { title, description, completed },
      { where: { id } }
    );
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

app.delete("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TodoLists.destroy({ where: { id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

const PORT = process.PORT || 3000;
app.listen(PORT, () => {
  `el servidor esta escuchando en el puerto ${PORT}`;
});
