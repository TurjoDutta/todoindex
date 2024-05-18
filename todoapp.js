const inputBox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");
let draggedItem = null;

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.draggable = true; // Make the new task draggable
        
        // Create span for edit
        let editSpan = document.createElement("span");
        editSpan.innerHTML = "\u270E"; // Unicode for pencil symbol
        editSpan.className = "edit";
        editSpan.onclick = function() {
            editTask(li);
        };
        
        // Create span for delete
        let closeSpan = document.createElement("span");
        closeSpan.innerHTML = "\u00d7";
        closeSpan.className = "close";
        closeSpan.onclick = function() {
            li.remove();
            saveData();
        };
        
        li.appendChild(editSpan);
        li.appendChild(closeSpan);
        
        listcontainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
}


listcontainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit")) { // If edit button is clicked
        editTask(e.target.parentElement);
    } else if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.classList.contains("close")) {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

listcontainer.addEventListener("dragstart", function(e) {
    draggedItem = e.target;
    setTimeout(() => {
        e.target.style.display = "none"; // Hide the dragged item while dragging
    }, 0);
}, false);

listcontainer.addEventListener("dragend", function(e) {
    draggedItem.style.display = "block";
    draggedItem = null;
}, false);

listcontainer.addEventListener("dragover", function(e) {
    e.preventDefault();
}, false);

listcontainer.addEventListener("dragenter", function(e) {
    e.preventDefault();
    if (e.target.tagName === "LI" && e.target !== draggedItem) {
        e.target.style.backgroundColor = "#f2f2f2"; // Change background color when dragging over
    }
}, false);

listcontainer.addEventListener("dragleave", function(e) {
    if (e.target.tagName === "LI") {
        e.target.style.backgroundColor = ""; // Reset background color when leaving
    }
}, false);

listcontainer.addEventListener("drop", function(e) {
    e.preventDefault();
    if (e.target.tagName === "LI" && e.target !== draggedItem) {
        // Swap the positions of draggedItem and the drop target
        const items = document.querySelectorAll("#list-container li");
        const indexDragged = Array.from(items).indexOf(draggedItem);
        const indexTarget = Array.from(items).indexOf(e.target);
        if (indexDragged > indexTarget) {
            listcontainer.insertBefore(draggedItem, e.target);
        } else {
            listcontainer.insertBefore(draggedItem, e.target.nextSibling);
        }
    }
    e.target.style.backgroundColor = ""; // Reset background color after dropping
    saveData();
}, false);

function editTask(li) {
    let input = document.createElement("input");
    input.type = "text";
    input.value = li.firstChild.textContent;
    input.onblur = function() {
        if (input.value.trim() !== '') {
            li.innerHTML = input.value;
            let span = document.createElement("span");
            span.innerHTML = "\u270E"; // Unicode for pencil symbol
            span.className = "edit"; // Add class for styling if needed
            span.onclick = function() {
                editTask(li);
            };
            li.appendChild(span);
            
            let closeSpan = document.createElement("span");
            closeSpan.innerHTML = "\u00d7";
            closeSpan.className = "close";
            li.appendChild(closeSpan);
        } else {
            li.remove();
        }
        saveData();
    };
    input.onkeydown = function(event) {
        if (event.key === "Enter") {
            input.blur();
        }
    };
    li.innerHTML = '';
    li.appendChild(input);
    input.focus();
}

function saveData() {
    localStorage.setItem("data", listcontainer.innerHTML);
}

function showTask() {
    listcontainer.innerHTML = localStorage.getItem("data") || '';
}

function clearAllTasks() {
    listcontainer.innerHTML = '';
    saveData();
}

// Initialize the tasks from localStorage
showTask();
