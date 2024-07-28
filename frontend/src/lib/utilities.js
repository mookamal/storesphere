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