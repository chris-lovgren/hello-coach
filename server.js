import express from "express";
import path, { dirname } from "node:path";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
const __dirname = path.resolve();

const app = express();

const fileName = path.join(__dirname, "data", "name.json");

/**
 * @description This function opens a file in the file system containing JSON and loads the JSON into memory
 * @return {object} The JSON structure defined in data/name.json
 * @notice data/name.json needs to be manually initialized with at least "[]" i.e. an empty array
 */
function readJsonFile() {
	const file = fs.readFileSync(fileName, {
		encoding: "utf-8", 
		flag: "r+", 
	});
	return JSON.parse(file);
}

/**
 * @description Writes an object as JSON to a file in the file system
 * @param {object} The object that is to be written
 */
function wrtieToJsonFile(data) {
	fs.writeFileSync(fileName, JSON.stringify(data));
}

app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());

/**
 * @description A custom error object, extends Error
 */
class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
	}
}

/**
 * @description This enpoint creates (C in CRUD) a todo.
 */
app.post("/todo", (req, res) => {
	try {
		if (!req.body.owner) {
			throw new ValidationError("Missing owner of todo");
		}
		if (!req.body.todo) {
			throw new ValidationError("Missing task");
		}
		const data = readJsonFile();

		data.push({
			id: uuidv4(),
			checked: false,
			prio: 3,
			owner: req.body.owner,
			todo: req.body.todo,
		});

		wrtieToJsonFile(data);

		res.send({ message: `Hello, ${req.body.owner}` });
	} catch (error) {
		console.error(JSON.stringify({ error: error.message, fn: "/todo" }));
		if (error instanceof ValidationError) {
			res.status(400).send({ error: error.message });
		} else {
			res.status(500).send({ error: "Unable to write new names" });
		}
	}
});

/**
 * @description This endpoint reads (R in CRUD) a list of todos
 */
app.get("/todos", (req, res) => {
	try {
		const data = readJsonFile(); // We read and load in our JSON structure from the file system to memory
		res.send(data); // We send that to the end user. We haven't specified status code so it will be 200 (OK)
	} catch (error) {
		console.log(JSON.stringify({ error: error.message, fn: "/names" }));
		res.status(500).send({ error: "Unable to load names" });
	}
});

/**
 * @description This endpoints updates (U in CRUD) the checked state of a todo by id
 */
app.put("/todo/checked/:id", (req, res) => {
	try {

		const data = readJsonFile().map((data) => {
			if (data.id === req.params.id) {
				data.checked = !data.checked;
			}
			return data;
		});
		wrtieToJsonFile(data); 
		res.json(data.filter((d) => d.id === req.params.id));
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ error: "Unable to update done. Try again later..." });
	}
});

/**
 * @description This endpoint updates (U in CRUD) a priority of a todo by id
 */
app.put("/todo/prio/:id", (req, res) => {
	try {
		if (req.body.prio > 3) {
			throw new ValidationError("Prio can't be larger than 3"); 
		}
		const data = readJsonFile().map((data) => {
			if (data.id === req.params.id) {
				data.prio = Number.parseInt(req.body.prio);
			}
			return data;
		});
		// Write to file system
		wrtieToJsonFile(data);
		res.json(data.filter((d) => d.id === req.params.id));
	} catch (error) {
		console.error(
			JSON.stringify({ error: error.message, fn: "/todo/prio/:id" }),
		);
		if (error instanceof ValidationError) {
			res.status(400).send({ error: error.message });
		} else {
			res
				.status(500)
				.send({ error: "Unable to update prio. Try again later..." });
		}
	}
});

/**
 * @description This endpoint deletes (D in CRUD) a todo by id
 */
app.delete("/todo/delete/:id", (req, res) => {
	try {
		const data = readJsonFile().filter((d) => d.id !== req.params.id);

		wrtieToJsonFile(data);
		res.send(data);
	} catch (error) {}
});

app.listen(3000, () => {
	console.log("Server started");
});
