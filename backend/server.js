const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'wt_cp'
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
        [username, password, role]
      );

      if (rows.length > 0) {
        res.json({ success: true, role: rows[0].role });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get faculty list
app.get('/api/faculty', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM faculty WHERE designation IN (?, ?, ?) ORDER BY name', ['Assistant Professor', 'Assistant Professor (P)', 'T.A']);
      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Failed to fetch faculty list' });
  }
});

// Get classrooms
app.get('/api/classrooms', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM classroom_data WHERE third_sem_qp_count > 0 OR fifth_sem_qp_count > 0 ORDER BY classroom');
      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Failed to fetch classroom list' });
  }
});

// Save duty allocation
app.post('/api/duty-allocation/save', async (req, res) => {
  try {
    const { examType, allocations } = req.body;

    // Validate request data
    if (!examType || !allocations || !Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Validate exam type
    if (!['ISA1', 'ISA2', 'ESA'].includes(examType)) {
      return res.status(400).json({ message: 'Invalid exam type' });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get unique dates from allocations
      const dates = [...new Set(allocations.map(a => a.date))];

      // Delete existing allocations for these dates
      await connection.query(
        'DELETE FROM duty_allocation WHERE exam_type = ? AND date IN (?)',
        [examType, dates]
      );

      // Insert new allocations
      for (const allocation of allocations) {
        await connection.query(
          'INSERT INTO duty_allocation (exam_type, date, session, faculty_name, classroom) VALUES (?, ?, ?, ?, ?)',
          [
            examType,
            allocation.date,
            allocation.session,
            allocation.name,
            allocation.classroom
          ]
        );
      }

      await connection.commit();
      res.json({ success: true, message: 'Duty allocations saved successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving duty allocations:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to save duty allocations' 
    });
  }
});

// Delete all duty allocations
app.delete('/api/duty-allocation/clear', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM duty_allocation');
      await connection.commit();
      res.json({ success: true, message: 'Duty allocations cleared successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error clearing duty allocations:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to clear duty allocations' 
    });
  }
});

// Save timetable
app.post('/api/timetable/save', async (req, res) => {
  try {
    const { examType, semester, entries } = req.body;

    // Validate request data
    if (!examType || !semester || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert each timetable entry
      const values = entries.map(entry => [
        examType,
        semester,
        entry.department,
        entry.date,
        '',  // day
        entry.startTime,
        entry.endTime,
        entry.courseName,
        entry.courseCode
      ]);

      const query = `
        INSERT INTO timetable_summary 
        (exam_type, semester, department, date, day, start_time, end_time, course_name, course_code)
        VALUES ?
      `;

      await connection.query(query, [values]);

      await connection.commit();
      res.json({ message: 'Timetable saved successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving timetable:', error);
    res.status(500).json({ message: error.message || 'Failed to save timetable' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Try the next port
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`Port ${PORT} was in use, listening on port ${newPort} instead`);
    });
  } else {
    console.error('Server error:', err);
  }
});
