const { WebClient } = require('@slack/web-api');
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const conversationsController = {
  async getConversations(req, res) {
    try {
      // Get all public channels
      const publicChannels = await slackClient.conversations.list({
        types: 'public_channel',
        exclude_archived: true
      });

      // Get all private channels the bot is in
      const privateChannels = await slackClient.conversations.list({
        types: 'private_channel',
        exclude_archived: true
      });

      // Get all DMs
      const dms = await slackClient.conversations.list({
        types: 'im',
        exclude_archived: true
      });

      // Get all group DMs
      const groupDms = await slackClient.conversations.list({
        types: 'mpim',
        exclude_archived: true
      });

      // Combine and format all conversations
      const conversations = [
        ...publicChannels.channels.map(channel => ({
          id: channel.id,
          name: channel.name,
          is_private: false,
          is_im: false,
          is_mpim: false,
          num_members: channel.num_members
        })),
        ...privateChannels.channels.map(channel => ({
          id: channel.id,
          name: channel.name,
          is_private: true,
          is_im: false,
          is_mpim: false,
          num_members: channel.num_members
        })),
        ...dms.channels.map(dm => ({
          id: dm.id,
          name: dm.user,
          is_private: true,
          is_im: true,
          is_mpim: false,
          num_members: 2
        })),
        ...groupDms.channels.map(group => ({
          id: group.id,
          name: group.name,
          is_private: true,
          is_im: false,
          is_mpim: true,
          num_members: group.num_members
        }))
      ];

      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  },

  async joinChannel(req, res) {
    try {
      const { channelId } = req.body;
      
      // Join the channel
      await slackClient.conversations.join({
        channel: channelId
      });

      res.json({ message: 'Successfully joined channel' });
    } catch (error) {
      console.error('Error joining channel:', error);
      res.status(500).json({ message: 'Failed to join channel' });
    }
  }
};

module.exports = conversationsController; 