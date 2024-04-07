"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFilter = void 0;
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
];
function eventFilter(text) {
    return EVENT_PLATFORMS.some((platform) => text.includes(platform.domain));
}
exports.eventFilter = eventFilter;
