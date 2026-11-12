
// new task button
const newTaskButton = document.getElementById("newTask");

const newTaskDialog = document.getElementById("newTaskDialogBox");

// delete button
const deleteTaskButton = document.getElementById("deleteTaskButton");

const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");

deleteTaskButton.addEventListener("click", function(){
    deleteConfirmDialog.showModal();
});

// when new task button is clicked it will open dialog box
newTaskButton.addEventListener("click", function(){
    newTaskDialog.showModal();
    editingTask = null;
    deleteTaskButton.hidden = true;
    newTaskForm.reset();
});

// cancel delete button
const cancelDeleteTaskButton = document.getElementById("cancelDeleteTaskButton");

cancelDeleteTaskButton.addEventListener("click", function(){
    deleteConfirmDialog.close();
});

// actually delete task
const deleteTaskButtonConfirm = document.getElementById("deleteTaskButtonConfirm");

deleteTaskButtonConfirm.addEventListener("click", function(){
    let taskIndex = tasks.indexOf(editingTask);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        // convert array into a string so it can save to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // reloads
        refreshTasks();
        deleteConfirmDialog.close();
        newTaskDialog.close();
        editingTask = null;
    }
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

let editingTask = null;

// retrieve task name
const taskNameInput = document.getElementById("taskName");

// date
const taskDateInput = document.getElementById("taskDate");

// recurring
const recurringInput = document.getElementById("recurring");

// detect when user submits form
const newTaskForm = document.getElementById("newTaskForm");

// finds the tables body
const taskTableBody = document.querySelector("tbody");

// function for displaying tasks
function displayTask(task) {
    // show tasks on HTML table
    // creates new table row and table data
    const taskRow = document.createElement("tr");
    const taskNameCell = document.createElement("td");
    const taskDateCell = document.createElement("td");
    const taskRecurringCell = document.createElement("td");
    // cell to hold edit button
    const taskActionsCell = document.createElement("td");
    // edit button
    const editButton = document.createElement("button");
    // places new row inside table body
    taskNameCell.textContent = task.name;
    taskDateCell.textContent = task.date;
    taskRecurringCell.textContent = task.recurring;
    editButton.textContent = "Edit";
    taskRow.appendChild(taskNameCell);
    taskRow.appendChild(taskDateCell);
    taskRow.appendChild(taskRecurringCell);
    taskActionsCell.appendChild(editButton);
    taskRow.appendChild(taskActionsCell);

    taskTableBody.appendChild(taskRow);

    // when edit button is clicked
    editButton.addEventListener("click", function(){
        console.log(task.name);
        newTaskDialog.showModal();
        taskNameInput.value = task.name;
        taskDateInput.value = task.date;
        recurringInput.value = task.recurring;
        editingTask = task;
        deleteTaskButton.hidden = false;
    });
};

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

    if (editingTask !== null){
        editingTask.name = taskName;
        editingTask.date = taskDate;
        editingTask.recurring = recurring;
    }
    else {
        // placing new task into tasks array
        tasks.push(newTask);
    };

    // convert array into a string so it can save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // clears and rebuilds the table
    refreshTasks();
    // close the dialog after submitting
    newTaskDialog.close();
    newTaskForm.reset();
});

function refreshTasks(){
    // clear the table
    taskTableBody.innerHTML = "";

    // finds the table's body
    tasks.forEach(function(task){
        displayTask(task);
    });
}

// reloads
refreshTasks();