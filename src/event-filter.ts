const EVENT_PLATFORMS = [
  {
    name: 'Eventbrite',
    domain: 'eventbrite.com',
  },
  {
    name: 'Meetup',
    domain: 'meetup.com',
  },
  {
    name: 'Luma',
    domain: 'lu.ma',
  },
  {
    name: 'Partiful',
    domain: 'partiful.com',
  },
]

export function eventFilter(text: string) {
  // Escape special characters in domains and join them into a regex pattern
  const domainPattern = EVENT_PLATFORMS.map((platform) =>
    platform.domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ) // Escape special characters
    .join('|')
  const regexPattern = `https?://(?:[^/]*\\.)?(?:${domainPattern})(?:/[^ ]*)?`
  const regex = new RegExp(regexPattern)
  return regex.test(text)
}
