const web = require('../config/slack');

const getMessages = async (req, res) => {
    const { channel } = req.query;
    console.log('Received request to fetch messages for channel:', channel);

    if (!channel) {
        console.log('Error: Channel ID is missing');
        return res.status(400).json({ error: 'Channel ID is required' });
    }

    try {
        // First, get channel info to check its type
        console.log('Getting channel info...');
        const channelInfo = await web.conversations.info({
            channel: channel
        });

        if (!channelInfo.ok || !channelInfo.channel) {
            console.error('Failed to get channel info:', channelInfo.error);
            return res.status(403).json({ 
                error: `Cannot access channel: ${channelInfo.error}`,
                details: channelInfo
            });
        }

        // If it's a private channel, we need to join it first
        if (channelInfo.channel.is_private && !channelInfo.channel.is_im) {
            console.log('Channel is private, attempting to join...');
            const joinResult = await web.conversations.join({
                channel: channel
            });

            if (!joinResult.ok && joinResult.error !== 'already_in_channel') {
                console.error('Failed to join private channel:', joinResult.error);
                return res.status(403).json({ 
                    error: `Cannot access private channel: ${joinResult.error}`,
                    details: joinResult
                });
            }
        }

        console.log('Attempting to fetch messages from Slack API...');
        let result;
        
        if (channelInfo.channel.is_im) {
            // For direct messages, use conversations.history with the correct parameters
            result = await web.conversations.history({
                channel: channel,
                limit: 50,
                inclusive: true
            });
        } else {
            // For channels, use conversations.history
            result = await web.conversations.history({
                channel: channel,
                limit: 50
            });
        }

        console.log('Slack API response:', {
            ok: result.ok,
            error: result.error,
            hasMessages: !!result.messages,
            messageCount: result.messages?.length
        });

        if (result.ok && result.messages) {
            const messages = result.messages.map(msg => ({
                ts: msg.ts,
                user: msg.user,
                text: msg.text,
                type: msg.type,
                attachments: msg.attachments,
                reactions: msg.reactions
            }));
            console.log(`Successfully processed ${messages.length} messages`);
            res.json(messages);
        } else {
            console.error('Slack API Error:', {
                error: result.error,
                response: result
            });
            res.status(500).json({ 
                error: `Failed to fetch messages: ${result.error || 'No messages found'}`,
                details: result
            });
        }
    } catch (error) {
        console.error('Error in getMessages controller:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Internal server error while fetching messages',
            details: error.message
        });
    }
};

const postMessage = async (req, res) => {
    const { channel, text } = req.body;
    console.log('Received request to post message:', { channel, textLength: text?.length });

    if (!channel || !text) {
        console.log('Error: Missing required fields', { channel, hasText: !!text });
        return res.status(400).json({ error: 'Channel ID and text are required' });
    }

    try {
        console.log('Attempting to post message to Slack API...');
        const result = await web.chat.postMessage({
            channel: channel,
            text: text
        });

        console.log('Slack API response:', {
            ok: result.ok,
            error: result.error,
            ts: result.ts
        });

        if (result.ok) {
            res.json({ 
                success: true, 
                message: 'Message posted successfully', 
                ts: result.ts 
            });
        } else {
            console.error('Slack API Error:', {
                error: result.error,
                response: result
            });
            res.status(500).json({ 
                error: `Failed to post message: ${result.error}`,
                details: result
            });
        }
    } catch (error) {
        console.error('Error in postMessage controller:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Internal server error while posting message',
            details: error.message
        });
    }
};

const joinChannel = async (req, res) => {
    const { channel } = req.body;
    console.log('Received request to join channel:', channel);

    if (!channel) {
        console.log('Error: Channel ID is missing');
        return res.status(400).json({ error: 'Channel ID is required' });
    }

    try {
        console.log('Attempting to join channel via Slack API...');
        const result = await web.conversations.join({
            channel: channel
        });

        console.log('Slack API response:', {
            ok: result.ok,
            error: result.error,
            channel: result.channel
        });

        if (result.ok) {
            res.json({ 
                success: true, 
                message: 'Successfully joined channel',
                channel: result.channel
            });
        } else {
            console.error('Slack API Error:', {
                error: result.error,
                response: result
            });
            res.status(500).json({ 
                error: `Failed to join channel: ${result.error}`,
                details: result
            });
        }
    } catch (error) {
        console.error('Error in joinChannel controller:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Internal server error while joining channel',
            details: error.message
        });
    }
};

const getConversations = async (req, res) => {
    try {
        console.log('Attempting to fetch conversations from Slack API...');
        const result = await web.conversations.list({
            types: 'public_channel,private_channel',
            limit: 1000
        });

        console.log('Slack API response:', {
            ok: result.ok,
            error: result.error,
            hasChannels: !!result.channels,
            channelCount: result.channels?.length
        });

        if (result.ok && result.channels) {
            const conversations = result.channels.map(channel => ({
                id: channel.id,
                name: channel.name,
                is_private: channel.is_private,
                num_members: channel.num_members,
                topic: channel.topic?.value || '',
                purpose: channel.purpose?.value || ''
            }));
            console.log(`Successfully processed ${conversations.length} conversations`);
            res.json(conversations);
        } else {
            console.error('Slack API Error:', {
                error: result.error,
                response: result
            });
            res.status(500).json({ 
                error: `Failed to fetch conversations: ${result.error || 'No conversations found'}`,
                details: result
            });
        }
    } catch (error) {
        console.error('Error in getConversations controller:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Internal server error while fetching conversations',
            details: error.message
        });
    }
};

module.exports = {
    getMessages,
    postMessage,
    joinChannel,
    getConversations
}; 