const express = require("express");
const advancedResults = require("../middlewares/advancedResult");
const Todo = require("../models/Todo");
const {protect, authorize} = require("../middlewares/authentication");

const {
    deleteTodo,
    createTodo,
    getTodo,
    getTodos,
    updateTodo,
    uploadTodoImage
} = require("../controllers/todos");

const router = express.Router();

router.route("/")
    .get(protect, advancedResults(Todo), getTodos)
    .post(protect, createTodo);

router.route("/:id")
    .get(protect, getTodo)
    .put(protect, updateTodo)
    .delete(protect, deleteTodo);

router.route("/:id/image")
    .put(protect, uploadTodoImage);

module.exports = router;
