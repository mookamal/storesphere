import axios from 'axios';

export const formatMsgServer = (msgs) => {
  const formattedMessages = {};

  for (const [field, messages] of Object.entries(msgs)) {
    if (Array.isArray(messages)) {
      formattedMessages[field] = messages.join('. ');
    } else {
      formattedMessages[field] = messages;
    }
  }

  return formattedMessages;
};

export const isEmail = (input) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(input);
};



export async function checkHasStore(session) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      }
    });

    if (response.data.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    if (e.response && e.response.status === 404) {
      return false;
    } else {
      console.error('Error fetching stores:', e.message);
      throw new Error('Failed to check stores');
    }
  }
}

export async function firstStoreRedirect(session) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/s/stores/first-store/`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      }
    });
    if (response.data) {
      return response.data.domain;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error fetching first store:', e.message);
    throw new Error('Failed to fetch first store');
  }
}