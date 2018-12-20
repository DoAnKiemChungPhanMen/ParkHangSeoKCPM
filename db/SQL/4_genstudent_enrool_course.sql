INSERT dbo.student_enroll_course(class_has_course_id,student_id)
 SELECT chc.id AS class_has_course_id,s.id AS student_id FROM dbo.class_has_course chc, dbo.students s
 WHERE s.class_id = chc.class_id 
