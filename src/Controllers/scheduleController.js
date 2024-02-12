const Schedule = require('../Models/medicalScheduleModel'); // Assuming the model file is in a 'models' directory

// Controller function to create a new schedule
const createSchedule = async (req, res)=> {
  try {
      const addSchedule = {...req.body}
        const newSchedule = new Schedule(addSchedule);
         await newSchedule.save();
        res.status(201).json('new schedule created');
    } catch (error) {
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
    const allSchedules = await Schedule.find({ $or: [{ type: 'Habit' }, { type: 'RecurringTask' }] })
   
    allSchedules.forEach(async (schedule) => {
      if (allSchedules.type === 'RecurringTask') {
         
       }
  });


  } catch (error) {
    
  }
}


module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleByIdForUser,
    updateSchedule,
    deleteSchedule
};
