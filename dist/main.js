console.log("Hello, from main.js");

let players = [];

// Keep track of what's been written in our inputs
let firstName = "";
let lastName = "";

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const button = document.getElementById("submit");
const list = document.getElementById("players");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");

/**
 * @name createPlayer
 * @description Creates a player in our backend
 */
const createPlayer = async () => {
	try {
		if (!firstName || !lastName) {
			errorMessage.textContent = "Please fill in all fields";
			return;
		}

		const res = await fetch("/player", {
			method: "POST",
			body: JSON.stringify({
				firstName,
				lastName,
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

		firstNameInput.value = "";
		lastNameInput.value = "";

		firstName = "";
		lastName = "";

		renderPlayers();
	} catch (error) {
		errorMessage.textContent = "Error creating player. Please try again.";
	}
};

/**
 * @name getPlayers
 * @description Gets a list of players
 */
const getPlayers = async () => {
	const res = await fetch("/players");
	const body = await res.json();
	if (!res.ok) {
		throw new Error(body.error);
	}
	// We overwrite the players array with our new value
	players = body;
	// We DO NOT rerender the list here because we use this function inside of the renderPlayers function
};

/**
 * @name updateChecked
 * @description Updates checked for player by id
 */
const updateChecked = async (event) => {
	const res = await fetch(`/todo/checked/${event.target.id}`, {
		method: "PUT",
	});
	const body = res.json();
	if (!res.ok) {
		throw new Error(body.error);
	}
	renderPlayers();
};

/**
 * @name updatePrio
 * @description Updates priority for player by id
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
	// We rerender the player list to reflect the updated state
	renderPlayers();
};

/**
 * @name deletePlayer
 * @description Deletes player by id
 */
const deletePlayer = async (event) => {
	// To send a delete request we provide a options object with the property method set to DELETE.
	await fetch(`/todo/delete/${event.target.id}`, {
		method: "DELETE",
	});
	renderPlayers();
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
	container.textContent = `${item.firstName} ${item.lastName}`;
	return container;
};

const createDeleteButtonColumn = (id) => {
	const container = document.createElement("div");
	const button = document.createElement("button");
	button.id = id;
	button.innerText = "Remove";

	container.appendChild(button);

	container.addEventListener("click", deletePlayer);

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

const sortPlayersByPrio = () =>
	players.sort((a, b) => {
		if (a.prio < b.prio) {
			return -1;
		}
		if (a.prio > b.prio) {
			return 1;
		}

		return 0;
	});

// This function is very central to our rendering of the application
const renderPlayers = async () => {
	try {
		await getPlayers();
		list.innerHTML = "";

		if (players.length) {
			for (nameItem of sortPlayersByPrio()) {
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

const handleSetFirstName = (event) => {
	firstName = event.target.value;
	event.target.value = firstName;
};

const handleSetLastName = (event) => {
	lastName = event.target.value;
	event.target.value = lastName;
};

const handleEnter = (event, nameType) => {
	if (event.key === "Enter") {
		if (nameType === "firstName") {
			handleSetFirstName(event);
		}
		if (nameType === "lastName") {
			handleSetLastName(event);
		}
		if (!firstName) {
			errorMessage.textContent = "No first name set";
			return;
		}
		if (!lastName) {
			errorMessage.textContent = "Please enter the player's last name";
			return;
		}
		errorMessage.textContent = "";  // Clear any previous errors
		createPlayer();
	}
};

button.addEventListener("click", createPlayer);

firstNameInput.addEventListener("change", handleSetFirstName);
lastNameInput.addEventListener("change", handleSetLastName);

firstNameInput.addEventListener("keypress", (event) => handleEnter(event, "firstName"));
lastNameInput.addEventListener("keypress", (event) => handleEnter(event, "lastName"));

document.addEventListener("DOMContentLoaded", renderPlayers);
