console.log("Hello, from main.js");

let todos = [];

// Keep track of what's been written in our inputs
let owner = "";
let todo = "";

const ownerInput = document.getElementById("owner");
const todoInput = document.getElementById("task");
const button = document.getElementById("submit");
const list = document.getElementById("todos");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");

/**
 * @name createTodo
 * @description Creates a todo item in our backend
 */
const createTodo = async () => {
	try {
		if (!owner || !todo) {
			errorMessage.textContent = "Please fill in all fields";
			return;
		}

		const res = await fetch("/todo", {
			method: "POST",
			body: JSON.stringify({
				owner,
				todo,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const body = await res.json();
		
		if (!res.ok) {
			errorMessage.textContent = body.error;
			return;
		}

		// Clear error message on success
		errorMessage.textContent = "";
		
		document.getElementById("heading").innerHTML = "Hello coach!";

		ownerInput.value = "";
		todoInput.value = "";

		owner = "";
		todo = "";

		renderTodos();
	} catch (error) {
		errorMessage.textContent = "Error creating player. Please try again.";
	}
};

/**
 * @name getTodos
 * @description Gets a list of todos
 */
const getTodos = async () => {
	const res = await fetch("/todos");
	const body = await res.json();
	if (!res.ok) {
		throw new Error(body.error);
	}
	// We overwrite the todos array with our new value
	todos = body;
	// We DO NOT rerender the list here because we use this function inside of the renderTodos function
};

/**
 * @name updateChecked
 * @description Updates checked for todo by id
 */
const updateChecked = async (event) => {
	const res = await fetch(`/todo/checked/${event.target.id}`, {
		method: "PUT",
	});
	const body = res.json();
	if (!res.ok) {
		throw new Error(body.error);
	}
	renderTodos();
};

/**
 * @name updatePrio
 * @description Updates priority for tody by id
 */

const updatePrio = async (event) => {
	const res = await fetch(`/todo/prio/${event.target.id}`, {
		method: "PUT",
		body: JSON.stringify({
			prio: event.target.value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const body = res.json();
	if (!res.ok) {
		throw new Error(body.error);
	}
	// We rerender the todo list to reflect the updated state
	renderTodos();
};

/**
 * @name deleteTodo
 * @description Deletes todo by id
 */
const deleteTodo = async (event) => {
	// To send a delete request we provide a options object with the property method set to DELETE.
	await fetch(`/todo/delete/${event.target.id}`, {
		method: "DELETE",
	});
	renderTodos();
};

const createLiNoDataAvailable = () => {
	const container = document.createElement("li");
	container.textContent = "No players in the squad. Add a player!";
	return container;
};


const createCheckBoxColumn = (item) => {
	const container = document.createElement("div");
	const button = document.createElement("button");
	button.id = item.id;
	button.className = item.checked ? "status-button playing" : "status-button benched"; //
	button.textContent = item.checked ? "Playing" : "Benched";
	button.style.backgroundColor = item.checked ? "#4CAF50" : "#f44336";
	button.style.borderColor = item.checked ? "#4CAF50" : "#f44336";

	container.appendChild(button);

	button.addEventListener("click", updateChecked);

	return container;
};

const createTextNodeColumn = (item) => {
	const container = document.createElement("div");
	container.textContent = `${item.owner} ${item.todo}`;
	return container;
};

const createDeleteButtonColumn = (id) => {
	const container = document.createElement("div");
	const button = document.createElement("button");
	button.id = id;
	button.innerText = "Remove";

	container.appendChild(button);

	container.addEventListener("click", deleteTodo);

	return container;
};

// Now here it gets a bit trickier. We want to render a drop down using the browser
// native select element.
const createPrioDropdown = (item) => {
	const container = document.createElement("div");
	const dropdown = document.createElement("select");
	dropdown.id = item.id;
	const prioArr = [1, 2, 3];
	const positionNames = {
		1: "Defender",
		2: "Midfielder",
		3: "Attacker"
	};
	for (prio of prioArr) {
		dropdown.options.add(new Option(positionNames[prio], prio));
	}
	dropdown.value = item.prio;
	dropdown.addEventListener("change", updatePrio);
	container.appendChild(dropdown);
	return container;
};

const createLiElementRow = (item) => {
	const container = document.createElement("li");
	container.appendChild(createCheckBoxColumn(item));
	container.appendChild(createPrioDropdown(item));
	container.appendChild(createTextNodeColumn(item));
	container.appendChild(createDeleteButtonColumn(item.id));
	return container;
};

const sortTodosByPrio = () =>
	todos.sort((a, b) => {
		if (a.prio < b.prio) {
			return -1;
		}
		if (a.prio > b.prio) {
			return 1;
		}

		return 0;
	});

// This function is very central to our rendering of the application
const renderTodos = async () => {
	try {

		await getTodos();
		list.innerHTML = "";

		if (todos.length) {
			for (nameItem of sortTodosByPrio()) {
				const listElement = createLiElementRow(nameItem);
				list.appendChild(listElement);
			}
		} else {

			const el = createLiNoDataAvailable();
			list.appendChild(el);
		}
	} catch (error) {
		errorMessage.textContent = error.message;
	}
};

const handleSetOwner = (event) => {
	owner = event.target.value;
	event.target.value = owner;
};

const handleSetTodo = (event) => {
	todo = event.target.value;
	event.target.value = todo;
};

const handleEnter = (event, nameType) => {
	if (event.key === "Enter") {
		if (nameType === "owner") {
			handleSetOwner(event);
		}
		if (nameType === "todo") {
			handleSetTodo(event);
		}
		if (!owner) {
			errorMessage.textContent = "No first name set";
			return;
		}
		if (!todo) {
			errorMessage.textContent = "Please enter the player's last name";
			return;
		}
		errorMessage.textContent = "";  // Clear any previous errors
		createTodo();
	}
};

button.addEventListener("click", createTodo);

ownerInput.addEventListener("change", handleSetOwner);
todoInput.addEventListener("change", handleSetTodo);

ownerInput.addEventListener("keypress", (event) => handleEnter(event, "owner"));

todoInput.addEventListener("keypress", (event) => handleEnter(event, "todo"));

document.addEventListener("DOMContentLoaded", renderTodos);
