// server/reminder.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('./models/Task');
const User = require('./models/User');
require('dotenv').config();

// 📬 Setup transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔔 Function to send reminders
const sendReminders = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
    dueDate: { $lte: tomorrow },
    status: { $ne: 'completed' },
  }).populate('user');

  tasks.forEach(task => {
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: task.user.email,
      subject: 'Task Reminder ⏰',
      text: `Hi ${task.user.username},\n\nYour task "${task.title}" is due by ${new Date(task.dueDate).toDateString()}.\n\nPlease complete it soon!\n\nRegards,\nSmart Task Manager`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email error:', error);
      } else {
        console.log(`✅ Reminder sent to ${task.user.email}`);
      }
    });
  });
};

// ⏱️ Schedule every day at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('🔔 Running daily task reminder...');
  sendReminders();
});
