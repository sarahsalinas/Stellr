
// new task button
const newTaskButton = document.getElementById("newTask");

const newTaskDialog = document.getElementById("newTaskDialogBox");

// when new task button is clicked it will open dialog box
newTaskButton.addEventListener("click", function(){
    newTaskDialog.showModal();
});


// close dialog box when "x" or cancel is clicked
const closeDialogButton = document.getElementById("closeButton");
const cancelDialogButton = document.getElementById("cancelButton");

closeDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});

cancelDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});



// place string into savedTasks
const savedTasks = localStorage.getItem("tasks");
// place savedTasks back into an array and includes OR operator so it doesn't return null
const loadedTasks = JSON.parse(savedTasks) || [];
// array for tasks to go into
const tasks = loadedTasks;

// retrieve task name
const taskNameInput = document.getElementById("taskName");

// date
const taskDateInput = document.getElementById("taskDate");

// recurring
const recurringInput = document.getElementById("recurring");

// detect when user submits form
const newTaskForm = document.getElementById("newTaskForm");


// function for displaying tasks
function displayTask(task) {
    // show tasks on HTML table
    // creates new table row and table data
    const taskRow = document.createElement("tr");
    const taskNameCell = document.createElement("td");
    // places new row inside table body
    taskNameCell.textContent = task.name;
    taskRow.appendChild(taskNameCell);
    taskTableBody.appendChild(taskRow);
}

newTaskForm.addEventListener("submit", function(event){
    // no reloading
    event.preventDefault();
    const taskName = taskNameInput.value;
    const taskDate = taskDateInput.value;
    const recurring = recurringInput.value;

    // object containing the pieces
    const newTask = {
        name: taskName,
        date: taskDate,
        recurring: recurring
    };

    displayTask(newTask);

    // placing new task into tasks array
    tasks.push(newTask);

    // convert array into a string so it can save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // close the dialog after submitting
    newTaskDialog.close();
    newTaskForm.reset();
});


// finds the table's body
const taskTableBody = document.querySelector("tbody");

tasks.forEach(function(task){
    displayTask(task);
});