// scheduleMedicationReminder.js

const dayjs = require('dayjs')
const express = require('express');
const { google } = require('googleapis');
const authorize = require('./authorization');

const router = express.Router();

router.get('/schedule-medication-reminder', async (req, res) => {
  try {
    const auth = await authorize();
    const calendar = google.calendar({version: 'v3', auth});
    const event = {
      summary: 'Take Medication',
      description: 'Remember to take your malaria medication',
      start: {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone: 'Africa/Lagos',
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone: 'Africa/Lagos',
      },
      reminders: {
        useDefault: false,
        overrides: [
          {'method': 'popup', minutes: 10 },
          {'method': 'email', 'minutes': 10},
        ],
      },
    };
    const response = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    });
    return res.json({
      message: 'Medication reminder scheduled successfully',
      link: response.data.htmlLink
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return res.status(500).json({ error: 'An error occurred while scheduling medication reminder.' });
  }
});
module.exports = router;