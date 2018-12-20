INSERT INTO dbo.attendance(course_id,class_id,closed,student_count)
 SELECT course_id,class_id,ABS(CHECKSUM(NEWID()) % 2) AS closed,dem.student_count FROM dbo.class_has_course chc,
 (SELECT class_has_course_id, COUNT(student_id) AS student_count
 FROM student_enroll_course
 GROUP BY class_has_course_id) AS dem
 WHERE chc.id=dem.class_has_course_id