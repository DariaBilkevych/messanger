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
