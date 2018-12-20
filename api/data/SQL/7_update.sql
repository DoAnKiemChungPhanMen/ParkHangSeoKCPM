DECLARE @id int
 DECLARE cursorProduct CURSOR FOR(SELECT DISTINCT id FROM dbo.attendance a)
 OPEN cursorProduct
 FETCH NEXT FROM cursorProduct INTO @id
 WHILE @@FETCH_STATUS = 0
 BEGIN
	UPDATE  dbo.attendance_detail set attendance_type = 0 WHERE  attendance_id =@id 
	UPDATE dt set dt.attendance_type = 1 FROM dbo.attendance_detail dt
	WHERE dt.attendance_id =@id AND dt.student_id IN
	(select top 80 PERCENT student_id from dbo.attendance_detail WHERE attendance_id=@id GROUP BY student_id order by NEWID())
    FETCH NEXT FROM cursorProduct INTO @id
 END
 CLOSE cursorProduct
 DEALLOCATE cursorProduct