function generateWindows(powerdata, renewabledata) {
    // Days of the week array starting with Monday
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
    // get day name from a timestamp
    function getDayName(timestamp) {
      const date = new Date(timestamp);
      return days[(date.getUTCDay() + 6) % 7]; // Adjust since JS getUTCDay() returns 0 for Sunday
    }
  
    // Determine the offset.
    // renewabledata[0] is the current day (e.g., Tuesday 00:00),
    // while powerdata[0] is always Monday 00:00.
    // So if renewabledata starts on Tuesday, offset = 24 (i.e. Tuesday in powerdata is at index 24).
    let renewableStartDay = getDayName(renewabledata[0].dateandtime);
    let offset = days.indexOf(renewableStartDay) * 24;
  
    // Initialize best window records: weekly and for each day.
    const bestWindows = {
      Weekly: { startTime: null, score: -Infinity },
      Monday: { startTime: null, score: -Infinity },
      Tuesday: { startTime: null, score: -Infinity },
      Wednesday: { startTime: null, score: -Infinity },
      Thursday: { startTime: null, score: -Infinity },
      Friday: { startTime: null, score: -Infinity },
      Saturday: { startTime: null, score: -Infinity },
      Sunday: { startTime: null, score: -Infinity },
    };
  
    // Calculate the best weekly 3-hour window.
    // For each possible 3-hour window in renewabledata, compute the score by summing:
    // estimatedenergy / corresponding powerdata.active_power_avg,
    
    for (let i = 0; i <= renewabledata.length - 3; i++) {
      let windowScore = 0;
      for (let j = 0; j < 3; j++) {
        let powerIndex = (i + j + offset) % powerdata.length;
        windowScore += renewabledata[i + j].estimatedenergy / powerdata[powerIndex].active_power_avg;
      }
      if (windowScore > bestWindows.Weekly.score) {
        bestWindows.Weekly.score = windowScore;
        bestWindows.Weekly.startTime = renewabledata[i].dateandtime;
      }
    }
  
    // Calculate the best 3-hour window for each day.
    // Here we ensure that when mapping renewabledata indices to powerdata using the offset,
    // all three hours belong to the same day in the powerdata.
    for (let i = 0; i <= renewabledata.length - 3; i++) {
      // Determine the day for the first hour of the window (from powerdata perspective)
      let powerIndex0 = (i + offset) % powerdata.length;
      let dayName = getDayName(powerdata[powerIndex0].date_time);
      
      // Check that the next two hours in the window are on the same day
      let powerIndex1 = (i + 1 + offset) % powerdata.length;
      let powerIndex2 = (i + 2 + offset) % powerdata.length;
      if (
        getDayName(powerdata[powerIndex1].date_time) !== dayName ||
        getDayName(powerdata[powerIndex2].date_time) !== dayName
      ) {
        continue; // Skip this window if it spans two days in powerdata
      }
      
      // Compute the window score
      let windowScore = 0;
      for (let j = 0; j < 3; j++) {
        let pIndex = (i + j + offset) % powerdata.length;
        windowScore += renewabledata[i + j].estimatedenergy / powerdata[pIndex].active_power_avg;
      }
      
      // Update the best window for this day if necessary
      if (windowScore > bestWindows[dayName].score) {
        bestWindows[dayName].score = windowScore;
        bestWindows[dayName].startTime = renewabledata[i].dateandtime;
      }
    }
  
    return bestWindows;
  }



module.exports = { generateWindows }