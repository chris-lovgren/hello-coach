# Todo List Application

A full-stack todo list application that allows users to manage their tasks with features like priority levels, task completion tracking, and user-specific task management.

## Features

- Create, read, update, and delete (CRUD) operations for todo items
- Assign priority levels (1-3) to tasks
- Mark tasks as complete/incomplete
- User-specific task management
- Persistent storage using JSON file system
- RESTful API endpoints
- Modern web interface

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Static files served from the `dist` directory
- **Data Storage**: JSON file-based storage
- **Development**: Nodemon for hot-reloading

## Project Structure

```
├── data/           # JSON data storage
├── dist/           # Frontend static files
├── server.js       # Main server application
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

## API Endpoints

- `POST /todo` - Create a new todo item
- `GET /todos` - Retrieve all todo items
- `PUT /todo/checked/:id` - Toggle todo completion status
- `PUT /todo/prio/:id` - Update todo priority
- `DELETE /todo/delete/:id` - Delete a todo item

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

The project uses `nodemon` for development. You can run the server in two ways:

1. Using npx (recommended):
   ```bash
   npx nodemon server.js
   ```

2. Using globally installed nodemon:
   ```bash
   nodemon server.js
   ```

The server will start on port 3000. Access the application at `http://localhost:3000`.

## Data Structure

Each todo item in the system has the following structure:
```json
{
  "id": "uuid",
  "checked": boolean,
  "prio": number (1-3),
  "owner": string,
  "todo": string
}
```

## Error Handling

The application includes custom error handling for:
- Validation errors (e.g., missing required fields)
- Server errors
- Invalid priority values
