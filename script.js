// get elements 
let inputfeild = document.querySelector('#add-task-input');
let addTaskBtn = document.querySelector('#addtask-btn');
let taskContainer = document.querySelector('.tasks-container');


// add task function 
function addTask() {
    let taskTitle = inputfeild.value.trim();
    if(taskTitle === ""){
        console.log('no task to add');
        return
    }else{
        const taskId = `task-${Date.now()}`;
        const taskStatus = `active`;
        renderTask(taskId,taskTitle, taskStatus);
        addTolocalStorage(taskId,taskTitle,taskStatus);
        inputfeild.value = "";
    }
}

function renderTask(taskId, taskTitle, taskStatus){
    let taskDiv = document.createElement('div');

    let checkDoneTask = document.createElement('input');
    checkDoneTask.type ='checkbox';
    checkDoneTask.id=taskId;
    checkDoneTask.value = taskStatus;

    let taskLabel = document.createElement("label");
    taskLabel.htmlFor = taskId;
    taskLabel.innerText = taskTitle;

    // LocalStorage load handling 
    if(taskStatus === "done"){
        taskLabel.classList.add('task-done');
        checkDoneTask.checked = true;
    }else{
        taskLabel.classList.remove('task-done');
        checkDoneTask.checked = false;
    }

    let removeTaskBtn = document.createElement('input');
    removeTaskBtn.type ='button';
    removeTaskBtn.setAttribute('data-task-id', taskId);
    removeTaskBtn.value = 'Delete';

    taskDiv.setAttribute('task-status', taskStatus);
    taskDiv.append(checkDoneTask, taskLabel, removeTaskBtn);
    taskContainer.appendChild(taskDiv)

    //Remove task 
    removeTaskBtn.addEventListener('click', function removeTask(e){
        let parentDiv = e.target.parentElement;
        let taskId = e.target.dataset.taskId;
        parentDiv.remove();
        removeFromLS(taskId)
    });

    //task status 
    checkDoneTask.addEventListener('change', function(e){
        
        if(e.target.checked){
            taskLabel.classList.add('task-done');
            taskDiv.setAttribute('task-status', 'done');
            checkDoneTask.value = 'done';
            updateLocalStorageTaskStatus(taskId, taskDiv.getAttribute('task-status'));

        }else{
            checkDoneTask.value = 'active';
            taskLabel.classList.remove('task-done');
            taskDiv.setAttribute('task-status', 'active');
            updateLocalStorageTaskStatus(taskId, taskDiv.getAttribute('task-status'));
        }
    })
}

addTaskBtn.addEventListener('click', addTask);

//Local Storage Handle

const STORAGE_KEY = 'task';
function addTolocalStorage(taskId, taskTitle, taskStatus){
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    tasks.push({ id: taskId, title: taskTitle, taskStatus });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Keep localStorage tasks
function keepLStasks(){
    let tasksObj = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(tasksObj)) {
    console.warn("Invalid task data in localStorage");
    return;
    }
    if(!tasksObj){
        console.log('local storage empty');
        return;
    }
    tasksObj.forEach(task => {
        renderTask(task.id, task.title, task.taskStatus);
    });
}


function updateLocalStorageTaskStatus(taskId, taskStatus){
     let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] ;

        for(let i = 0; i < tasks.length; i++){
        if(tasks[i].id === taskId){
            tasks[i].taskStatus = taskStatus;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }else{
            console.log('No task muched')
        }
    }
}

//Remove from localStorage
function removeFromLS(taskId){
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] ;
    
    let exists = false;
    for(let i = 0; i < tasks.length; i++){
        
        if(tasks[i].id === taskId){
            tasks.splice(i, 1);
            exists = true;
            break;
        }
    }
    if(exists){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }else{
        console.warn(`Task with ID "${taskId}" not found in localStorage.`);
    }
    
}

// Filters handling

let filtersItems = document.querySelectorAll("ul li");

filtersItems.forEach(item => {
    item.addEventListener('click', function(e){
        filtersItems.forEach(item => {
            item.classList.remove('active');
        })
        e.target.classList.add('active');

        let filterValue = e.target.dataset.filter;
        let tasks =document.querySelectorAll('.tasks-container div');
        tasks.forEach(task => {
            if(task.getAttribute('task-status') === filterValue || filterValue === 'all' ){
                task.classList.remove('disabled');
            }else{
                task.classList.add('disabled')
            }
        })
    })
})


document.addEventListener('DOMContentLoaded', () => {
    keepLStasks();
});