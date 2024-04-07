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
  return EVENT_PLATFORMS.some((platform) => text.includes(platform.domain))
}
