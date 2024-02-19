// scheduleEvent.js
const dayjs = require('dayjs')
const express = require('express');
const {google} = require('googleapis');
const authorize = require('./authorization');

const router = express.Router();

router.get('/schedule-event', async (req, res) => {
  try {
    const auth = await authorize(); // Authorize for each request
    const calendar = google.calendar({version: 'v3', auth});
    const event = {
      summary: 'Testing this shitty calender thing',
      description: 'I have been working on this for ages, should have read the docs',
      start: {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone: 'Africa/Lagos',
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'hour').toISOString(),
        timeZone: 'Africa/Lagos',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2;INTERVAL=2'
      ],
      'attendees': [
        {'email': 'maticsjnr@gmail.com'},
        {'email': 'deraile201@gmail.com'},
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      }
    };
    const response = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    });
    return res.json({ message: 'Event created successfully', link: response.data.htmlLink });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return res.status(500).json({ error: 'An error occurred while scheduling event.' });
  }
});

module.exports = router;