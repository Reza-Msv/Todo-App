const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");
const deleteButtonAll = document.getElementById("delete-all-button");
const todosBody = document.querySelector("tbody");
const editButton = document.getElementById("edit-button");
const filter = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todo")) || [];
const saveTolocalStorage = () => {
  localStorage.setItem("todo", JSON.stringify(todos));
};

const idGenerator = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (massege, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = massege;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const todosDisplay = (data) => {
  const todosList = data || todos;
  todosBody.innerHTML = "";
  if (!todosList.length) {
    todosBody.innerHTML = `<tr><td colspan='4'>No Task Found!</td></tr>`;
    return;
  }

  todosList.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
        <td>${todo.task}</td>
        <td>${todo.date || "No date"}</td>
        <td>${todo.completed ? "completed" : "pending"}</td>
        <td>
            <button onclick="editHandler('${todo.id}')">Edit</button>
            <button onclick="toggleHandler('${todo.id}')">
            ${todo.completed ? "Undo" : "Do"}</button>
            <button onclick="deleteButton('${todo.id}')">Delete</button>
        </td>
    </tr>
    
    `;
  });
};

const addButtonHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;

  const todo = {
    id: idGenerator(),
    completed: false,
    task,
    date,
  };

  if (task.length) {
    todos.push(todo);
    saveTolocalStorage();
    todosDisplay();
    showAlert("Todo Added Successfully:)", "success");
    taskInput.value = "";
    dateInput.value = "";
  } else {
    showAlert("Please Enter An Todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveTolocalStorage();
    todosDisplay();
    showAlert("All Todos Deleted Successfully:)", "success");
  } else {
    showAlert("No Todos To Deleted!", "error");
  }
};

const deleteButton = (id) => {
  const newTodo = todos.filter((todo) => todo.id !== id);
  todos = newTodo;
  saveTolocalStorage();
  todosDisplay();
  showAlert("Todo Delted Successfully:)", "success");
};

const toggleHandler = (id) => {
  const newTodo = todos.find((todo) => todo.id === id);
  newTodo.completed = !newTodo.completed;
  saveTolocalStorage();
  todosDisplay();
  showAlert("Todo Status Changed Successfully:)", "success");
};

const editHandler = (id) => {
  const newTodo = todos.find((todo) => todo.id === id);
  taskInput.value = newTodo.task;
  dateInput.value = newTodo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const editButtonHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveTolocalStorage();
  todosDisplay();
  showAlert("Todo Edited Successfully:)", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  todosDisplay(filteredTodos);
};

window.addEventListener("load", () => todosDisplay());
editButton.addEventListener("click", editButtonHandler);
addButton.addEventListener("click", addButtonHandler);
deleteButtonAll.addEventListener("click", deleteAllHandler);
filter.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
