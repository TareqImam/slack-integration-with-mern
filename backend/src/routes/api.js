const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversationsController');
const messagesController = require('../controllers/messagesController');

// Conversations
router.get('/conversations', conversationsController.getConversations);
router.post('/channels/join', conversationsController.joinChannel);

// Messages
router.get('/messages/:channelId', messagesController.getMessages);
router.post('/messages', messagesController.sendMessage);

module.exports = router; 