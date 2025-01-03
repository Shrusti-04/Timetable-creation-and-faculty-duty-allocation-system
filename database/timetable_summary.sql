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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
