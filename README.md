# NoteTakingApp

A beginner-friendly note-taking application with a React frontend and Express backend.

## Features

- Create notes with title and content
- View a list of all notes
- Search notes by name (exact match) or content (substring match)
- Sort notes by name or date
- Responsive design that works on all devices

## Project Structure

### Frontend (React)

The frontend is built with React and uses:

- React functional components
- Basic hooks (useState, useEffect)
- Tailwind CSS for styling
- Lucide React for icons

### Backend (Express)

The backend is built with Express and TypeScript:

- Stores notes in a JSON file
- Implements manual search and sort algorithms
- Provides REST API endpoints for note operations

## Setup Instructions

### Running the Backend

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3001

### Running the Frontend

1. In a new terminal, navigate to the project root directory

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## API Endpoints

- `GET /notes` - Get all notes
- `POST /notes` - Create a new note
- `GET /notes/search?name=query` - Search notes by name
- `GET /notes/search?content=query` - Search notes by content
- `GET /notes/sort?key=name&order=asc` - Sort notes by name or date
- `DELETE /notes/:id` - Delete a note

## Project Implementation Details

### Manual Algorithms

This project manually implements:

- Case-insensitive string comparison for name search
- Substring search for content search
- Bubble sort for sorting notes

These implementations avoid using built-in methods as per requirements.
