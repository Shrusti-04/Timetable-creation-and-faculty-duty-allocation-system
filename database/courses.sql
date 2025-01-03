-- Create courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `course_code` varchar(10) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `credits` decimal(3,1) NOT NULL,
  PRIMARY KEY (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Insert sample courses
INSERT INTO `courses` (`course_code`, `course_name`, `semester`, `credits`) VALUES
('CS101', 'Introduction to Programming', 1, 4.0),
('CS102', 'Data Structures', 2, 4.0),
('CS201', 'Database Management Systems', 3, 4.0),
('CS202', 'Web Technologies', 3, 4.0),
('CS301', 'Software Engineering', 5, 4.0),
('CS302', 'Computer Networks', 5, 4.0),
('CS401', 'Artificial Intelligence', 7, 4.0),
('CS402', 'Machine Learning', 7, 4.0);
