# Task Management App

This is a full-stack task management application built with React (frontend) and Node.js/Express with MySQL (backend). The app allows users to create, manage, and track tasks efficiently.

## Features

- Add, edit, delete tasks
- Task move functionality with "To-Do", "Hold", and "Completed" sections
- Dark mode toggle
- API for managing tasks
- Responsive UI using React, Vite, and TailwindCSS
- Backend built with Node.js, Express, and MySQL
- Docker support for deployment
- CI/CD with GitHub Actions

## Tech Stack

### Frontend:
- React
- Vite
- Tailwind CSS
- Cypress (for testing)

### Backend:
- Node.js
- Express
- MySQL (Database)
- Sequelize (ORM)
- Docker
- GitHub Actions (CI/CD)

## Installation

### Prerequisites
Ensure you have the following installed on your system:
- Node.js & npm
- MySQL
- Docker (if running with Docker)
- Git

### Clone the Repository
```bash
git clone https://github.com/bsen-alt/taskApp_coveragex.git
cd taskApp_coveragex
```

### Setup Backend

#### 1. Configure Environment Variables
Create a `.env` file in the root of the `server` directory and add the following:
```env
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name (preferebly todo_db)
```

#### 2. Install Dependencies
```bash
cd server
npm install
```

#### 3. Run Database Migrations
```bash
npx sequelize-cli db:migrate
```

#### 4. Start the Backend Server
```bash
npm start
```

---

### Setup Frontend

#### 1. Install Dependencies
```bash
cd client
npm install
```

#### 2. Start the Frontend
```bash
npm run dev
```

This will start the React application at `http://localhost:5173`.

---

## Running with Docker

### 1. Build and Run Containers
```bash
docker-compose up --build
```
This will start both the backend and frontend using Docker.

### 2. Stopping Containers
```bash
docker-compose down
```

---

## Deployment

### Frontend (Vercel)
1. Deployed the frontend to [Vercel](https://taskapp-coveragex.vercel.app).
2. Ensure the API URL in the frontend `.env` file matches the deployed backend.

---

## Testing

### Running Cypress Tests
```bash
cd client
npx cypress open
```

---

## CI/CD with GitHub Actions
- The repository includes a GitHub Actions workflow for automated testing.
- Any push to the `master` branch triggers a CI/CD pipeline.

---

## Design and Development
- [Bawanga Senevirathne](https://github.com/bsen-alt)

