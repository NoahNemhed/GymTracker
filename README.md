# Gym Tracker

A fullstack gym tracking app which allows users to signup, login create a program, add days to program, add exercises to days and complete a workout.

##  Problem
The app helps users structure their workouts by logging completed exercises and sets.
---

##  Tech Stack

- Frontend: React (Vite)
- Backend: Express.js
- Database: MongoDB Atlas
- Auth: JWT

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/NoahNemhed/GymTracker
cd GymTracker
```

### 2. Install dependencies
npm install
cd server && npm install
cd ../client && npm install

### 3. Configure env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000

### 4. start the app
npm run dev

### 5. Open in browser
http://localhost:5173


##  Features
Create training programs
Add and remove exercises
Set reps, sets, and rest time
Start workouts
Track completed sets
Save completed workout sessions
View profile summary with recent workouts and workout statistics


## API Overview
### Auth
- POST /api/auth/register
- POST /api/auth/login

### Exercises
- GET /api/exercises
- GET /api/exercises/:id

### Programs
- POST /api/programs
- GET /api/programs
- GET /api/programs/:id
- PUT /api/programs/:id
- DELETE /api/programs/:id
- PATCH /api/programs/:id/activate

### Workouts
- POST /api/workouts
- GET /api/workouts
- GET /api/workouts/stats

## Data Model
### Users
#### Stores user credentials and authentication data

### Programs
#### Contains training programs created by users.  
#### Each program belongs to one user through userId.

### Exercises
#### Stores exercise metadata (name, muscles, aliases)

### WorkoutSessions
#### Stores completed workouts with performed sets
#### Each workout session belongs to one user through userId and references one program through programId.  
#### Workout sessions store planned sets and completed sets for each exercise.


## Seed Data
The exercises collection is seeded from server/exercises.json using server/seedExercises.js.  
Users, programs, and workout sessions are created through the application UI with realistic data.



## Notes
JWT authentication is required for protected routes
All API calls include Authorization header