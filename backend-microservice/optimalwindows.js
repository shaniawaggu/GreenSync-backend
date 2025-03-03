function generateWindows(powerdata, renweabledata) {
    // console.log(powerdata, renweabledata);
    // console.log(renweabledata[0].dateandtime);
    let current_date = getDayOfWeek(renweabledata[0].dateandtime)
    
    console.log(current_date);
    

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


module.exports = { generateWindows }