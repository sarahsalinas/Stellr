/* shared javascript functions */

// function for time formatting calculations
function formatTime(seconds) {
    // 3600 seconds in 1 hour
    const hours = Math.floor(seconds / 3600);
    //  60 seconds in 1 minute and find remainder of 60 minutes in an hour
    const minutes = Math.floor(seconds / 60) % 60;
    // remainder after dividing 60 seconds
    const remainingSeconds = seconds % 60;
    // proper format 00:00 for minutes and seconds
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    // if-else statement for formatting when there is an hour vs minutes and seconds
    if (hours > 0) {
        return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    else {
        return `${formattedMinutes}:${formattedSeconds}`;
    };
}