/*
  * 
*/
const express = require('express');
const Db = require('../config/db');
const middlewareConfig = require('../config/middlewareConfig');
const User = require('../src/Models/userModel')
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
/*
  * Calender shittt
*/
const authorize = require('./Calender/authorization');
const listEventsRoute = require('./Calender/EventsList');
const scheduleEventRoute = require('./Calender/EventsSchedule');
const scheduleMedicationReminderRoute = require('./Calender/scheduleMedicationReminder');

//create and app express app
const app = express();

// Store the authenticated client globally
let auth; 

// Initialize Database
Db();

// const port = process.env.PORT;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.CALLBACK_URI) {
    port = process.env.PORT || 27226; //Sets Default to port 27226 if PORT env variable is not set
} else {
    port = 33456; 
}

// Middleware || google signin
middlewareConfig(app);

// Middleware to handle authorization || Calender integration
async function checkAuthorization(req, res, next) {
    try {
        if (!auth) {
            auth = await authorize();
        }
        next();
    } catch (error) {
        console.error(`An error occurred during authorization: ${error}`);
        res.status(500).json({ error: 'An error occurred during authorization.' });
    }
}

// Use the authorization middleware for all routes except /authorize
app.use((req, res, next) => {
    if (req.path !== '/authorize') {
        checkAuthorization(req, res, next);
    } else {
        next();
    }
});

// View engine setup
app.set('view engine', 'ejs');
// app.set('views', './views');

// Routes
app.use('/', authRoute);
app.use('/user', userRoute);
/*
* routes for calender
*/
app.use('/events', listEventsRoute);                  // http://localhost:3001/events/list-events
app.use('/events', scheduleEventRoute);               // http://localhost:3001/events/schedule-event
app.use('/events', scheduleMedicationReminderRoute);  // http://localhost:3001/events/schedule-medication-reminder

//: http://localhost:3001/authorize
// Route for initial authorization
// app.get('/authorize', async (req, res) => {
//     try {
//         res.json({ message: 'Authorization successful' });
//         console.log(auth)
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred during authorization.' });
//     }
// });

// http://localhost:3001/list-events
// app.get('/list-events', async (req, res) => {
//     try {
//         const events = await listEvents(auth);
//         res.json(events);
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while listing events.' });
//     }
// });

// Route to schedule an event
// app.get('/schedule-event', async (req, res) => {
//     try {
//         const event = await scheduleEvent(auth);
//         res.json({ message: 'Event scheduled successfully', event });
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while scheduling event.' });
//     }
// });

// app.get('/schedule-medication-reminder', async (req, res) => {
//     try {
//         const reminder = await scheduleMedicationReminder(auth);
//         res.json(reminder);
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while scheduling medication reminder.' });
//     }
// });


// // list events routes : http://localhost:3001/list-events
// app.get('/list-events', async (req, res) => {
//     try {
//         const auth = await authorize();
//         const events = await listEvents(auth);
//         res.json(events);
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while listing events.' });
//     }
// });

// // Define route to schedule an event : http://localhost:3001/schedule-event
// app.get('/schedule-event', async (req, res) => {
//     try {
//         const auth = await authorize();
//         const event = await scheduleEvent(auth);
//         res.json({ message: 'Event scheduled successfully', event });
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while scheduling event.' });
//     }
// });

// // Define route to schedule a medication reminder : http://localhost:3001/schedule-medication-reminder
// app.get('/schedule-medication-reminder', async (req, res) => {
//     try {
//         const auth = await authorize();
//         const reminder = await scheduleMedicationReminder(auth);
//         res.json({ message: 'Medication reminder scheduled successfully', reminder });
//     } catch (error) {
//         console.error(`An error occurred: ${error}`);
//         res.status(500).json({ error: 'An error occurred while scheduling medication reminder.' });
//     }
// });

// const EventEmitter = require('events');
// EventEmitter.defaultMaxListeners = 15;

// authorize()
//   .then(async (auth) => {
//     await listEvents(auth);
//     await scheduleEvent(auth);
//     await scheduleMedicationReminder(auth);
// })
// .catch(console.error);

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
