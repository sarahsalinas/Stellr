/* dashboard page javascript */

// emoji changes

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// generate random number between 0 and 51
const randomIndex = Math.floor(Math.random() * letters.length);
// place letter from letters using randomIndex into randomLetter 
const randomLetter = letters[randomIndex];
const randomEmoji = document.getElementById("randomEmoji");
randomEmoji.textContent = randomLetter;

const savedTasks = localStorage.getItem("tasks");
// place savedTasks back into an array and includes OR operator so it doesn't return null
const loadedTasks = JSON.parse(savedTasks) || [];

// get todays date and add 5 days
// create today's date
const today = new Date();
// reset date to midnight
today.setHours(0, 0, 0, 0);
// create a copy of today
const fiveDaysFromNow = new Date(today);
fiveDaysFromNow.setDate(today.getDate() + 5);


// filters to return incomplete tasks that are due in 5 days local time
const upcomingTasks = loadedTasks.filter(function(task){
    // converting task.date into a local date object
    const taskDate = new Date(task.date + "T00:00:00");
    return task.completed === false && taskDate <= fiveDaysFromNow;
});

// sort into earliest first
upcomingTasks.sort(function(a, b) {
    return a.date.localeCompare(b.date);
});

const dashboardTasks = upcomingTasks.slice(0, 5);

// retrieve noTasks from html
const noTasksContainer = document.getElementById("noTasks");

// retrieve upcomingTasks from html
const upcomingTasksContainer = document.getElementById("upcomingTasks");

// if dashboard has more than one task hide no task container, if dashboard has no tasks hide upcoming task container
if (dashboardTasks.length > 0) {
    noTasksContainer.hidden = true;
    upcomingTasksContainer.hidden = false;
}

else {
    noTasksContainer.hidden = false;
    upcomingTasksContainer.hidden = true;
}

// reusable function 
function displayDashboardTask(task) {
    const taskContainer = document.createElement("div");
    const taskName = document.createElement("p");
    const taskDue = document.createElement("p");
    const taskStatus = document.createElement('p');
    // add classes for css styling later
    taskContainer.classList.add("dashboardTask");
    taskName.classList.add("dashboardTaskName");
    taskDue.classList.add("dashboardTaskDate");
    taskStatus.classList.add("dashboardTaskStatus");

    // populate task info
    taskName.textContent = `>> ${task.name}`;
    const dateParts = task.date.split("-");
    taskDue.textContent = `Due ${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

    // check if a task is recurring or in progress (focus time takes priority)
    if (task.totalFocusTime > 0) {
        taskStatus.textContent = "In Progress";
    }
    else if (task.recurring !== "None") {
        taskStatus.textContent = "Recurring";
    }
    else {
        taskStatus.textContent = "";
    };

    // attach to containers
    taskContainer.appendChild(taskName);
    taskContainer.appendChild(taskDue);
    taskContainer.appendChild(taskStatus);
    upcomingTasksContainer.appendChild(taskContainer);
};

// for each individual task in dashboardTasks displayDashboardTask() will be called
dashboardTasks.forEach(function(task) {
    displayDashboardTask(task);
});