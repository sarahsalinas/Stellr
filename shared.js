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

// personalization functionality
// check if theres name in localStorage
const savedName = localStorage.getItem("userName");
const namePromptDialog = document.getElementById("namePromptDialog");
const namePromptForm = document.getElementById("namePrompt");

// checks if dialog exists and if name is in localStorage
if (namePromptDialog && savedName === null) {
    namePromptDialog.showModal();
}

if (namePromptForm) {
    // when user clicks enter
    namePromptForm.addEventListener("submit", function(event){
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    if (name !== "") {
        localStorage.setItem("userName", name);
        updateGreeting(name);
        namePromptDialog.close();   
    }
    });
}

// reusable function to update greeting
function updateGreeting(name) {
    const pageGreeting = document.getElementById("pageGreeting");
    // if pageGreeting element exists..
    if (pageGreeting) {
        pageGreeting.textContent = `Welcome to Stellr, ${name}!`;
    };
}

// if savedName exists..
if (savedName !== null) {
    updateGreeting(savedName);
}

// reset button
const reset = document.getElementById("reset");
const resetDialog = document.getElementById("resetDialog");
const resetButton = document.getElementById("resetConfirm");
const cancelReset = document.getElementById("cancelReset");

reset.addEventListener("click", function(){
    resetDialog.showModal();
});

resetButton.addEventListener("click", function(){
    localStorage.removeItem('userName');
    localStorage.removeItem('tasks');
    window.location.href = "index.html";
});

cancelReset.addEventListener("click", function(){
    resetDialog.close();
});