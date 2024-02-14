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
        enum: ['Habit', 'RecurringTask', 'SingleTask'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    startDate: {
        type: Date,
        required: true
    },
  endDate: {
    type: Date,
    required: function () {
      return this.type === 'SingleTask';
  }
  },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        // required for recurring tasks and habits
        required: function () {
            return this.type !== 'SingleTask';
        }
    },
    // For recurring tasks
    daysOfWeek: [{
        type: Number,
        min: 0,
        max: 6
    }],
    // For single tasks
    dueDate: {
        type: Date,
      // required for single tasks
      default: function () {
        if (this.type === 'RecurringTask' && this.frequecy === 'Daily') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000));
        } 
        else if (this.type === 'RecurringTask' && this.frequecy === 'Weekly') {
          return new Date(Date.now() + (24 * 60 * 60 * 1000 * 7));
        }
        else if (this.type === 'RecurringTask' && this.frequecy === 'Monthly') {
          const currentDate = new Date();
          const nextMonth = (currentDate.getMonth() + 1) % 12; 
          return nextMonth;
        }
      },
        required: function () {
            return this.type === 'SingleTask';
        }
  },
    completed: {
      type: Boolean,
      default:false
    }
});

// Create a Mongoose model
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
