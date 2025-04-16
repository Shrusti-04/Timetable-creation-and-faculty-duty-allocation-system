import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./FacultyDutyAllocation.css";

const FacultyDutyAllocation = () => {
  const [examType, setExamType] = useState("ISA1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacultyAndClassrooms();
  }, []);

  const fetchFacultyAndClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch faculty list
      const facultyResponse = await fetch("http://localhost:3001/api/faculty");
      if (!facultyResponse.ok) {
        throw new Error("Failed to fetch faculty data");
      }
      const facultyData = await facultyResponse.json();

      // Fetch classroom data
      const classroomResponse = await fetch(
        "http://localhost:3001/api/classrooms"
      );
      if (!classroomResponse.ok) {
        throw new Error("Failed to fetch classroom data");
      }
      const classroomData = await classroomResponse.json();

      // Filter active classrooms (those with non-zero QP count)
      const activeClassrooms = classroomData.filter(
        (room) => room.third_sem_qp_count > 0 || room.fifth_sem_qp_count > 0
      );

      setFacultyList(facultyData);
      setClassrooms(activeClassrooms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleAllocation = async (e) => {
    if (e) e.preventDefault();
    try {
      setError(null);

      if (!examType || !startDate || !endDate) {
        throw new Error("Please select exam type and dates");
      }

      // Get dates between start and end date
      const dates = getDatesInRange(startDate, endDate);

      // Create allocations for each date and classroom
      const newAllocations = [];
      let allocationIndex = 1;

      dates.forEach((date) => {
        const formattedDate = date.toISOString().split("T")[0];

        // For each classroom
        classrooms.forEach((classroom) => {
          // Shuffle faculty list for this classroom
          const shuffledFaculty = [...facultyList].sort(
            () => Math.random() - 0.5
          );

          // Morning session - 2 faculty
          const morningFaculty1 = shuffledFaculty[0];
          const morningFaculty2 = shuffledFaculty[1];

          newAllocations.push({
            sno: allocationIndex++,
            name: morningFaculty1.name,
            date: formattedDate,
            session: "morning",
            classroom: classroom.classroom,
          });

          newAllocations.push({
            sno: allocationIndex++,
            name: morningFaculty2.name,
            date: formattedDate,
            session: "morning",
            classroom: classroom.classroom,
          });

          // Afternoon session - 2 faculty
          const afternoonFaculty1 = shuffledFaculty[2];
          const afternoonFaculty2 = shuffledFaculty[3];

          newAllocations.push({
            sno: allocationIndex++,
            name: afternoonFaculty1.name,
            date: formattedDate,
            session: "afternoon",
            classroom: classroom.classroom,
          });

          newAllocations.push({
            sno: allocationIndex++,
            name: afternoonFaculty2.name,
            date: formattedDate,
            session: "afternoon",
            classroom: classroom.classroom,
          });
        });
      });

      // Save allocations to database
      const response = await fetch(
        "http://localhost:3001/api/duty-allocation/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examType: examType,
            allocations: newAllocations,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save duty allocations");
      }

      setAllocations(newAllocations);
      generatePDF(newAllocations);
      alert("Duty allocation completed successfully!");
    } catch (error) {
      console.error("Error in handleAllocation:", error);
      setError(error.message);
      alert(error.message || "Failed to allocate duties. Please try again.");
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    // Make sure we have valid date objects
    let currentDate = new Date(start);
    const endDate = new Date(end);

    // Ensure the dates are valid
    if (isNaN(currentDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD format.");
    }

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const generatePDF = (allocations) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("FACULTY INVIGILATION DUTY SCHEDULE", 105, 20, {
      align: "center",
    });

    // Create table headers
    const headers = [
      [
        "sno",
        "name",
        "date",
        "session(afternoon/morning)",
        "classrooms",
        "sign",
      ],
    ];

    // Create table rows
    const rows = allocations.map((allocation) => [
      allocation.sno,
      allocation.name,
      formatDate(allocation.date),
      allocation.session,
      allocation.classroom,
      "",
    ]);

    // Generate the table
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 15 }, // sno
        1: { cellWidth: 50 }, // name
        2: { cellWidth: 30 }, // date
        3: { cellWidth: 40 }, // session
        4: { cellWidth: 30 }, // classrooms
        5: { cellWidth: 25 }, // sign
      },
    });

    // Save PDF
    doc.save("faculty_duty_schedule.pdf");

    // Clear allocations from database after PDF is generated
    clearAllocations();
  };

  const clearAllocations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/duty-allocation/clear",
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear allocations");
      }

      // Clear the local state
      setAllocations([]);
    } catch (error) {
      console.error("Error clearing allocations:", error);
      // Don't show error to user since PDF was already generated
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="duty-allocation-container">
      <h2>Faculty Duty Allocation</h2>

      <div className="allocation-form">
        <form onSubmit={handleAllocation}>
          <div className="form-group">
            <label>Exam Type:</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select Exam</option>
              <option value="ISA1">ISA 1</option>
              <option value="ISA2">ISA 2</option>
              <option value="ESA">ESA</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            className="allocate-btn"
            disabled={!examType || !startDate || !endDate}
          >
            Allocate Duties
          </button>
        </form>
      </div>

      {allocations.length > 0 && (
        <div className="allocation-results">
          <h3>Duty Allocation Results</h3>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Date</th>
                <th>Session</th>
                <th>Classroom</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={index}>
                  <td>{allocation.sno}</td>
                  <td>{allocation.name}</td>
                  <td>{formatDate(allocation.date)}</td>
                  <td>{allocation.session}</td>
                  <td>{allocation.classroom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyDutyAllocation;
