const todoInput = document.querySelector(".js-todo-input");
const todoList = document.querySelector(".js-list");
const taskItemsLeft = document.querySelector(".js-items-left");
const todoActions = document.querySelector(".js-list-actions");

todoInput.addEventListener("keyup", event => {
    if(event.keyCode === 13){
        toDo.createTask(todoInput.value, false);
        todoInput.value = "";
    }
});

todoActions.addEventListener("click", event => {
    if(event.target.classList.contains("js-task-filter-all")){
        taskFilterAll(event.target);
    } else if(event.target.classList.contains("js-task-filter-active")){
        taskFilterActive(event.target);
    } else if(event.target.classList.contains("js-task-filter-completed")){
        taskFilterCompleted(event.target);
    } else if(event.target.classList.contains("js-task-clear-completed")){
        taskClearCompleted();
    }
});

function taskFilterStyle(targetBtn){
    const taskFilterBtn = document.querySelectorAll(".js-list-filters button");
    taskFilterBtn.forEach(btn => {
        if(btn == targetBtn){
            btn.classList.add("active");
        } else{
            btn.classList.remove("active");
        }
    });
};

function taskFilterAll(btn){
    const tasks = todoList.querySelectorAll("li");
    tasks.forEach(task => {
        task.classList.remove("hide-task");
    });
    taskFilterStyle(btn);
};

function taskFilterActive(btn){
    const tasks = todoList.querySelectorAll("li");
    tasks.forEach(task => {
        if(task.dataset.completed == "true"){
            task.classList.add("hide-task");
        } else {
            task.classList.remove("hide-task");
        }
    });
    taskFilterStyle(btn);
};

function taskFilterCompleted(btn){
    const tasks = todoList.querySelectorAll("li");
    tasks.forEach(task => {
        if(task.dataset.completed == "false"){
            task.classList.add("hide-task");
        } else {
            task.classList.remove("hide-task");
        }
    });
    taskFilterStyle(btn);
};

function taskClearCompleted(){
    const tasks = todoList.querySelectorAll("li");
    tasks.forEach(task => {
        if(task.dataset.completed == "true") task.remove();
    });
};

class ToDo {
    constructor(element, taskCount){
        this.element = this.#elementEvent(element);
        this.taskCount = taskCount;
        this.#getData();
    }

    createTask(task, status){
        this.#addTask(task, status);
        this.itemsLeft();
        this.#saveData();
    }

    itemsLeft(){
        let count = 0;
        const tasks = this.element.querySelectorAll("li");
        tasks.forEach(task => {
            if(task.dataset.completed == "false") count++;
        });
        this.taskCount.textContent = count;
    }

    #elementEvent(element){
        ["click", "keyup", "focusout"].forEach(e => {
            element.addEventListener(e, event => {
                if(e == "click"){
                    const li = event.target.closest("li");
                    if(event.target.closest("button.js-task-btn")){
                        if(event.target.closest("button.js-task-btn--complete")){
                            this.#taskComplete(li);
                        } else if(event.target.closest("button.js-task-btn--edit")){
                            this.#taskEdit(li);
                        } else if(event.target.closest("button.js-task-btn--delete")){
                            this.#taskDelete(li);
                        }
                    }
                } else if((e == "keyup" && event.keyCode === 13) || e == "focusout"){
                    if(event.target.classList.contains("js-task-input")){
                        this.#taskInput(event.target);
                    }
                }
            });
        });
        return element;
    }

    #addTask(task, status){
        const li = `<li data-completed="${status}">
                        <input class="js-task-input" type="text" value="${task}" readonly>
                        <div class="todo__task-actions">
                            <button class="js-task-btn js-task-btn--complete" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>                                                                                
                            </button>
                            <button class="js-task-btn js-task-btn--edit" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                            <button class="js-task-btn js-task-btn--delete" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>                                          
                            </button>
                        </div>
                    </li>`;
        this.element.innerHTML += li;
    }

    #taskInput(input){
        input.setAttribute("readonly", "");
        input.classList.remove("editable");
    }
    
    #taskComplete(task){
        task.classList.toggle("completed");
        task.dataset.completed = task.dataset.completed == "true" ? "false" : "true";
        this.itemsLeft();
        this.#saveData();
    }
    
    #taskEdit(task){
        const input = task.querySelector(".js-task-input");
        if(task.dataset.completed == "true") this.#taskComplete(task);
        if(input.hasAttribute("readonly")){
            input.removeAttribute("readonly");
            input.setSelectionRange(input.value.length, input.value.length);
            input.focus();
        } else {
            input.setAttribute("readonly", "");
        }
        input.classList.toggle("editable");
        this.#saveData();
    }
    
    #taskDelete(task){
        task.remove();
        this.itemsLeft();
        this.#saveData();
    }

    #saveData(){
        const data = [];
        const tasks = this.element.querySelectorAll("li");
        tasks.forEach(task => {
            const value = task.querySelector("input").value;
            data.push({value: value, status: task.dataset.completed});
        });
        localStorage.setItem("todo", JSON.stringify(data));
    }

    #getData(){
        const data = JSON.parse(localStorage.getItem("todo"));
        this.#addTasksFromStorage(data);
    }

    #addTasksFromStorage(tasks){
        if(tasks == null) return;
        tasks.forEach(task => {
            this.createTask(task.value, task.status);
            if(task.status == "true"){
                const li = this.element.lastElementChild;
                li.classList.add("completed");
            }
        });
    }
}

const toDo = new ToDo(todoList, taskItemsLeft);
