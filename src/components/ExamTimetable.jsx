import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamTimetable.css';
import { generateTimetablePDF } from './TimetablePDF';

const ExamTimetable = () => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState(() => localStorage.getItem('examType') || '');
  const [semester, setSemester] = useState(() => localStorage.getItem('semester') || '');
  const [department, setDepartment] = useState(() => localStorage.getItem('department') || 'both');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endAmPm, setEndAmPm] = useState('AM');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCodeAI, setCourseCodeAI] = useState('');
  const [courseNameAI, setCourseNameAI] = useState('');
  const [timetableEntries, setTimetableEntries] = useState(() => {
    const savedEntries = localStorage.getItem('timetableEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    date: '',
    startTime: '',
    endTime: '',
    startAmPm: 'AM',
    endAmPm: 'AM',
    courseCode: '',
    courseName: '',
    courseCodeAI: '',
    courseNameAI: '',
    department: 'both'
  });

  useEffect(() => {
    localStorage.setItem('examType', examType);
    localStorage.setItem('semester', semester);
    localStorage.setItem('department', department);
    localStorage.setItem('timetableEntries', JSON.stringify(timetableEntries));
  }, [examType, semester, department, timetableEntries]);

  const handleExamTypeChange = (e) => {
    setExamType(e.target.value);
    setTimetableEntries([]);
    localStorage.removeItem('timetableEntries'); // Clear entries when exam type changes
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    setTimetableEntries([]);
    localStorage.removeItem('timetableEntries'); // Clear entries when semester changes
  };

  const clearTimetableData = () => {
    localStorage.removeItem('examType');
    localStorage.removeItem('semester');
    localStorage.removeItem('department');
    localStorage.removeItem('timetableEntries');
    setExamType('');
    setSemester('');
    setDepartment('both');
    setTimetableEntries([]);
  };

  const handleSaveTimetable = async () => {
    if (!examType || !semester || timetableEntries.length === 0) {
      alert('Please select exam type, semester and add at least one entry');
      return;
    }

    try {
      console.log('Attempting to save timetable...');
      console.log('Server URL:', 'http://localhost:3001/api/timetable/save');
      console.log('Data being sent:', {
        examType,
        semester,
        entries: timetableEntries
      });

      const response = await fetch('http://localhost:3001/api/timetable/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examType,
          semester,
          entries: timetableEntries.map(entry => ({
            date: entry.date,
            startTime: `${entry.startTime} ${entry.startAmPm}`,
            endTime: `${entry.endTime} ${entry.endAmPm}`,
            department: entry.department,
            courseName: entry.courseName,
            courseCode: entry.courseCode
          }))
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Save successful:', result);
        alert('Timetable saved successfully!');
        clearTimetableData();
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Error saving timetable: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to connect to the server. Please check if the server is running on port 3001');
    }
  };

  const formatTimeToAMPM = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour || 12; // Convert 0 to 12
    return `${hour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleCreateNewEntry = () => {
    setShowForm(true);
    setCurrentEntry({
      date: '',
      startTime: '',
      endTime: '',
      startAmPm: 'AM',
      endAmPm: 'AM',
      courseCode: '',
      courseName: '',
      courseCodeAI: '',
      courseNameAI: '',
      department: 'both'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newEntry = {
      date,
      startTime: `${startTime} ${startAmPm}`,
      endTime: `${endTime} ${endAmPm}`,
      courseCode,
      courseName,
      courseCodeAI: department === 'both' ? courseCode : (department === 'csai' ? courseCodeAI : ''),
      courseNameAI: department === 'both' ? courseName : (department === 'csai' ? courseNameAI : ''),
      department
    };

    setTimetableEntries([...timetableEntries, newEntry]);
    setShowForm(false);
    // Reset form
    setDate('');
    setStartTime('');
    setEndTime('');
    setStartAmPm('AM');
    setEndAmPm('AM');
    setCourseCode('');
    setCourseName('');
    setCourseCodeAI('');
    setCourseNameAI('');
  };

  const handleEditEntry = (index) => {
    const entry = timetableEntries[index];
    setCurrentEntry({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      startAmPm: entry.startTime.includes('PM') ? 'PM' : 'AM',
      endAmPm: entry.endTime.includes('PM') ? 'PM' : 'AM',
      courseCode: entry.courseCode,
      courseName: entry.courseName,
      courseCodeAI: entry.courseCodeAI,
      courseNameAI: entry.courseNameAI,
      department: entry.department
    });
    setShowForm(true);
  };

  const handleDeleteEntry = (index) => {
    const newEntries = timetableEntries.filter((_, i) => i !== index);
    setTimetableEntries(newEntries);
  };

  const handleDownloadPDF = () => {
    if (timetableEntries.length === 0) {
      alert('Please add some entries to the timetable first');
      return;
    }
    
    const formattedData = timetableEntries.map(entry => {
      const date = new Date(entry.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      return {
        date: date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        day: day,
        time: `${entry.startTime} - ${entry.endTime}`,
        cse_course: entry.courseCode,
        cseai_course: entry.courseCodeAI // Use CSE course if CSE-AI is not specified
      };
    });

    generateTimetablePDF(examType, semester, formattedData);
  };

  return (
    <div className="exam-timetable-container">
      <h2>Welcome, Faculty Member!</h2>
      
      <div className="exam-form">
        <div className="form-group">
          <label>Select Exam Type:</label>
          <select value={examType} onChange={handleExamTypeChange} required>
            <option value="">Select Exam Type</option>
            <option value="ISA1">ISA 1</option>
            <option value="ISA2">ISA 2</option>
            <option value="ESA">ESA</option>
          </select>
        </div>

        {examType && (
          <div className="form-group">
            <label>Select Semester:</label>
            <select value={semester} onChange={handleSemesterChange} required>
              <option value="">Select Semester</option>
              <option value="III">Semester III</option>
              <option value="IV">Semester IV</option>
              <option value="V">Semester V</option>
              <option value="VI">Semester VI</option>
              <option value="VII">Semester VII</option>
              <option value="VIII">Semester VIII</option>
            </select>
          </div>
        )}

        {semester && !showForm && (
          <button className="create-btn" onClick={handleCreateNewEntry}>
            Create New Entry
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="entry-form">
            <div className="form-group">
              <label>Department:</label>
              <select 
                value={department} 
                onChange={(e) => {
                  setDepartment(e.target.value);
                  // Reset CSE-AI fields when switching to 'both'
                  if (e.target.value === 'both') {
                    setCourseCodeAI('');
                    setCourseNameAI('');
                  }
                }}
                required
              >
                <option value="both">CSE & CSE-AI</option>
                <option value="cs">CSE Only</option>
                <option value="csai">CSE-AI Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time:</label>
                <div className="time-input">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                  <select
                    value={startAmPm}
                    onChange={(e) => setStartAmPm(e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>End Time:</label>
                <div className="time-input">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                  <select
                    value={endAmPm}
                    onChange={(e) => setEndAmPm(e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            {(department === 'cs' || department === 'both') && (
              <div className="form-row">
                <div className="form-group">
                  <label>Course name:</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course code:</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {department === 'csai' && (
              <div className="form-row">
                <div className="form-group">
                  <label>CSE-AI Course Code:</label>
                  <input
                    type="text"
                    value={courseCodeAI}
                    onChange={(e) => setCourseCodeAI(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CSE-AI Course Name:</label>
                  <input
                    type="text"
                    value={courseNameAI}
                    onChange={(e) => setCourseNameAI(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="button-group">
              <button type="submit" className="save-btn">Add Entry</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {timetableEntries.length > 0 && (
          <div className="timetable">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Slot</th>
                  {(department === 'cs' || department === 'both') && (
                    <th>CSE Course</th>
                  )}
                  {(department === 'csai' || department === 'both') && (
                    <th>CSE-AI Course</th>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetableEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{`${entry.startTime} - ${entry.endTime}`}</td>
                    {(department === 'cs' || department === 'both') && (
                      <td>{`${entry.courseCode} - ${entry.courseName}`}</td>
                    )}
                    {(department === 'csai' || department === 'both') && (
                      <td>{`${entry.courseCodeAI || entry.courseCode} - ${entry.courseNameAI || entry.courseName}`}</td>
                    )}
                    <td>
                      <button onClick={() => handleEditEntry(index)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteEntry(index)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="action-buttons">
              <button onClick={handleDownloadPDF} className="download-btn">
                Download PDF
              </button>
              <button onClick={handleSaveTimetable} className="save-btn">
                Save Timetable
              </button>
              {!showForm && (
                <div className="button-group">
                  <button className="create-btn" onClick={handleCreateNewEntry}>
                    Add Another Entry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTimetable;
