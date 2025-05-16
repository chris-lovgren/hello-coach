# Football Team Management System

A full-stack application for managing a football team's roster, allowing coaches to add players, assign positions, and track player status.

## Features

- Create, read, update, and delete (CRUD) operations for team players
- Assign player positions (Defender, Midfielder, Attacker)
- Track player status (Playing/Benched)
- Player-specific management
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

- `POST /player` - Add a new player to the team
- `GET /players` - Retrieve all team players
- `PUT /todo/checked/:id` - Toggle player status (Playing/Benched)
- `PUT /todo/prio/:id` - Update player position
- `DELETE /todo/delete/:id` - Remove a player from the team

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

Each player in the system has the following structure:
```json
{
  "id": "uuid",
  "checked": boolean,    // true = Playing, false = Benched
  "prio": number (1-3),  // 1 = Defender, 2 = Midfielder, 3 = Attacker
  "firstName": string,
  "lastName": string
}
```

## Error Handling

The application includes custom error handling for:
- Validation errors (e.g., missing required fields)
- Server errors
- Invalid position values
