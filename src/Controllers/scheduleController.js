const Schedule = require('../Models/medicalScheduleModel');

const createSchedule = async (req, res)=> {
    try {
        if (req.body.type === 'SingleTask') {
            const user = req.user
              const addSchedule = { ...req.body };
              const dateTimeString = `${req.body._date}T${req.body.time}`;
              const dueDate = new Date(dateTimeString); 
          const newSchedule = new Schedule({user, ...addSchedule, dueDate }); 
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
    try {
      const allSchedules = await Schedule.find({ type: 'RecurringTask' });
      
      allSchedules.forEach(async (schedule) => {
        if (schedule.type === 'RecurringTask' && schedule.frequency === 'Daily') {
            const Today = new Date()
            if (Today > schedule.dueDate) {
                const newSchedule = new Schedule({user:schedule.user,startDate:schedule.dueDate , dueDate:(schedule.dueDate*24),category:schedule.category,title:schedule.title,frequncy:schedule.frequency, decription:schedule.description }); 
            }
            
        }
      });
    } catch (error) {
      console.error('Error occurred while checking for tasks:', error);
    }
  };
  
  // Call checkForTasks initially
  checkForTasks();
  
  // Update the tasks every hour
setInterval(checkForTasks, 60 * 60 * 1000 * 24); // 60 minutes * 60 seconds * 1000 milliseconds = 1 hour
  


module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleByIdForUser,
    updateSchedule,
    deleteSchedule
};
