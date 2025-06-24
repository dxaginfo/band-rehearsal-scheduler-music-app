# Rehearsal Scheduler

A web application for bands to schedule rehearsals, track attendance, and optimize practice times.

## Features

- Calendar & Scheduling Management
- Member Management
- Availability Tracking
- Notification System
- Venue/Space Management
- Attendance Tracking
- Mobile Responsiveness

## Technology Stack

### Frontend
- React.js with React Router
- Redux Toolkit
- Material UI
- FullCalendar.js

### Backend
- Node.js with Express.js
- PostgreSQL & Redis
- JWT Authentication
- Socket.io for real-time updates

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL
- Redis

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/dxaginfo/band-rehearsal-scheduler-music-app.git
   cd band-rehearsal-scheduler-music-app
   ```

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your database credentials and other settings

5. Initialize database
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. Start the development servers
   - Backend: `npm run dev` (from backend directory)
   - Frontend: `npm start` (from frontend directory)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.