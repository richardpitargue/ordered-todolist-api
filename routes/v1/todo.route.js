const express = require('express');

const todoController = require('../../controllers/todo.controller');

const todoRouter = express.Router();

todoRouter.post('/', todoController.createTodoItem);
todoRouter.get('/', todoController.getAllTodoItems);
todoRouter.get('/:itemId', todoController.getTodoItem);
todoRouter.put('/:itemId', todoController.updateTodoItem);
todoRouter.delete('/:itemId', todoController.deleteTodoItem);

module.exports = todoRouter;
