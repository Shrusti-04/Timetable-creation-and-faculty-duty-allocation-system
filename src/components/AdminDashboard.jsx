import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamTimetable from './ExamTimetable';
import FacultyDutyAllocation from './FacultyDutyAllocation';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch(selectedMenu) {
      case 'examtimetable':
        return <ExamTimetable />;
      case 'dutyallocation':
        return <FacultyDutyAllocation />;
      default:
        return <div className="welcome-message">Welcome to ISA Timetable System</div>;
    }
  };

  return (
    <div className="admin-layout">
      <header className="top-bar">
        <h1>ISA Timetable System</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="admin-container">
        <div className="sidebar">
          <div 
            className={`sidebar-item ${selectedMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('dashboard')}
          >
            Dashboard
          </div>
          <div 
            className={`sidebar-item ${selectedMenu === 'courses' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('courses')}
          >
            Manage Courses
          </div>
          <div 
            className={`sidebar-item ${selectedMenu === 'examtimetable' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('examtimetable')}
          >
            Create Exam Timetable
          </div>
          <div 
            className={`sidebar-item ${selectedMenu === 'dutyallocation' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('dutyallocation')}
          >
            Faculty Duty Allocation
          </div>
        </div>

        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
