# ISA Timetable System

A comprehensive web application for managing In-Semester Assessment (ISA) timetables and faculty duty allocation at KLE Technological University.

## Features

### 1. User Authentication
- Secure login system for administrators and faculty
- Role-based access control
- Session management

### 2. Dashboard
- Clean and intuitive interface
- Quick access to all major functionalities
- Real-time updates and notifications

### 3. Exam Timetable Management
- Create and manage exam schedules
- Support for multiple exam types (ISA 1, ISA 2, ESA)
- Automatic conflict detection
- Room allocation management

### 4. Faculty Duty Allocation
- Automated duty allocation system
- Fair distribution of invigilation duties
- Support for both morning and afternoon sessions
- PDF generation of duty schedules
- Classroom-wise faculty assignment

### 5. Database Management
- MySQL database for storing:
  - Faculty information
  - Classroom details
  - Exam schedules
  - Duty allocations

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Modern CSS with Flexbox
- PDF generation using jsPDF

### Backend
- Node.js
- Express.js
- MySQL database
- RESTful API architecture

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd WT
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up the database:
- Import the SQL files from the database folder
- Configure database connection in backend/server.js

5. Start the application:
```bash
# Start backend server
cd backend
npm start

# Start frontend (in a new terminal)
cd ..
npm run dev
```

## Project Structure

```
WT/
├── src/                    # Frontend source files
│   ├── components/        # React components
│   ├── assets/           # Static assets
│   └── App.jsx           # Main application component
├── backend/              # Backend server files
│   └── server.js         # Express server setup
├── database/             # SQL files and database scripts
└── public/              # Public assets
```

## API Endpoints

### Authentication
- POST `/api/login` - User authentication

### Faculty Management
- GET `/api/faculty` - Get faculty list
- POST `/api/faculty` - Add new faculty

### Duty Allocation
- POST `/api/allocate-duties` - Allocate invigilation duties
- GET `/api/duty-allocation` - Get duty allocation details
- DELETE `/api/duty-allocation/clear` - Clear duty allocations

### Classroom Management
- GET `/api/classrooms` - Get classroom list
- POST `/api/classrooms` - Add new classroom

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- KLE Technological University for the opportunity
- All faculty members who provided feedback
- The development team for their contributions
