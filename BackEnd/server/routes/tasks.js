const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

//  Create Task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      dueDate,
      status
    });

    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
  res.status(500).json({ msg: err.message });
  }
});

//  Get All Tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
  res.status(500).json({ msg: err.message });
  }
});

//  Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Task not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
  res.status(500).json({ msg: err.message });
  }
});

//  Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
  res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
