function generateWindows(powerdata, renewabledata) {
  // Assume both arrays have 168 items (one for each hour of the week)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Compute offset:
  // renewabledata[0].dateandtime is the start of renewable data (e.g. Wednesday 00:00)
  // Determine its day index in our system (Monday=0, Tuesday=1, etc.)
  const renewableStartDate = new Date(renewabledata[0].dateandtime);
  let renewableDayIndex = (renewableStartDate.getUTCDay() + 6) % 7; // Adjust since JS: Sunday=0
  // The matching powerdata hour for renewabledata[0] is (renewableDayIndex * 24)
  let offset = renewableDayIndex * 24;

  // Create an aligned array for renewabledata so that:
  // alignedRenewable[i] corresponds to the same hour as powerdata[i]
  const alignedRenewable = new Array(168);
  for (let i = 0; i < renewabledata.length; i++) {
    // Using modulo ensures proper wrap-around
    let targetIndex = (i + offset) % 168;
    alignedRenewable[targetIndex] = renewabledata[i];
  }

  // Initialize best window records for the whole week and each day.
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

  // Calculate the best 3-hour window for the entire week.
  // We loop from index 0 to 165 so that a 3-hour window (i, i+1, i+2) fits within 168.
  for (let i = 0; i <= 168 - 3; i++) {
    let windowScore = 0;
    let valid = true;
    for (let j = 0; j < 3; j++) {
      // Check that the aligned renewable data exists at this index.
      if (!alignedRenewable[i + j]) {
        valid = false;
        break;
      }
      windowScore += alignedRenewable[i + j].estimatedenergy / powerdata[i + j].active_power_avg;
    }
    if (!valid) continue;
    if (windowScore > bestWindows.Weekly.score) {
      bestWindows.Weekly.score = windowScore;
      bestWindows.Weekly.startTime = alignedRenewable[i].dateandtime;
    }
  }

  // Calculate the best 3-hour window for each day.
  // In powerdata, each day is a block of 24 hours:
  // Monday: indices 0-23, Tuesday: 24-47, etc.
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    let dayName = days[dayIndex];
    let start = dayIndex * 24;
    let end = start + 24; // exclusive end for this day
    // Loop through each possible starting index within the day that allows a 3-hour window.
    for (let i = start; i <= end - 3; i++) {
      let windowScore = 0;
      let valid = true;
      for (let j = 0; j < 3; j++) {
        if (!alignedRenewable[i + j]) {
          valid = false;
          break;
        }
        windowScore += alignedRenewable[i + j].estimatedenergy / powerdata[i + j].active_power_avg;
      }
      if (!valid) continue;
      if (windowScore > bestWindows[dayName].score) {
        bestWindows[dayName].score = windowScore;
        bestWindows[dayName].startTime = alignedRenewable[i].dateandtime;
      }
    }
  }

  return bestWindows;
}





module.exports = { generateWindows }