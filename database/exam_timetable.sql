CREATE TABLE `exam_timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_type` enum('ISA1','ISA2','ESA') NOT NULL,
  `semester` int(11) NOT NULL,
  `course_code` varchar(10) NOT NULL,
  `exam_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`course_code`) REFERENCES `courses`(`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
