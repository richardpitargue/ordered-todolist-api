const logger = require('../config/logger');
const TodoListItem = require('../models/TodoListItem');
const Counter = require('../models/Counter');
const { log } = require('winston');

exports.createTodoItem = async (req, res) => {
  try {
    const { details } = req.body;
    const currentCounter = await Counter.findOneAndUpdate(
      {
        collectionName: TodoListItem.collection.collectionName,
      },
      {
        $inc: {
          currentSequence: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    const item = new TodoListItem({
      details,
      position: currentCounter.currentSequence,
    });
    const newItem = await item.save();
    res.status(201).json({
      status: 'success',
      data: newItem,
    });
  } catch (error) {
    logger.error('todoController.createTodo', error);
    res.status(400).json({
      status: 'fail',
      message: 'Failed in creating new todo item.',
    });
  }
};

exports.getAllTodoItems = async (req, res) => {
  try {
    const items = await TodoListItem.find({}).sort({ position: 'asc' });
    res.status(200).json({
      status: 'success',
      data: items,
    });
  } catch (error) {
    logger.error('todoController.getAllTodoItems', error);
    res.status(400).json({
      status: 'fail',
      message: 'Failed in fetching all todo items.',
    });
  }
};

exports.getTodoItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await TodoListItem.findById(itemId);
    res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    o;
    logger.error('todoController.getTodoItem', error);
    res.status(400).json({
      status: 'fail',
      message: 'Failed in fetching a todo item.',
    });
  }
};

exports.updateTodoItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { details, position } = req.body;

    const item = await TodoListItem.findById(itemId);
    if (!item) {
      res.status(404).send({
        status: 'fail',
        message: 'Todo item not found.',
      });
      return;
    }

    if (details !== undefined) {
      item.details = details;
    }
    if (position !== undefined) {
      await TodoListItem.updateMany(
        { position: { $gte: position } },
        { $inc: { position: 1 } }
      );
      const maxPosition = await TodoListItem.find({}).sort({ age: -1 }).limit(1);
      await Counter.updateOne(
        {
          collectionName: TodoListItem.collection.collectionName,
        },
        {
          currentSequence: maxPosition[0].position + 1,
        }
      );
      item.position = position;
    }
    await item.save();
    res.status(200).send({
      status: 'success',
      data: item,
    });
  } catch (error) {
    logger.error('todoController.updateTodoItem', error);
    res.status(400).json({
      status: 'fail',
      message: 'Failed in updating a todo item.',
    });
  }
};

exports.deleteTodoItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await TodoListItem.findByIdAndRemove(itemId);
    if (!item) {
      res.status(404).send({
        status: 'fail',
        message: 'Todo item not found.',
      });
      return;
    }

    res.status(200).send({
      status: 'success',
      message: 'Todo item successfully deleted.',
      data: item
    });
  } catch (error) {
    logger.error('todoController.deleteTodoItem', error);
    res.status(400).json({
      status: 'fail',
      message: 'Failed in deleting a todo item.',
    });
  }
};
