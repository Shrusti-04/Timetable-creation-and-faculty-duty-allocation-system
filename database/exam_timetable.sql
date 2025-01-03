-- Create exam_timetable table
CREATE TABLE IF NOT EXISTS `exam_timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_type` varchar(10) NOT NULL,
  `semester` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `exam_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
