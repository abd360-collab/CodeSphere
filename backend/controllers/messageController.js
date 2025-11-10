const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const Project = require('../models/Project');

const getMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ project: req.params.id })
      .populate('sender', 'username email')
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { message } = req.body;

    const newMessage = new Message({
      project: req.params.id,
      sender: req.user._id,
      message
    });

    await newMessage.save();
    await newMessage.populate('sender', 'username email');

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMessages,
  createMessage
};
