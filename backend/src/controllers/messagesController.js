const { WebClient } = require('@slack/web-api');
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const messagesController = {
  async getMessages(req, res) {
    try {
      const { channelId } = req.params;
      
      // Get channel history
      const result = await slackClient.conversations.history({
        channel: channelId,
        limit: 100
      });

      // Format messages
      const messages = result.messages.map(message => ({
        ts: message.ts,
        text: message.text,
        user: message.user,
        type: message.type
      }));

      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  },

  async sendMessage(req, res) {
    try {
      const { channelId, text } = req.body;
      
      // Send message
      const result = await slackClient.chat.postMessage({
        channel: channelId,
        text: text
      });

      res.json({
        ts: result.ts,
        text: result.text,
        user: result.user,
        type: result.type
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  }
};

module.exports = messagesController; 