INSERT INTO dbo.attendance_detail(attendance_id,student_id)
 SELECT a.id AS attendance_id,sec.student_id
 FROM dbo.attendance a, dbo.class_has_course chc	,dbo.student_enroll_course sec
 WHERE a.course_id=chc.course_id
 AND a.class_id=chc.class_id
 AND chc.id	= sec.class_has_course_id
 GROUP BY a.id,sec.student_id
