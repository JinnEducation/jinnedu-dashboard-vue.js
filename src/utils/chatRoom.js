export function makeChatRoom(userId, contactId) {
  const ids = [Number(userId), Number(contactId)]
  ids.sort((a, b) => a - b)
  return ids.join("_")
}
