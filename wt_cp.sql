-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Jan 03, 2025 at 03:33 PM
-- Server version: 5.0.41
-- PHP Version: 5.2.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `wt_cp`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `classroom_data`
-- 

CREATE TABLE `classroom_data` (
  `classroom` varchar(50) default NULL,
  `third_sem_roll_numbers` varchar(50) default NULL,
  `fifth_sem_roll_numbers` varchar(50) default NULL,
  `third_sem_qp_count` int(11) default NULL,
  `fifth_sem_qp_count` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `classroom_data`
-- 

INSERT INTO `classroom_data` (`classroom`, `third_sem_roll_numbers`, `fifth_sem_roll_numbers`, `third_sem_qp_count`, `fifth_sem_qp_count`) VALUES 
('CSC313', '101-138', '101-138', 40, 40),
('CLAB-1', '139-163', '139-172', 27, 36),
('CLAB-2', '201-236', '201-236', 38, 38),
('LAB-1', '237-263', '237-262', 29, 28),
('CLH209', '301-336', '301-336', 38, 38),
('CLH208', '337-356', '337-369', 22, 35),
('CLH310', '401-434', '401-434', 36, 36),
('CLH303', '435-464', '435-447', 32, 15),
('CLH204', '501-533', '501-533', 35, 35),
('CLH304', '534-563', '534-558', 32, 27),
('CLH210', '-', '-', 0, 0),
('CLH308', '-', '-', 0, 0),
('LAB-6', '-', '-', 0, 0),
('LAB-7', '-', '-', 0, 0);

-- --------------------------------------------------------

-- 
-- Table structure for table `classroom_list`
-- 

CREATE TABLE `classroom_list` (
  `id` int(11) NOT NULL auto_increment,
  `classroom_name` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `building` varchar(50) NOT NULL,
  `floor` int(11) NOT NULL,
  `status` enum('available','occupied') default 'available',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `classroom_name` (`classroom_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- 
-- Dumping data for table `classroom_list`
-- 

INSERT INTO `classroom_list` (`id`, `classroom_name`, `capacity`, `building`, `floor`, `status`) VALUES 
(1, 'CS-101', 60, 'CS Block', 1, 'available'),
(2, 'CS-102', 60, 'CS Block', 1, 'available'),
(3, 'IS-201', 50, 'IS Block', 2, 'available');

-- --------------------------------------------------------

-- 
-- Table structure for table `courses`
-- 

CREATE TABLE `courses` (
  `course_code` varchar(10) NOT NULL,
  `course_name` varchar(255) default NULL,
  `credits` decimal(3,1) default NULL,
  `semester` int(11) default NULL,
  PRIMARY KEY  (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `courses`
-- 

INSERT INTO `courses` (`course_code`, `course_name`, `credits`, `semester`) VALUES 
('15ECSC208', 'Database Management System', 4.0, 3),
('15ECSP204', 'Database Applications Lab', 1.5, 3),
('15EMAB204', 'Graph Theory and Linear Algebra', 4.0, 3),
('15EMAB301', 'Numerical Methods and Statistics', 3.0, 5),
('19ECSC202', 'Discrete Mathematical Structures', 4.0, 3),
('19ECSC302', 'Computer Networks-1', 4.0, 5),
('20ECSC205', 'Data Structures and Algorithms', 4.0, 3),
('21ECSC201', 'Computer Organization and Architecture', 4.0, 3),
('22ECSC301', 'Software Engineering', 3.0, 5),
('22EHSH201', 'Corporate Communication', 0.5, 3),
('23EHSA303', 'Arithmetical Thinking and Analytical Reasoning', 0.0, 5),
('24ECSC302', 'System Software', 4.0, 5),
('24ECSC306', 'Machine Learning and Deep Learning', 4.0, 5),
('24ECSP304', 'Web Technologies Lab', 2.0, 5),
('CS101', 'Introduction to Programming', 4.0, 1),
('CS102', 'Data Structures', 4.0, 2),
('CS201', 'Database Management Systems', 4.0, 3),
('CS202', 'Web Technologies', 4.0, 3),
('CS301', 'Software Engineering', 4.0, 5),
('CS302', 'Computer Networks', 4.0, 5),
('CS401', 'Artificial Intelligence', 4.0, 7),
('CS402', 'Machine Learning', 4.0, 7);

-- --------------------------------------------------------

-- 
-- Table structure for table `duty_allocation`
-- 

DROP TABLE IF EXISTS `duty_allocation`;
CREATE TABLE `duty_allocation` (
  `id` int(11) NOT NULL auto_increment,
  `exam_type` enum('ISA1','ISA2','ESA') NOT NULL,
  `date` date NOT NULL,
  `session` enum('morning','afternoon') NOT NULL,
  `faculty_name` varchar(100) NOT NULL,
  `classroom` varchar(50) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Table structure for table `exam_duty`
-- 

CREATE TABLE `exam_duty` (
  `id` int(11) NOT NULL auto_increment,
  `faculty_id` int(11) NOT NULL,
  `exam_class` varchar(50) NOT NULL,
  `duty_date` date NOT NULL,
  `shift` enum('morning','afternoon') NOT NULL,
  `status` enum('assigned','completed','cancelled') default 'assigned',
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `exam_class` (`exam_class`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `exam_duty`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `exam_timetable`
-- 

CREATE TABLE `exam_timetable` (
  `id` int(11) NOT NULL auto_increment,
  `exam_type` enum('ISA1','ISA2','ESA') NOT NULL,
  `semester` int(11) NOT NULL,
  `course_code` varchar(10) NOT NULL,
  `exam_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY `course_code` (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `exam_timetable`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `faculty`
-- 

CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `designation` varchar(50) NOT NULL,
  `department` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT IGNORE INTO `faculty` (`name`, `designation`, `department`) VALUES
('Dr. John Smith', 'Assistant Professor', 'Computer Science'),
('Ms. Sarah Johnson', 'Assistant Professor', 'Computer Science'),
('Mr. David Wilson', 'T.A', 'Computer Science'),
('Ms. Emily Brown', 'T.A', 'Computer Science'),
('Dr. Michael Lee', 'Assistant Professor', 'Computer Science'),
('Ms. Jennifer Davis', 'Assistant Professor', 'Computer Science'),
('Mr. Robert Taylor', 'T.A', 'Computer Science'),
('Ms. Lisa Anderson', 'T.A', 'Computer Science');

-- --------------------------------------------------------

-- 
-- Table structure for table `faculty_members`
-- 

CREATE TABLE `faculty_members` (
  `id` int(11) NOT NULL auto_increment,
  `faculty_id` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Designation` enum('Dean FSC','Prof. & Head','Professor','Assc. Prof.','Asst. Prof.') NOT NULL,
  `Department` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive') default 'active',
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `faculty_id` (`faculty_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- 
-- Dumping data for table `faculty_members`
-- 

INSERT INTO `faculty_members` (`id`, `faculty_id`, `Name`, `Designation`, `Department`, `email`, `password`, `status`, `created_at`) VALUES 
(1, 'FAC001', 'Dr. John Doe', 'Professor', 'Computer Science', 'john.doe@example.com', 'faculty123', 'active', '2025-01-02 00:33:36'),
(2, 'FAC002', 'Dr. Jane Smith', 'Asst. Prof.', 'Information Science', 'jane.smith@example.com', 'faculty123', 'active', '2025-01-02 00:33:36');

-- --------------------------------------------------------

-- 
-- Table structure for table `timetable_summary`
-- 

CREATE TABLE `timetable_summary` (
  `id` int(11) NOT NULL auto_increment,
  `exam_type` varchar(50) NOT NULL,
  `semester` varchar(10) NOT NULL,
  `department` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `day` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- 
-- Dumping data for table `timetable_summary`
-- 

INSERT INTO `timetable_summary` (`id`, `exam_type`, `semester`, `department`, `date`, `day`, `start_time`, `end_time`, `course_name`, `course_code`, `created_at`) VALUES 
(1, 'ISA1', 'III', 'both', '2025-01-04', '', '10:00:00', '11:14:00', '300', 'Computer science', '2025-01-03 19:58:36'),
(2, 'ISA1', 'IV', 'both', '2025-01-04', '', '10:00:00', '11:14:00', '300', 'CN', '2025-01-03 20:00:16'),
(3, 'ISA1', 'III', 'both', '2025-01-04', '', '10:00:00', '11:00:00', '300', 'CN', '2025-01-03 20:00:55'),
(4, 'ISA1', 'III', 'both', '2025-01-04', '', '10:11:00', '11:14:00', '300', 'CN', '2025-01-03 20:03:51'),
(5, 'ISA1', 'III', 'both', '2025-01-04', '', '10:00:00', '11:14:00', '300', 'CN', '2025-01-03 20:08:36');

-- --------------------------------------------------------

-- 
-- Table structure for table `users`
-- 

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','faculty') NOT NULL default 'faculty',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `users`
-- 

INSERT INTO `users` (`username`, `password`, `role`) VALUES 
('ragx', 'ragx123', 'admin');

-- --------------------------------------------------------

-- 
-- Table structure for table `users`
-- 

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Student') NOT NULL,
  `created_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- 
-- Dumping data for table `users`
-- 

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES 
(1, 'ragha', 'your_encrypted_password', 'Admin', '2024-12-29 17:25:41'),
(2, 'ragx', '1234', 'Admin', '2024-12-29 00:00:00');

-- 
-- Constraints for dumped tables
-- 

-- 
-- Constraints for table `exam_duty`
-- 
ALTER TABLE `exam_duty`
  ADD CONSTRAINT `exam_duty_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty_members` (`id`),
  ADD CONSTRAINT `exam_duty_ibfk_2` FOREIGN KEY (`exam_class`) REFERENCES `classroom_list` (`classroom_name`);

-- 
-- Constraints for table `exam_timetable`
-- 
ALTER TABLE `exam_timetable`
  ADD CONSTRAINT `exam_timetable_ibfk_1` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE CASCADE ON UPDATE CASCADE;
