function generateWindows(powerdata, renweabledata) {
    // console.log(powerdata, renweabledata);
    // console.log(renweabledata[0].dateandtime);
    let current_date = getDayOfWeek(renweabledata[0].dateandtime)
    let peakTotals
    console.log(current_date);
    if(current_date == 'Monday'){
        peakTotals = Monday(powerdata, renweabledata)
    }else if(current_date == 'Tuesday'){
        Tuesday(powerdata, renweabledata)
    }
    else if(current_date == 'Tuesday'){
        Wednesday(powerdata, renweabledata)
    }
    else if(current_date == 'Tuesday'){
        Thurday(powerdata, renweabledata)
    }
    else if(current_date == 'Tuesday'){
        Friday(powerdata, renweabledata)
    }
    else if(current_date == 'Tuesday'){
        Saturday(powerdata, renweabledata)
    }else{
        Sunday(powerdata, renweabledata)
    }
    return peakTotals

}

function getDayOfWeek(timestamp) {
    // Create a new Date object from the timestamp
    let date = new Date(timestamp);

    // Array of days of the week
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Get the day of the week (0 = Sunday, 6 = Saturday)
    let dayIndex = date.getUTCDay(); // Using UTC to avoid timezone issues

    // Convert JavaScript's Sunday-starting index to Monday-starting
    return daysOfWeek[(dayIndex + 6) % 7]; 
}
function Monday(powerdata, renweabledata){
    let currentHighestTotal =-10000000
    let currentHighestTotalTime = {Weekly: "", Monday: "", Tuesday: "", Wednesday: "", Thurday: "", Friday: "", Saturday: "", Sunday: ""}
    //weekly highest
    for(let i=0; i < 165; i++){
        // console.log(`t ${i}`);
        hourlyAmount = (renweabledata[i].estimatedenergy / powerdata[i + 1].active_power_avg)
         + (renweabledata[i + 1].estimatedenergy / powerdata[i + 2].active_power_avg) 
          + (renweabledata[i + 2].estimatedenergy / powerdata[i + 3].active_power_avg);
        // console.log(hourlyAmount);
        if (hourlyAmount > currentHighestTotal){
            currentHighestTotal = hourlyAmount
            currentHighestTotalTime.Weekly = renweabledata[i].dateandtime
        }
        // console.log(currentHighestTotalTime)
    }
    //monday highest total
    currentHighestTotal =-10000000
    for(let i=0; i < 21; i++){
        // console.log(`t ${i}`);
        hourlyAmount = (renweabledata[i].estimatedenergy / powerdata[i + 1].active_power_avg)
         + (renweabledata[i + 1].estimatedenergy / powerdata[i + 2].active_power_avg) 
          + (renweabledata[i + 2].estimatedenergy / powerdata[i + 3].active_power_avg);
        console.log(hourlyAmount, renweabledata[i].dateandtime, powerdata[i+1].date_time);
        if (hourlyAmount > currentHighestTotal){
            currentHighestTotal = hourlyAmount
            currentHighestTotalTime.Monday = renweabledata[i].dateandtime
        }
        console.log(currentHighestTotalTime)
    }
    //Tuesday highest total
    currentHighestTotal =-10000000
    for(let i=0; i < 22; i++){
        console.log(`t ${i}`);
        hourlyAmount = (renweabledata[i+23].estimatedenergy / powerdata[i + 24].active_power_avg)
         + (renweabledata[i + 24].estimatedenergy / powerdata[i + 25].active_power_avg) 
          + (renweabledata[i + 26].estimatedenergy / powerdata[i + 27].active_power_avg);
        console.log(hourlyAmount, renweabledata[i+23].dateandtime, powerdata[i+24].date_time);
        if (hourlyAmount > currentHighestTotal){
            currentHighestTotal = hourlyAmount
            currentHighestTotalTime.Tuesday = renweabledata[i+23].dateandtime
        }
        console.log(currentHighestTotalTime)
    }
    //Wednesday highest total
    currentHighestTotal =-10000000
    for(let i=0; i < 22; i++){
        console.log(`t ${i}`);
        hourlyAmount = (renweabledata[i+47].estimatedenergy / powerdata[i + 48].active_power_avg)
         + (renweabledata[i + 48].estimatedenergy / powerdata[i + 49].active_power_avg) 
          + (renweabledata[i + 49].estimatedenergy / powerdata[i + 50].active_power_avg);
        console.log(hourlyAmount, renweabledata[i+47].dateandtime, powerdata[i+48].date_time);
        if (hourlyAmount > currentHighestTotal){
            currentHighestTotal = hourlyAmount
            currentHighestTotalTime.Wednesday = renweabledata[i+47].dateandtime
        }
        console.log(currentHighestTotalTime)
    }
    return currentHighestTotalTime
}


module.exports = { generateWindows }