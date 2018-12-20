INSERT INTO [dbo].[students](id,stud_id,class_id)
 SELECT std.id,std.stud_id,cls.id
 FROM (SELECT id,LEFT(email,7) AS stud_id  FROM dbo.users WHERE role_id =1 AND id NOT IN (SELECT ID FROM STUDENTS) ) std 
 LEFT JOIN dbo.classes cls
 ON
 LEFT(cls.name,2)=LEFT(std.stud_id,2)
 AND SUBSTRING(cls.name,3,3)=
 CASE SUBSTRING(std.stud_id,3,2) 
    WHEN '53' THEN 'cd'
	ELSE
	CASE ABS(CHECKSUM(NEWID()) % 5) 
		WHEN 1 THEN 'clc'
		WHEN 2 THEN 'vp'
		WHEN 3 THEN 'tn'
		WHEN 4 THEN 't'
		ELSE 'ctt'
	END
 END
 