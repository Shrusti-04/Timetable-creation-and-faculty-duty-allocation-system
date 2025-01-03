import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateTimetablePDF = (examType, semester, timetableData) => {
    // Initialize PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set title
    const title = `${examType} Time Table for ${semester} Semester CSE & CSE-AI`;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pdf.internal.pageSize.width/2, 20, { align: 'center' });

    // Define columns
    const columns = [
        { header: 'Date/Day', dataKey: 'date' },
        { header: 'Time', dataKey: 'time' },
        { 
            header: 'Course Name',
            dataKey: 'course',
            subHeaders: ['CSE', 'CSE-AI']
        }
    ];

    // Format data for the table
    const formattedData = timetableData.map(entry => ({
        date: `${entry.date}\n${entry.day}`,
        time: entry.time,
        cse: entry.cse_course,
        cseai: entry.cseai_course
    }));

    // Configure table styling
    const styles = {
        head: {
            fillColor: [255, 193, 7], // Yellow background for header
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 10
        },
        body: {
            fontSize: 9
        }
    };

    // Configure table options
    const options = {
        startY: 30,
        head: [
            [
                { content: 'Date/Day', rowSpan: 2 },
                { content: 'Time', rowSpan: 2 },
                { content: 'Course Name', colSpan: 2 }
            ],
            ['CSE', 'CSE-AI']
        ],
        body: formattedData.map(row => [
            row.date,
            row.time,
            row.cse,
            row.cseai
        ]),
        theme: 'grid',
        headStyles: styles.head,
        bodyStyles: styles.body,
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 },
            2: { cellWidth: 60 },
            3: { cellWidth: 60 }
        },
        styles: {
            cellPadding: 2,
            fontSize: 9,
            valign: 'middle',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    };

    // Generate table
    pdf.autoTable(options);

    // Save PDF
    pdf.save(`${examType}_${semester}_timetable.pdf`);
};
