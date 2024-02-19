// listEvents.js
const dayjs = require('dayjs')
const express = require('express');
const {google} = require('googleapis');
const authorize = require('./authorization');

const router = express.Router();


router.get('/list-events', async (req, res) => {
  try {
    const auth = await authorize();
    const calendar = google.calendar({version: 'v3', auth});
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      return res.json({ message: 'No upcoming events found.' });
    } 
    const formattedEvents = events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      return `${start} - ${event.summary}`;
    });
    return res.json({ message: 'Upcoming 10 events:', events: formattedEvents });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return res.status(500).json({ error: 'An error occurred while listing events.' });
  }
});

module.exports = router;
