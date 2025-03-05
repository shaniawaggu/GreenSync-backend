const cron = require("node-cron");
const sendEmail = require("./mailer");
const db = require("../db/connect");

// Function to schedule emails for all users
const scheduleUserEmails = async () => {
  try {
    const response = await db.query("SELECT * FROM users;");
    let response2
    const users = response.rows;
    const options = {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
    })
  }
    let cron_expression = "* * * *"
    cron.schedule(("0 */4 * * *"), async () =>{
      console.log("t1");
      response2 = await fetch(`http://131.145.0.127:3000/forecasts/update`, options)
    })
    let windows = await fetchOptimalPoints()
    // console.log(windows);
    users.forEach((user) =>  {
        cron_expression = "0 0 0 0 0 Thursday" 
        
        let message = `Hello ${user.name},
        \n\n
        \n  Best Weekly: ${windows.Weekly.startTime}
        \n  Best on Monday: ${windows.Monday.startTime}
        \n  Best on Tuesday: ${windows.Tuesday.startTime}
        \n  Best on Wednesday: ${windows.Wednesday.startTime}
        \n  Best on Thursday: ${windows.Thursday.startTime}
        \n  Best on Friday: ${windows.Friday.startTime}
        \n  Best on Saturday: ${windows.Saturday.startTime}
        \n  Best on Sunday: ${windows.Sunday.startTime}
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

async function fetchOptimalPoints() {
  try {
      const response = await fetch(`http://131.145.0.127:3000/forecasts/optimal-windows`);
      if (response.ok) {
          const data = await response.json();
          // console.log(data.Weekly, "t")
          return data
      } else {
          throw new Error("HTTP status code: " + response.status);
      }
  } catch (err) {
      console.error(err);
  }
}

module.exports = { scheduleUserEmails }