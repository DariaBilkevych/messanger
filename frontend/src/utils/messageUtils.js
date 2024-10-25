export const sortUsers = (users) => {
  return users.sort((a, b) => {
    if (!a.lastMessageDate && !b.lastMessageDate) {
      return a.firstName.localeCompare(b.firstName);
    }
    if (!a.lastMessageDate) return 1;
    if (!b.lastMessageDate) return -1;
    return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
  });
};

export const formatMessageByType = (message, messageType) => {
  if (!message && messageType === 'file') {
    return 'Sent a file';
  } else if (!message && messageType === 'image') {
    return 'Sent an image';
  }

  const formattedMessage = message.replace(/\n+/g, ' ').trim();

  return formattedMessage;
};
