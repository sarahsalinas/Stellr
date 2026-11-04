
// new task button
const newTaskButton = document.getElementById("newTask");

// when new task button is clicked it will open dialog box
newTaskButton.addEventListener("click", function(){
    newTaskDialog.showModal();
});

const newTaskDialog = document.getElementById("newTaskDialogBox");

// close dialog box when "x" or cancel is clicked
const closeDialogButton = document.getElementById("closeButton");
const cancelDialogButton = document.getElementById("cancelButton");

closeDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});

cancelDialogButton.addEventListener("click", function(){
    newTaskDialog.close();
});