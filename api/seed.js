var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var async = require("async");

var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

var insert_users1 = [
    ['Torres', 'Victoria', '1611722@student.hcmus.edu.vn', '0800-357-704', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Clara', '1512143@student.hcmus.edu.vn', '1-855-324-42', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Sydney', '1311565@student.hcmus.edu.vn', '0800-656-445', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Marion', '1515485@student.hcmus.edu.vn', '1-800-724-56', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Matthew', '1611668@student.hcmus.edu.vn', '0800-638-213', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Bobby', '1315378@student.hcmus.edu.vn', '0800-155-843', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Arthur', '1311741@student.hcmus.edu.vn', '1-800-144-60', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Paisley', '1413601@student.hcmus.edu.vn', '1-877-598-88', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Gene', '1511722@student.hcmus.edu.vn', '1-866-697-53', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Everett', '1411820@student.hcmus.edu.vn', '0800-987-646', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Gianna', '1515615@student.hcmus.edu.vn', '0800-695-488', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Johnnie', '1612227@student.hcmus.edu.vn', '1-888-790-39', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Leo', '1614224@student.hcmus.edu.vn', '1-855-495-55', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Barry', '1411988@student.hcmus.edu.vn', '1-888-527-39', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Ronnie', '1511615@student.hcmus.edu.vn', '0800-774-105', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Kenneth', '1511751@student.hcmus.edu.vn', '0800-340-634', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Allan', '1315534@student.hcmus.edu.vn', '1-844-684-31', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Todd', '1615281@student.hcmus.edu.vn', '1-855-221-86', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Grace', '1314467@student.hcmus.edu.vn', '0800-478-564', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Franklin', '1411617@student.hcmus.edu.vn', '1-866-215-66', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Jerry', '1513756@student.hcmus.edu.vn', '0800-151-744', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Stella', '1511756@student.hcmus.edu.vn', '1-866-155-23', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Phillip', '1612243@student.hcmus.edu.vn', '1-877-786-45', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Roberto', '1312806@student.hcmus.edu.vn', '1-844-766-23', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Andy', '1314839@student.hcmus.edu.vn', '1-844-609-13', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Charlotte', '1612281@student.hcmus.edu.vn', '1-844-516-48', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Ellie', '1312227@student.hcmus.edu.vn', '1-888-131-89', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Kirk', '1412682@student.hcmus.edu.vn', '0800-191-688', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Hailey', '1314343@student.hcmus.edu.vn', '1-855-807-86', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Nelson', '1511402@student.hcmus.edu.vn', '1-866-780-58', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Alexander', '1313651@student.hcmus.edu.vn', '0800-285-473', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Lila', '1612086@student.hcmus.edu.vn', '0800-666-318', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Arianna', '1515485@student.hcmus.edu.vn', '0800-466-594', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Kaitlyn', '1611733@student.hcmus.edu.vn', '1-844-911-84', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Marvin', '1514732@student.hcmus.edu.vn', '0800-442-398', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Sydney', '1515565@student.hcmus.edu.vn', '1-855-715-84', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Edward', '1415435@student.hcmus.edu.vn', '1-877-342-43', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Keith', '1413485@student.hcmus.edu.vn', '0800-614-324', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Cory', '1313435@student.hcmus.edu.vn', '0800-187-467', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Jose', '1413750@student.hcmus.edu.vn', '1-888-597-94', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Kenneth', '1311851@student.hcmus.edu.vn', '1-844-191-11', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Charlie', '1414108@student.hcmus.edu.vn', '1-855-641-39', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Marion', '1411811@student.hcmus.edu.vn', '0800-488-719', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Robert', '1613318@student.hcmus.edu.vn', '1-877-611-17', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Makayla', '1615587@student.hcmus.edu.vn', '1-844-617-54', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Darrell', '1313367@student.hcmus.edu.vn', '0800-104-725', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Lila', '1411289@student.hcmus.edu.vn', '0800-112-768', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Roberto', '1614615@student.hcmus.edu.vn', '0800-568-000', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Kylie', '1415754@student.hcmus.edu.vn', '1-866-283-29', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Angel', '1614318@student.hcmus.edu.vn', '1-866-554-61', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Lance', '1415855@student.hcmus.edu.vn', '0800-124-719', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Edward', '1412820@student.hcmus.edu.vn', '0800-154-485', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Arthur', '1412733@student.hcmus.edu.vn', '0800-814-857', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Terrence', '1614719@student.hcmus.edu.vn', '1-877-092-25', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jesse', '1412238@student.hcmus.edu.vn', '0800-229-276', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Dustin', '1311839@student.hcmus.edu.vn', '1-855-193-36', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Jaime', '1614086@student.hcmus.edu.vn', '0800-568-318', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Bruce', '1613243@student.hcmus.edu.vn', '1-844-649-11', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Zoe', '1611719@student.hcmus.edu.vn', '0800-847-622', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Clifton', '1311224@student.hcmus.edu.vn', '0800-361-413', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Nelson', '1615851@student.hcmus.edu.vn', '1-800-061-57', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Francisco', '1613646@student.hcmus.edu.vn', '1-877-330-05', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Camilla', '1313556@student.hcmus.edu.vn', '0800-242-731', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Armando', '1615338@student.hcmus.edu.vn', '1-877-311-81', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Ruben', '1413858@student.hcmus.edu.vn', '0800-178-834', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Ken', '1615888@student.hcmus.edu.vn', '1-844-878-23', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Matthew', '1314035@student.hcmus.edu.vn', '1-866-514-20', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Ronnie', '1414615@student.hcmus.edu.vn', '1-800-783-88', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Angel', '1611267@student.hcmus.edu.vn', '0800-156-047', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Angel', '1313535@student.hcmus.edu.vn', '0800-724-133', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Lauren', '1615587@student.hcmus.edu.vn', '1-888-398-86', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Brett', '1511682@student.hcmus.edu.vn', '0800-078-724', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Charlotte', '1612774@student.hcmus.edu.vn', '1-844-480-07', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Mackenzie', '1411853@student.hcmus.edu.vn', '0800-231-490', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Nelson', '1313975@student.hcmus.edu.vn', '0800-466-222', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Clifton', '1313778@student.hcmus.edu.vn', '0800-934-709', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Christopher', '1615263@student.hcmus.edu.vn', '0800-535-625', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Herman', '1413851@student.hcmus.edu.vn', '1-844-378-44', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Victor', '1611879@student.hcmus.edu.vn', '1-877-315-15', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Jerome', '1314756@student.hcmus.edu.vn', '0800-925-634', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Travis', '1315267@student.hcmus.edu.vn', '0800-672-812', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Robert', '1612879@student.hcmus.edu.vn', '1-866-168-65', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Henry', '1412722@student.hcmus.edu.vn', '0800-355-346', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Benjamin', '1313861@student.hcmus.edu.vn', '0800-684-350', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Claude', '1412140@student.hcmus.edu.vn', '0800-732-518', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Kevin', '1413722@student.hcmus.edu.vn', '1-866-864-38', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Jorge', '1315402@student.hcmus.edu.vn', '0800-591-140', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Marvin', '1411221@student.hcmus.edu.vn', '1-877-858-23', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Michael', '1615636@student.hcmus.edu.vn', '0800-839-897', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Larry', '1612822@student.hcmus.edu.vn', '1-855-716-87', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Emily', '1514221@student.hcmus.edu.vn', '1-877-835-73', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Gordon', '1511116@student.hcmus.edu.vn', '1-800-721-50', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Natalie', '1511253@student.hcmus.edu.vn', '1-855-866-17', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Gene', '1313756@student.hcmus.edu.vn', '1-877-478-61', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Stella', '1415732@student.hcmus.edu.vn', '0800-951-696', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Raul', '1511556@student.hcmus.edu.vn', '0800-819-021', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Ernest', '1512646@student.hcmus.edu.vn', '0800-291-687', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Joel', '1311229@student.hcmus.edu.vn', '0800-356-043', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Ben', '1413811@student.hcmus.edu.vn', '0800-853-323', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Bradley', '1514402@student.hcmus.edu.vn', '1-866-658-61', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Bob', '1515886@student.hcmus.edu.vn', '0800-206-583', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Keira', '1513224@student.hcmus.edu.vn', '0800-543-248', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Juan', '1412617@student.hcmus.edu.vn', '0800-739-735', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Herman', '1612811@student.hcmus.edu.vn', '0800-175-377', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Clinton', '1314118@student.hcmus.edu.vn', '0800-505-378', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Gilbert', '1614035@student.hcmus.edu.vn', '0800-522-218', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Gene', '1615601@student.hcmus.edu.vn', '1-844-146-73', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Joseph', '1413116@student.hcmus.edu.vn', '1-844-356-18', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Ernest', '1314338@student.hcmus.edu.vn', '1-844-634-54', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Mario', '1312654@student.hcmus.edu.vn', '1-855-644-47', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Marion', '1515853@student.hcmus.edu.vn', '0800-707-392', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Allan', '1414806@student.hcmus.edu.vn', '0800-138-623', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Clifton', '1313668@student.hcmus.edu.vn', '0800-471-118', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jesus', '1315446@student.hcmus.edu.vn', '1-844-525-53', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Salvador', '1314852@student.hcmus.edu.vn', '0800-541-626', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Benjamin', '1515839@student.hcmus.edu.vn', '1-855-984-70', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Maya', '1411534@student.hcmus.edu.vn', '0800-364-358', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Makayla', '1614851@student.hcmus.edu.vn', '0800-412-394', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Erik', '1315756@student.hcmus.edu.vn', '1-877-531-42', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Ruben', '1415614@student.hcmus.edu.vn', '1-800-115-73', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Bruce', '1411402@student.hcmus.edu.vn', '1-844-981-61', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Avery', '1514601@student.hcmus.edu.vn', '0800-468-805', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Hailey', '1512839@student.hcmus.edu.vn', '0800-874-347', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Rodney', '1611839@student.hcmus.edu.vn', '0800-734-828', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Stella', '1613855@student.hcmus.edu.vn', '0800-368-774', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Leon', '1314435@student.hcmus.edu.vn', '0800-862-771', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Maya', '1612636@student.hcmus.edu.vn', '1-855-516-74', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Aaron', '1315726@student.hcmus.edu.vn', '1-888-194-06', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Darrell', '1612668@student.hcmus.edu.vn', '1-855-753-24', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Jason', '1315118@student.hcmus.edu.vn', '1-844-316-06', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Erik', '1511042@student.hcmus.edu.vn', '0800-387-654', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Charlotte', '1513774@student.hcmus.edu.vn', '0800-048-872', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Victor', '1315975@student.hcmus.edu.vn', '1-888-086-36', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Michael', '1512733@student.hcmus.edu.vn', '0800-674-288', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Julia', '1415534@student.hcmus.edu.vn', '0800-645-923', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Isabelle', '1413843@student.hcmus.edu.vn', '0800-641-174', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Armando', '1313682@student.hcmus.edu.vn', '0800-074-323', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Aaron', '1512822@student.hcmus.edu.vn', '0800-785-441', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Charlotte', '1413756@student.hcmus.edu.vn', '1-866-505-77', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Terrance', '1615467@student.hcmus.edu.vn', '0800-447-588', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Roland', '1514955@student.hcmus.edu.vn', '1-855-195-52', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Ernest', '1512221@student.hcmus.edu.vn', '0800-374-872', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Erik', '1614158@student.hcmus.edu.vn', '0800-721-074', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Barry', '1312289@student.hcmus.edu.vn', '0800-912-795', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Ella', '1414754@student.hcmus.edu.vn', '1-866-115-35', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Juan', '1612485@student.hcmus.edu.vn', '0800-163-655', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Stella', '1415630@student.hcmus.edu.vn', '1-877-735-61', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Lonnie', '1311367@student.hcmus.edu.vn', '1-855-725-62', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Julian', '1515751@student.hcmus.edu.vn', '1-877-390-73', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Nora', '1613852@student.hcmus.edu.vn', '1-866-370-41', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Robert', '1515601@student.hcmus.edu.vn', '1-844-437-21', bcrypt.hashSync('1512517', 10), 1],
];
var insert_users2=[
    ['Thomas', 'Kenneth', '1314267@student.hcmus.edu.vn', '1-855-857-58', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Ruben', '1312450@student.hcmus.edu.vn', '1-844-701-95', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Lila', '1613719@student.hcmus.edu.vn', '0800-122-186', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Tim', '1414485@student.hcmus.edu.vn', '0800-831-114', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Ian', '1613733@student.hcmus.edu.vn', '1-877-254-81', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Max', '1313879@student.hcmus.edu.vn', '0800-038-594', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Maya', '1411157@student.hcmus.edu.vn', '0800-889-293', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Alex', '1411281@student.hcmus.edu.vn', '1-877-920-87', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Aria', '1311615@student.hcmus.edu.vn', '1-855-101-67', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Matthew', '1614754@student.hcmus.edu.vn', '1-844-448-43', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Ryan', '1612263@student.hcmus.edu.vn', '1-877-473-54', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Gordon', '1613289@student.hcmus.edu.vn', '0800-866-744', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Sam', '1314556@student.hcmus.edu.vn', '0800-983-939', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Emily', '1614143@student.hcmus.edu.vn', '1-877-139-40', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Salvador', '1615450@student.hcmus.edu.vn', '1-855-236-60', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Kylie', '1314888@student.hcmus.edu.vn', '0800-754-524', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Clifton', '1415143@student.hcmus.edu.vn', '1-877-253-52', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Jesus', '1315238@student.hcmus.edu.vn', '1-844-892-12', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Michael', '1414140@student.hcmus.edu.vn', '1-800-965-56', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Kaitlyn', '1415811@student.hcmus.edu.vn', '0800-211-064', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Edward', '1312617@student.hcmus.edu.vn', '1-866-185-12', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Brett', '1313411@student.hcmus.edu.vn', '0800-368-583', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Camilla', '1313806@student.hcmus.edu.vn', '0800-760-263', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Leon', '1312601@student.hcmus.edu.vn', '0800-681-850', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Edward', '1515858@student.hcmus.edu.vn', '1-866-017-73', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Rodney', '1611855@student.hcmus.edu.vn', '0800-844-767', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Scarlett', '1513682@student.hcmus.edu.vn', '0800-525-871', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Mackenzie', '1613888@student.hcmus.edu.vn', '1-877-935-84', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Raul', '1614732@student.hcmus.edu.vn', '0800-552-580', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Aaron', '1313197@student.hcmus.edu.vn', '0800-647-359', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Mario', '1611534@student.hcmus.edu.vn', '0800-573-402', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Cory', '1611858@student.hcmus.edu.vn', '0800-470-798', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Philip', '1414717@student.hcmus.edu.vn', '1-866-297-35', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Jacob', '1311112@student.hcmus.edu.vn', '0800-806-787', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Kevin', '1613975@student.hcmus.edu.vn', '0800-112-566', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Perry', '1412294@student.hcmus.edu.vn', '0800-979-251', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Brooklyn', '1311343@student.hcmus.edu.vn', '0800-365-254', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Kevin', '1415229@student.hcmus.edu.vn', '0800-757-270', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Arthur', '1313485@student.hcmus.edu.vn', '0800-716-829', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Kirk', '1413636@student.hcmus.edu.vn', '1-877-736-32', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Alexander', '1314197@student.hcmus.edu.vn', '0800-286-422', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Arthur', '1512668@student.hcmus.edu.vn', '0800-331-327', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Grace', '1615118@student.hcmus.edu.vn', '1-866-513-53', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Tim', '1315853@student.hcmus.edu.vn', '1-866-521-68', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Wayne', '1611224@student.hcmus.edu.vn', '0800-835-799', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Leo', '1512112@student.hcmus.edu.vn', '1-877-238-90', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Mitchell', '1412263@student.hcmus.edu.vn', '1-855-454-74', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Adalyn', '1511855@student.hcmus.edu.vn', '1-855-173-43', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Fernando', '1312722@student.hcmus.edu.vn', '1-855-421-54', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Ella', '1413441@student.hcmus.edu.vn', '1-844-553-39', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Jorge', '1312238@student.hcmus.edu.vn', '1-855-480-00', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Ronnie', '1512861@student.hcmus.edu.vn', '1-888-523-77', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Dustin', '1612446@student.hcmus.edu.vn', '1-855-537-85', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Larry', '1415343@student.hcmus.edu.vn', '1-800-812-68', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Casey', '1412754@student.hcmus.edu.vn', '1-855-270-92', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Ryan', '1315435@student.hcmus.edu.vn', '0800-563-445', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Arianna', '1515318@student.hcmus.edu.vn', '0800-545-784', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Claude', '1512855@student.hcmus.edu.vn', '0800-412-652', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Matthew', '1511717@student.hcmus.edu.vn', '0800-767-922', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Raul', '1411839@student.hcmus.edu.vn', '1-866-621-06', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Claire', '1311485@student.hcmus.edu.vn', '1-888-646-55', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Perry', '1311822@student.hcmus.edu.vn', '0800-477-861', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Christopher', '1515820@student.hcmus.edu.vn', '1-877-581-87', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Arianna', '1612186@student.hcmus.edu.vn', '1-888-521-35', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Kirk', '1514719@student.hcmus.edu.vn', '1-866-496-31', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Edward', '1511221@student.hcmus.edu.vn', '0800-040-127', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Mario', '1612847@student.hcmus.edu.vn', '0800-346-111', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Alex', '1312186@student.hcmus.edu.vn', '1-844-958-62', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Zoe', '1515253@student.hcmus.edu.vn', '1-800-657-82', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Adalyn', '1312682@student.hcmus.edu.vn', '1-888-867-37', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Peter', '1314452@student.hcmus.edu.vn', '0800-355-045', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Zoe', '1615565@student.hcmus.edu.vn', '1-855-728-53', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Darrell', '1512988@student.hcmus.edu.vn', '0800-458-438', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Cory', '1312988@student.hcmus.edu.vn', '0800-223-153', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Terrance', '1611452@student.hcmus.edu.vn', '0800-287-612', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Angel', '1412843@student.hcmus.edu.vn', '0800-846-765', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Johnnie', '1415636@student.hcmus.edu.vn', '0800-588-858', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Herman', '1611109@student.hcmus.edu.vn', '1-800-828-63', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Terrence', '1412565@student.hcmus.edu.vn', '1-877-622-31', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Kirk', '1512843@student.hcmus.edu.vn', '0800-475-575', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Clinton', '1414820@student.hcmus.edu.vn', '0800-446-188', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Joel', '1515617@student.hcmus.edu.vn', '0800-473-725', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Kirk', '1314733@student.hcmus.edu.vn', '0800-175-772', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Julia', '1412750@student.hcmus.edu.vn', '0800-872-875', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Phillip', '1412143@student.hcmus.edu.vn', '0800-368-442', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Camilla', '1614267@student.hcmus.edu.vn', '1-855-355-79', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Gabriel', '1314109@student.hcmus.edu.vn', '0800-112-144', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Bradley', '1315467@student.hcmus.edu.vn', '0800-404-748', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Bradley', '1613630@student.hcmus.edu.vn', '0800-439-774', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Savannah', '1415485@student.hcmus.edu.vn', '1-855-623-48', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Allison', '1412243@student.hcmus.edu.vn', '1-855-173-43', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Franklin', '1513741@student.hcmus.edu.vn', '1-866-218-07', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Hannah', '1415289@student.hcmus.edu.vn', '0800-550-814', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Sam', '1311717@student.hcmus.edu.vn', '1-866-147-73', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Lawrence', '1311719@student.hcmus.edu.vn', '1-844-318-95', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Andy', '1613614@student.hcmus.edu.vn', '1-855-692-95', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Clifton', '1511888@student.hcmus.edu.vn', '1-855-288-60', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Mark', '1514855@student.hcmus.edu.vn', '1-855-257-19', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Allan', '1613535@student.hcmus.edu.vn', '1-844-796-93', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Mark', '1312243@student.hcmus.edu.vn', '0800-465-320', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Travis', '1511263@student.hcmus.edu.vn', '0800-432-871', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Paisley', '1613140@student.hcmus.edu.vn', '1-855-168-14', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Javier', '1511651@student.hcmus.edu.vn', '0800-381-368', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Grace', '1515157@student.hcmus.edu.vn', '1-866-647-20', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Savannah', '1412732@student.hcmus.edu.vn', '0800-752-716', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Michael', '1611811@student.hcmus.edu.vn', '0800-386-525', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Bradley', '1415858@student.hcmus.edu.vn', '1-855-650-01', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Manuel', '1413158@student.hcmus.edu.vn', '1-800-312-26', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Lonnie', '1311843@student.hcmus.edu.vn', '1-866-558-80', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Benjamin', '1315741@student.hcmus.edu.vn', '1-844-481-54', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Arthur', '1515726@student.hcmus.edu.vn', '0800-116-961', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Bobby', '1613224@student.hcmus.edu.vn', '0800-265-908', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Todd', '1514147@student.hcmus.edu.vn', '0800-177-510', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Charlotte', '1611847@student.hcmus.edu.vn', '1-877-822-44', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Keira', '1511338@student.hcmus.edu.vn', '0800-497-505', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Dan', '1414467@student.hcmus.edu.vn', '0800-508-173', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Darryl', '1414534@student.hcmus.edu.vn', '1-855-241-18', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Mitchell', '1613157@student.hcmus.edu.vn', '1-844-248-31', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Christopher', '1413143@student.hcmus.edu.vn', '1-888-762-68', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Avery', '1415646@student.hcmus.edu.vn', '1-866-178-89', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Armando', '1312847@student.hcmus.edu.vn', '0800-216-568', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Kylie', '1513035@student.hcmus.edu.vn', '1-800-586-11', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Dwayne', '1512411@student.hcmus.edu.vn', '0800-074-821', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Claire', '1612886@student.hcmus.edu.vn', '0800-736-520', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Natalie', '1411490@student.hcmus.edu.vn', '1-844-226-74', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Johnnie', '1411338@student.hcmus.edu.vn', '1-877-182-22', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Lance', '1413975@student.hcmus.edu.vn', '0800-744-115', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Larry', '1511026@student.hcmus.edu.vn', '0800-828-911', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Clinton', '1513026@student.hcmus.edu.vn', '0800-347-893', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Dwayne', '1415879@student.hcmus.edu.vn', '1-844-363-32', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Nicholas', '1513617@student.hcmus.edu.vn', '0800-583-087', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Maya', '1311289@student.hcmus.edu.vn', '1-877-672-64', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Natalie', '1411636@student.hcmus.edu.vn', '0800-879-866', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Jacob', '1611289@student.hcmus.edu.vn', '0800-412-473', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Lawrence', '1414243@student.hcmus.edu.vn', '1-855-449-52', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Henry', '1412197@student.hcmus.edu.vn', '1-866-176-21', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Douglas', '1313717@student.hcmus.edu.vn', '1-855-713-81', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Jose', '1412402@student.hcmus.edu.vn', '0800-646-884', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Bobby', '1311238@student.hcmus.edu.vn', '1-888-235-54', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Travis', '1512565@student.hcmus.edu.vn', '1-866-803-46', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Jerome', '1415565@student.hcmus.edu.vn', '0800-148-244', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Clara', '1311820@student.hcmus.edu.vn', '1-888-275-34', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Eric', '1512534@student.hcmus.edu.vn', '0800-125-034', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Kaitlyn', '1315806@student.hcmus.edu.vn', '0800-843-340', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Christopher', '1414853@student.hcmus.edu.vn', '1-866-428-23', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Cory', '1511741@student.hcmus.edu.vn', '1-855-717-25', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Herman', '1514435@student.hcmus.edu.vn', '0800-845-555', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Ray', '1415467@student.hcmus.edu.vn', '1-800-386-64', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Wade', '1313886@student.hcmus.edu.vn', '1-844-470-27', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Lila', '1611140@student.hcmus.edu.vn', '0800-256-647', bcrypt.hashSync('1512517', 10), 1],
];

var seeding_postgres = function (res) {
    pool_postgres.connect(function (error, connection, done) {
        async.series([
            //Start transaction
            function (callback) {
                connection.query('BEGIN', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users1), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function (callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function (error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success seeding!---------------------------------------');
                res.send({ result: 'success', message: 'success seeding' });
                done();
            }
        });
    });
};

//[name]
var insert_roles = [
    ['Student'],
    ['Teacher'],
    ['Staff'],
    ['Admin']
];
var insert_admin = [
    ['Park Hang', 'Seo', 'parkhangseo@fit.hcmus.edu.vn', '01228718705', bcrypt.hashSync('korea', 10), 4], //1
];
var seeding_admin = function (res) {
    pool_postgres.connect(function (error, connection, done) {
        async.series([
            //Start transaction
            function (callback) {
                connection.query('BEGIN', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO roles (name) VALUES %L', insert_roles), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_admin), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function (callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function (error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success seeding!---------------------------------------');
                res.send({ result: 'success', message: 'success seeding' });
                done();
            }
        });
    });
}
router.get('/', function (req, res, next) {
    //seeding_mysql(res);
    seeding_postgres(res);
});
router.get('/admin', function (req, res, next) {
    //seeding_mysql(res);
    seeding_admin(res);
});
module.exports = router;
