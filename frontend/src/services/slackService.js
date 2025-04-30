import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const slackService = {
  async getConversations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getMessages(channelId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${channelId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async sendMessage(channelId, text) {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        channelId,
        text
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async joinChannel(channelId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/channels/join`, {
        channelId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      return {
        error: error.response.data.message || 'An error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      return {
        error: 'No response received from server',
        status: 0
      };
    } else {
      return {
        error: error.message || 'An error occurred',
        status: 0
      };
    }
  }
};

export const { getConversations, getMessages, sendMessage, joinChannel } = slackService; 