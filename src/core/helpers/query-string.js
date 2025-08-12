export default function createQueryString(page, limit, q) {
  const queryString = ["?", "page", "=", page, "&", "limit", "=", limit, "&", "q", "=", q].join("")
  return queryString
}
