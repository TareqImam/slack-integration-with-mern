const express = require('express');
const router = express.Router();
const { getMessages, postMessage, joinChannel, getConversations } = require('../controllers/slackController');

router.get('/messages', getMessages);

router.post('/messages', postMessage);

router.post('/channels/join', joinChannel);

router.get('/conversations', getConversations);

module.exports = router; 