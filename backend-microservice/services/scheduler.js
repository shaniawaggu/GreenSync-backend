const cron = require("node-cron");
const sendEmail = require("./mailer");
const db = require("../db/connect");

// Function to schedule emails for all users
const scheduleUserEmails = async () => {
  try {
    const response = await db.query("SELECT * FROM users;");
    const users = response.rows;

    users.forEach((user) => {
        const cron_expression = "* * * * *" // every minute
        // const cron_expression = "0 9 * * 0" // every Sunday at 9:00 AM

        let message = `Hello ${user.name},
        \n\n
        \n  ${user.message}
        \n
        \n
        \nBest regards,
        \nGreenSync Team`;
        cron.schedule((cron_expression), () => {
        console.log(`📩 Sending automated email to ${user.email}`);
        sendEmail(user.email, "Best Times to Charge", message);
      });
    });

    console.log("✅ Automatic email scheduler started.");
  } catch (error) {
    console.error(`❌ Error scheduling emails: ${error.message}`);
  }
};

module.exports = { scheduleUserEmails }
