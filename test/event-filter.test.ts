import { eventFilter } from '../src/event-filter'

describe('eventFilter', () => {
  const testCases: [string, boolean][] = [
    [
      'check out the hack day I am hosting on Luma: https://lu.ma/vancouver-hack-day-april2024',
      true,
    ],
    [
      "I'm thinking about checking out this comedy show, does anyone want to join me? https://www.eventbrite.com/e/blind-tiger-comedy-show-ice-cream-late-show-tickets-874032664227?aff=ebdshpsearchautocomplete&keep_tld=1",
      true,
    ],
    [
      "Sign up for the party that I'm hosting! https://partiful.com/?event-id=best-party-ever",
      true,
    ],
    [
      'I just created my first meetup event. Register here: https://www.meetup.com/',
      true,
    ],
    ['Hi this is a post not related to an event!', false],
  ]

  test.each(testCases)(
    'returns %p when given %p',
    (createOp, expectedResult) => {
      expect(eventFilter(createOp)).toBe(expectedResult)
    },
  )
})
