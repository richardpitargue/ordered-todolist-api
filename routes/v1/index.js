const express = require('express');

const todoRouter = require('./todo.route');

const v1Router = express.Router();

v1Router.use('/todos', todoRouter);

module.exports = v1Router;
