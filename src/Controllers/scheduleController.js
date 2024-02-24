const Schedule = require('../Models/medicalScheduleModel');
const notification = require('../Models/notificationModel')

const createSchedule = async (req, res)=> {
    try {
        if (req.body.type === 'SingleTask') {
            const user = req.user
              const addSchedule = { ...req.body };
             const dateTimeString = `${req.body._date}T${req.body.time}`;
              startDate = new Date(dateTimeString); 
              const dueDate = new Date(dateTimeString); 
              const newSchedule = new Schedule({user, ...addSchedule, dueDate , startDate }); 
              await newSchedule.save();
              res.status(201).json('New single schedule created');
        }
        else if (req.body.type === 'RecurringTask' && req.body.frequency === 'Daily') {
            const user = req.user
            const addSchedule = { ...req.body };
            const dateTimeString = req.body._date;
            const startDate = new Date(dateTimeString); 
        const newSchedule = new Schedule({user, ...addSchedule, startDate }); 
        await newSchedule.save();
        res.status(201).json('New daily recurring schedule created');
        }
        else if (req.body.type === 'RecurringTask' && req.body.frequency === 'Weekly') {
            const user = req.user
            const addSchedule = { ...req.body };
            const dateTimeString = req.body._date;
            const startDate = new Date(dateTimeString); 
            const year = startDate.getFullYear();
            const month = startDate.getMonth();

            const nextMonthDate = new Date(year, month + 1, 1);
            const dueDate = new Date(startDate * 7)
        const newSchedule = new Schedule({user, ...addSchedule, startDate , dueDate }); 
        await newSchedule.save();
        res.status(201).json('New weekly recurring schedule created');
        }
        else if (req.body.type === 'RecurringTask' && req.body.frequency === 'Monthly') {
            const user = req.user
            const addSchedule = { ...req.body };
            const dateTimeString = req.body._date;
            const startDate = new Date(dateTimeString); 
            let nextMonth = startDate.getMonth() + 1;
            let nextYear = startDate.getFullYear();

          if (nextMonth === 12) {
             nextMonth = 0; 
            nextYear++;
               }
            const dayOfMonth = startDate.getDate();
            const dueDate = new Date(nextYear, nextMonth, dayOfMonth);
            const newSchedule = new Schedule({user, ...addSchedule, startDate , dueDate }); 
            await newSchedule.save();
        res.status(201).json('New monthly recurring schedule created');
      }
  } catch (error) {
      console.log(error)
        res.status(400).json('an error occured');
    }
}


// Controller function to get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json('an error occured');
    }
}

// Controller function to get a single schedule by ID
const getScheduleByIdForUser = async (req, res) => {
  const userId = req.user._id
  try {
    const schedule = await Schedule.find({user:userId});
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json('an error occured');
    }
}

// Controller function to update a schedule by ID
const updateSchedule = async (req, res) => {
  const userId = req.user._id
  const title  = req.body.title
  const updateSchedule = {...req.body}
    try {
      const updatedSchedule = await Schedule.findOneAndUpdate({ $and: [{ user: userId },{ title }] }, updateSchedule, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(400).json('an error occured');
    }
}

// Controller function to delete a schedule by ID
const deleteSchedule = async (req, res) => {
  const userId = req.user._id
  const title = req.body.title
  try {
    const deletedSchedule = await Schedule.findOneAndDelete({ $and: [{ user: userId }, { title }] });
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json('an error occured');
    }
}


const checkForTasks = async () => {
    const allSchedules = await Schedule.find({ type: 'RecurringTask' });
    console.log('started the task checker');
    try {
        // Get schedules for each model and process them
        for (const schedule of allSchedules) {
            if (schedule.checked === false) {
                const today = new Date();
                const scheduleDate = new Date(schedule.startDate);
                
                if (today > scheduleDate) {
                    // Update checked flag only if today is after the schedule start date
                    const checkedOnce = await Schedule.findByIdAndUpdate(schedule._id, { checked: true }, { new: true });
                    if (!checkedOnce) {  
                        console.log('An error occurred while trying to update schedule');
                    }
                    // Create a new task based on frequency
                    if (schedule.frequency === 'Daily') {
                        await Schedule.create({
                            user: schedule.user,
                            type: schedule.type,
                            startDate: new Date(schedule.startDate.getTime() + (24 * 60 * 60 * 1000)),
                            category: schedule.category,
                            title: schedule.title,
                            frequency: schedule.frequency,
                            description: schedule.description
                        });
                    }
                       else if (schedule.frequency === 'Weekly') {
                        await Schedule.create({
                            user: schedule.user,
                            type: schedule.type,
                            startDate: new Date(schedule.startDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
                            category: schedule.category,
                            title: schedule.title,
                            frequency: schedule.frequency,
                            description: schedule.description
                        });
                    } else if (schedule.frequency === 'Monthly') {
                        const newStartDate = new Date(schedule.startDate);
                        newStartDate.setMonth(newStartDate.getMonth() + 1);
                        const newDueDate = new Date(schedule.dueDate);
                        newDueDate.setMonth(newDueDate.getMonth() + 1);
                        await Schedule.create({
                            user: schedule.user,
                            type: schedule.type,
                            startDate: newStartDate,
                            dueDate: newDueDate,
                            category: schedule.category,
                            title: schedule.title,
                            frequency: schedule.frequency,
                            description: schedule.description
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error occurred while checking for tasks:', error);
    }
};

  


module.exports = {
    checkForTasks,
    createSchedule,
    getAllSchedules,
    getScheduleByIdForUser,
    updateSchedule,
    deleteSchedule
};
