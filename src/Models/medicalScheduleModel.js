const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for the Schedule
const scheduleSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
    type: {
        type: String,
        enum: [ 'RecurringTask', 'SingleTask'],
        required: true
  },
  category: {
    type: String,
    enum: ['Medication', 'Appointment', 'Treatment'],
    required:true
    },
    title: {
        type: String,
        required: true
    },
  description: {
    type:String
  },
  startDate: {
        type: Date,
        required: function () {
          return this.type !== 'SingleTask';
      }
  },
    frequency: {
        type: String,
        enum: ['Daily','Weekly','Monthly', 'SpecificDaysOfWeek', 'SpecificDaysOfWeek','SpecificDaysOfMonth','SpecificDaysOfYear','Repeat', ],
        required: function () {
            return this.type !== 'SingleTask';
        }
    },
  daysOfWeek: {
    type: [Number],
    select:false,
    min: 0,
    max:6,
    required: function () {
      if (this.type === 'RecurringTask' && this.frequecy === 'SpecificDaysOfWeek') {
        return true;
      }
      }
  },
  daysOfMonth: {
    type: [Number],
    select:false,
    required: function () {
      if (this.type === 'RecurringTask' && this.frequecy === 'SpecificDaysOfMonth') {
        return true;
      }
      }
  },
  daysOfYear: {
    type: [Number],
    select:false,
    required: function () {
      if (this.type === 'RecurringTask' && this.frequecy === 'SpecificDaysOfYear') {
        return true;
      }
      else {
        return false
      }
      }
  },
  Repeat: {
    type: [Number],
    select:false,
    required: function () {
      if (this.type === 'RecurringTask' && this.frequecy === 'Repeat') {
        return true;
      }
      }
  },
    dueDate: {
        type: Date,
      // required for single tasks
      default: function () {
        if (this.type === 'RecurringTask' && this.frequecy === 'Daily') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000));
        } 
        else if (this.type === 'RecurringTask' && this.frequecy === 'Weeky') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000 * 7));
        } 
        else if (this.type === 'RecurringTask' && this.frequecy === 'Monthly') {
          const currentDate = new Date(); // Get current date
    const currentMonth = currentDate.getMonth(); // Get current month (0-indexed)
    const currentYear = currentDate.getFullYear(); // Get current year

    // Calculate the next month
     let nextMonth = currentMonth + 1;
     let nextYear = currentYear;

     if (nextMonth === 12) { // If the next month is December, reset to January of the next year
        nextMonth = 0; // January is 0
        nextYear++;
    }

    // Get the first day of the next month
    const nextMonthDate = new Date(nextYear, nextMonth, 1);

    return nextMonthDate;
        } 
      },
      required: function () {
        if (this.type === 'SingleTask') {           
          return true
        }
        else if (this.type === 'RecurringTask' && this.frequecy === 'Daily') {
          return true
        }
        }
  },
    completed: {
      type: Boolean,
      default:false
  },
  checked: {
    type:Boolean,
    default:false
  }
});

// Create a Mongoose model
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;