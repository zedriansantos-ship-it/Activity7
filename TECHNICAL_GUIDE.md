# Donezo Technical Guide

## Architecture

### Backend (NestJS + Mongoose)
The backend is an API that talks to a MongoDB database.
- **Modules**: Projects, Tasks, Users.
- **Database**: MongoDB (NoSQL) allows flexible schema definitions. We use Mongoose schemas to define the shape of our data.
- **Relationships**:
  - Tasks link to Projects via `projectId`.
  - Tasks link to Users via `userId`.

### Frontend (React + Vite)
The frontend is a Single Page Application (SPA).
- **Three-Column Layout**:
  - **Projects**: List of all projects.
  - **Tasks**: The central board showing tasks for the selected project.
  - **Team**: List of users who can be assigned to tasks.
- **State Management**: Simple React `useState` hooks handle the data fetched from the API.

## Key Files
- \ackend/src/app.module.ts\: Main configuration, including MongoDB connection.
- \ackend/src/schemas/*.schema.ts\: Database data models.
- \rontend/src/components/Board.jsx\: The main UI component handling all logic.
- \rontend/src/services/api.js\: Centralized API calls using Axios.
