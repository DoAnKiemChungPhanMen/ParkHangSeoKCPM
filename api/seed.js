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
var user13=[
    ['Smith', 'Vivian', '1614112@student.hcmus.edu.vn', '1-877-513-51', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Lonnie', '1613338@student.hcmus.edu.vn', '1-855-751-63', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Francisco', '1312108@student.hcmus.edu.vn', '1-800-905-72', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Kylie', '1311861@student.hcmus.edu.vn', '1-866-126-08', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Lonnie', '1413886@student.hcmus.edu.vn', '1-844-683-18', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Vivian', '1613042@student.hcmus.edu.vn', '0800-750-347', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Michael', '1513468@student.hcmus.edu.vn', '1-877-629-42', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Salvador', '1515534@student.hcmus.edu.vn', '1-877-246-71', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Aaliyah', '1313273@student.hcmus.edu.vn', '0800-418-222', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Salvador', '1414452@student.hcmus.edu.vn', '1-877-838-78', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Jerry', '1512108@student.hcmus.edu.vn', '1-844-661-60', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Vivian', '1512587@student.hcmus.edu.vn', '0800-417-589', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Bob', '1512468@student.hcmus.edu.vn', '0800-617-181', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Ray', '1611402@student.hcmus.edu.vn', '0800-425-202', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Jeffery', '1614556@student.hcmus.edu.vn', '1-855-481-82', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Lonnie', '1614294@student.hcmus.edu.vn', '0800-187-395', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Joel', '1413143@student.hcmus.edu.vn', '1-866-578-67', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Brett', '1411294@student.hcmus.edu.vn', '1-877-425-38', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Clinton', '1412811@student.hcmus.edu.vn', '1-877-768-00', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Nora', '1314143@student.hcmus.edu.vn', '0800-143-992', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Johnnie', '1611646@student.hcmus.edu.vn', '0800-172-815', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Ella', '1611774@student.hcmus.edu.vn', '0800-849-866', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Jerry', '1515556@student.hcmus.edu.vn', '1-844-562-83', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Keira', '1313343@student.hcmus.edu.vn', '1-844-646-81', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Brett', '1314587@student.hcmus.edu.vn', '0800-066-141', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Leon', '1611485@student.hcmus.edu.vn', '1-866-593-77', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Savannah', '1512289@student.hcmus.edu.vn', '1-844-938-12', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Leo', '1411847@student.hcmus.edu.vn', '0800-662-817', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Julian', '1311668@student.hcmus.edu.vn', '0800-277-824', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Jose', '1612855@student.hcmus.edu.vn', '0800-272-931', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Violet', '1613778@student.hcmus.edu.vn', '0800-864-658', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Ray', '1413617@student.hcmus.edu.vn', '1-800-844-26', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Dan', '1314719@student.hcmus.edu.vn', '0800-666-543', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Lonnie', '1511727@student.hcmus.edu.vn', '1-866-163-46', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Cory', '1513343@student.hcmus.edu.vn', '1-855-317-10', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Stella', '1614587@student.hcmus.edu.vn', '1-877-564-70', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Barry', '1311651@student.hcmus.edu.vn', '0800-706-751', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Johnnie', '1612109@student.hcmus.edu.vn', '0800-457-686', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Jason', '1313289@student.hcmus.edu.vn', '0800-573-081', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Brooklyn', '1614026@student.hcmus.edu.vn', '1-855-133-35', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Victor', '1511267@student.hcmus.edu.vn', '0800-542-668', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Marion', '1513601@student.hcmus.edu.vn', '1-844-583-14', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Perry', '1411565@student.hcmus.edu.vn', '1-877-312-88', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Andy', '1515855@student.hcmus.edu.vn', '0800-621-044', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Roberto', '1412186@student.hcmus.edu.vn', '1-866-344-16', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Jorge', '1511109@student.hcmus.edu.vn', '0800-522-859', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Terrence', '1411717@student.hcmus.edu.vn', '1-844-578-21', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Scarlett', '1314281@student.hcmus.edu.vn', '1-877-154-16', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Jose', '1413861@student.hcmus.edu.vn', '1-844-728-47', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Zoe', '1615719@student.hcmus.edu.vn', '1-855-882-62', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Clinton', '1515733@student.hcmus.edu.vn', '0800-569-220', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Todd', '1512452@student.hcmus.edu.vn', '1-877-457-36', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Sydney', '1615243@student.hcmus.edu.vn', '0800-643-493', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Douglas', '1615411@student.hcmus.edu.vn', '1-877-252-17', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Keith', '1412289@student.hcmus.edu.vn', '0800-198-319', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Jose', '1414855@student.hcmus.edu.vn', '1-855-626-37', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Philip', '1515806@student.hcmus.edu.vn', '1-866-575-46', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Donald', '1311243@student.hcmus.edu.vn', '0800-733-771', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Mark', '1513955@student.hcmus.edu.vn', '1-866-760-72', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Javier', '1413651@student.hcmus.edu.vn', '1-844-355-97', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Kylie', '1515161@student.hcmus.edu.vn', '0800-365-440', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Jeffery', '1514485@student.hcmus.edu.vn', '0800-658-816', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Jerry', '1513732@student.hcmus.edu.vn', '0800-653-531', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Angel', '1314411@student.hcmus.edu.vn', '0800-212-906', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Max', '1515490@student.hcmus.edu.vn', '1-800-485-82', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Eric', '1613446@student.hcmus.edu.vn', '1-844-370-03', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Herman', '1314847@student.hcmus.edu.vn', '1-855-563-44', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Savannah', '1313888@student.hcmus.edu.vn', '1-866-448-83', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Hailey', '1413042@student.hcmus.edu.vn', '1-877-113-21', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Robert', '1515636@student.hcmus.edu.vn', '0800-406-242', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Mark', '1613186@student.hcmus.edu.vn', '0800-678-531', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Jorge', '1413668@student.hcmus.edu.vn', '0800-600-657', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Manuel', '1615158@student.hcmus.edu.vn', '1-844-335-66', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Salvador', '1612318@student.hcmus.edu.vn', '0800-957-461', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Francisco', '1415485@student.hcmus.edu.vn', '1-877-414-83', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Peter', '1514806@student.hcmus.edu.vn', '1-800-294-14', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Gene', '1314485@student.hcmus.edu.vn', '1-844-773-03', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Wade', '1612806@student.hcmus.edu.vn', '0800-597-555', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Allison', '1513338@student.hcmus.edu.vn', '0800-819-070', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Julia', '1613143@student.hcmus.edu.vn', '1-844-454-63', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Philip', '1412955@student.hcmus.edu.vn', '1-855-764-65', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Terrance', '1414732@student.hcmus.edu.vn', '1-877-554-65', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Paisley', '1612733@student.hcmus.edu.vn', '0800-987-920', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Keith', '1511161@student.hcmus.edu.vn', '0800-076-195', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Marc', '1414042@student.hcmus.edu.vn', '0800-688-654', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Tim', '1414435@student.hcmus.edu.vn', '0800-468-177', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Alexander', '1313238@student.hcmus.edu.vn', '1-877-072-20', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Allan', '1512467@student.hcmus.edu.vn', '0800-787-557', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Ernest', '1311140@student.hcmus.edu.vn', '1-855-923-97', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Francisco', '1514741@student.hcmus.edu.vn', '1-888-361-35', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Bruce', '1513861@student.hcmus.edu.vn', '0800-571-872', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Curtis', '1313446@student.hcmus.edu.vn', '0800-821-714', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Fernando', '1411318@student.hcmus.edu.vn', '0800-197-347', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Dan', '1611338@student.hcmus.edu.vn', '1-877-253-41', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Andy', '1613147@student.hcmus.edu.vn', '0800-674-058', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Phillip', '1613741@student.hcmus.edu.vn', '0800-506-881', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Manuel', '1312367@student.hcmus.edu.vn', '0800-313-561', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Makayla', '1512158@student.hcmus.edu.vn', '0800-886-555', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Phillip', '1613886@student.hcmus.edu.vn', '0800-402-428', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Phillip', '1514617@student.hcmus.edu.vn', '1-877-473-11', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Ronnie', '1414858@student.hcmus.edu.vn', '0800-510-314', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Adalyn', '1614847@student.hcmus.edu.vn', '0800-330-445', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Bob', '1514646@student.hcmus.edu.vn', '1-855-818-25', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Isabelle', '1315112@student.hcmus.edu.vn', '0800-466-416', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Sarah', '1512717@student.hcmus.edu.vn', '1-877-135-05', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Arianna', '1515811@student.hcmus.edu.vn', '0800-007-176', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Stanley', '1312751@student.hcmus.edu.vn', '1-888-543-33', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Stanley', '1414975@student.hcmus.edu.vn', '1-844-407-65', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Bradley', '1613879@student.hcmus.edu.vn', '1-866-246-73', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Gordon', '1312229@student.hcmus.edu.vn', '0800-412-561', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Henry', '1413267@student.hcmus.edu.vn', '0800-755-880', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Travis', '1315617@student.hcmus.edu.vn', '1-877-146-51', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Jorge', '1614988@student.hcmus.edu.vn', '0800-557-361', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Lila', '1611601@student.hcmus.edu.vn', '0800-713-147', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Bruce', '1415221@student.hcmus.edu.vn', '1-855-879-72', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Ava', '1311446@student.hcmus.edu.vn', '0800-507-415', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Todd', '1514886@student.hcmus.edu.vn', '0800-192-467', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Charlie', '1613227@student.hcmus.edu.vn', '1-877-721-66', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Dan', '1513587@student.hcmus.edu.vn', '1-866-155-74', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Ben', '1313988@student.hcmus.edu.vn', '0800-930-567', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Francisco', '1312343@student.hcmus.edu.vn', '0800-889-787', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Edward', '1512651@student.hcmus.edu.vn', '1-800-592-30', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Jerome', '1513294@student.hcmus.edu.vn', '1-855-821-72', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Ben', '1513490@student.hcmus.edu.vn', '1-855-426-32', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Everett', '1611630@student.hcmus.edu.vn', '1-855-547-11', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Kaitlyn', '1612587@student.hcmus.edu.vn', '0800-234-242', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Ella', '1612112@student.hcmus.edu.vn', '0800-228-846', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Larry', '1614402@student.hcmus.edu.vn', '1-844-807-72', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Todd', '1414719@student.hcmus.edu.vn', '0800-601-473', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Arianna', '1314402@student.hcmus.edu.vn', '0800-981-756', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Marc', '1515727@student.hcmus.edu.vn', '0800-416-076', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Kylie', '1413229@student.hcmus.edu.vn', '0800-139-896', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Lawrence', '1415682@student.hcmus.edu.vn', '0800-421-216', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Mark', '1511847@student.hcmus.edu.vn', '1-877-842-78', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Dustin', '1413654@student.hcmus.edu.vn', '0800-456-545', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Ramon', '1511535@student.hcmus.edu.vn', '1-844-115-27', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Claire', '1311811@student.hcmus.edu.vn', '0800-776-833', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Salvador', '1312719@student.hcmus.edu.vn', '1-800-842-67', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Tim', '1511343@student.hcmus.edu.vn', '0800-491-792', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Arianna', '1615294@student.hcmus.edu.vn', '1-844-406-37', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Joel', '1514140@student.hcmus.edu.vn', '0800-322-494', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Terrance', '1614116@student.hcmus.edu.vn', '1-888-086-20', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Zoe', '1612467@student.hcmus.edu.vn', '1-844-215-51', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Lauren', '1615227@student.hcmus.edu.vn', '1-844-071-48', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Jacob', '1614108@student.hcmus.edu.vn', '0800-256-365', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Arianna', '1414289@student.hcmus.edu.vn', '0800-648-051', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Erik', '1512042@student.hcmus.edu.vn', '1-855-511-56', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Raul', '1513485@student.hcmus.edu.vn', '1-866-768-84', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Ken', '1412157@student.hcmus.edu.vn', '0800-261-695', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Roberto', '1313035@student.hcmus.edu.vn', '1-855-439-93', bcrypt.hashSync('1512517', 10), 1],
];
var user14=[
    ['Davis', 'Jose', '1513161@student.hcmus.edu.vn', '0800-774-472', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Mackenzie', '1413617@student.hcmus.edu.vn', '0800-622-977', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Darrell', '1315468@student.hcmus.edu.vn', '1-866-775-80', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Jacob', '1611754@student.hcmus.edu.vn', '0800-928-349', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Adalyn', '1511820@student.hcmus.edu.vn', '0800-141-718', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Erik', '1315158@student.hcmus.edu.vn', '1-844-640-72', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Natalie', '1611318@student.hcmus.edu.vn', '1-855-273-71', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Zoe', '1412158@student.hcmus.edu.vn', '1-866-525-15', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Juan', '1415452@student.hcmus.edu.vn', '0800-881-707', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Perry', '1311822@student.hcmus.edu.vn', '0800-952-185', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Aria', '1613229@student.hcmus.edu.vn', '0800-160-833', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Claude', '1511654@student.hcmus.edu.vn', '1-877-858-27', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Jacob', '1615668@student.hcmus.edu.vn', '0800-342-444', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Marion', '1614717@student.hcmus.edu.vn', '1-877-835-92', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Brett', '1413615@student.hcmus.edu.vn', '1-866-406-67', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Ian', '1614243@student.hcmus.edu.vn', '0800-378-739', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Curtis', '1615186@student.hcmus.edu.vn', '0800-668-871', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Robert', '1511186@student.hcmus.edu.vn', '1-855-473-37', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Jacob', '1312253@student.hcmus.edu.vn', '1-855-614-58', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Gabriel', '1411732@student.hcmus.edu.vn', '0800-765-049', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Sam', '1411858@student.hcmus.edu.vn', '0800-219-561', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Charlie', '1415717@student.hcmus.edu.vn', '1-844-681-22', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Terrance', '1415722@student.hcmus.edu.vn', '1-877-216-77', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Jose', '1314636@student.hcmus.edu.vn', '1-888-314-78', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Jason', '1414682@student.hcmus.edu.vn', '0800-149-881', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Ernest', '1512086@student.hcmus.edu.vn', '0800-843-765', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Barry', '1512263@student.hcmus.edu.vn', '0800-592-143', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Philip', '1313855@student.hcmus.edu.vn', '1-800-588-28', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Ruben', '1415227@student.hcmus.edu.vn', '1-800-714-57', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Peter', '1613143@student.hcmus.edu.vn', '0800-514-851', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Ian', '1614446@student.hcmus.edu.vn', '0800-323-938', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Tim', '1615253@student.hcmus.edu.vn', '1-855-503-30', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Marvin', '1513452@student.hcmus.edu.vn', '1-844-528-48', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Kylie', '1615446@student.hcmus.edu.vn', '0800-821-624', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Emily', '1413565@student.hcmus.edu.vn', '1-866-237-74', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Julian', '1411754@student.hcmus.edu.vn', '0800-358-769', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Mackenzie', '1515147@student.hcmus.edu.vn', '1-866-563-47', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Savannah', '1615741@student.hcmus.edu.vn', '0800-393-706', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Allison', '1611975@student.hcmus.edu.vn', '1-866-975-15', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Julia', '1313086@student.hcmus.edu.vn', '1-866-195-43', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Tim', '1314441@student.hcmus.edu.vn', '1-800-231-48', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Ellie', '1311654@student.hcmus.edu.vn', '1-866-433-56', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Max', '1514722@student.hcmus.edu.vn', '0800-428-615', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Jorge', '1313467@student.hcmus.edu.vn', '1-855-191-91', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Ramon', '1315197@student.hcmus.edu.vn', '1-888-644-69', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Lillian', '1615988@student.hcmus.edu.vn', '1-844-429-04', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Kevin', '1514186@student.hcmus.edu.vn', '0800-618-751', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Adalyn', '1315778@student.hcmus.edu.vn', '0800-825-855', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Darryl', '1515668@student.hcmus.edu.vn', '0800-363-745', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Antonio', '1313485@student.hcmus.edu.vn', '0800-616-026', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Jeffery', '1314485@student.hcmus.edu.vn', '0800-917-435', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Kirk', '1411035@student.hcmus.edu.vn', '0800-372-611', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Keira', '1614861@student.hcmus.edu.vn', '1-888-485-37', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Philip', '1512118@student.hcmus.edu.vn', '1-877-657-19', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Alex', '1512143@student.hcmus.edu.vn', '0800-385-246', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Jacob', '1511229@student.hcmus.edu.vn', '0800-179-495', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Roland', '1614858@student.hcmus.edu.vn', '1-888-389-75', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Allison', '1611651@student.hcmus.edu.vn', '1-866-308-89', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Keith', '1414263@student.hcmus.edu.vn', '1-855-421-12', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Peter', '1513722@student.hcmus.edu.vn', '1-844-585-59', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Travis', '1314289@student.hcmus.edu.vn', '1-844-161-41', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Hailey', '1615886@student.hcmus.edu.vn', '1-800-033-38', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Gilbert', '1514636@student.hcmus.edu.vn', '0800-440-495', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Kylie', '1413732@student.hcmus.edu.vn', '1-866-148-95', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Marion', '1511227@student.hcmus.edu.vn', '1-866-267-90', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Erik', '1514263@student.hcmus.edu.vn', '0800-447-546', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Darryl', '1613221@student.hcmus.edu.vn', '0800-418-283', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Andy', '1411778@student.hcmus.edu.vn', '1-855-546-10', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Sam', '1415112@student.hcmus.edu.vn', '0800-941-043', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Ian', '1312741@student.hcmus.edu.vn', '1-844-953-81', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Savannah', '1415853@student.hcmus.edu.vn', '1-855-780-85', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Matthew', '1512026@student.hcmus.edu.vn', '0800-314-349', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Hailey', '1411774@student.hcmus.edu.vn', '1-888-768-28', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Christopher', '1511733@student.hcmus.edu.vn', '0800-407-113', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Curtis', '1412118@student.hcmus.edu.vn', '1-844-346-72', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Hailey', '1314646@student.hcmus.edu.vn', '1-855-320-59', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Douglas', '1612143@student.hcmus.edu.vn', '1-844-329-25', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Camilla', '1414273@student.hcmus.edu.vn', '1-800-954-20', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Douglas', '1514726@student.hcmus.edu.vn', '0800-517-885', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Kevin', '1514565@student.hcmus.edu.vn', '0800-013-701', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Kylie', '1313955@student.hcmus.edu.vn', '1-877-207-22', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Alexander', '1411253@student.hcmus.edu.vn', '1-866-417-15', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Jerry', '1614886@student.hcmus.edu.vn', '1-866-253-18', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Keira', '1512229@student.hcmus.edu.vn', '1-888-588-72', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Jaime', '1614281@student.hcmus.edu.vn', '1-877-854-30', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Jose', '1615806@student.hcmus.edu.vn', '0800-757-278', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Jerry', '1411852@student.hcmus.edu.vn', '0800-702-997', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Dan', '1313617@student.hcmus.edu.vn', '1-888-880-44', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Ernest', '1513888@student.hcmus.edu.vn', '0800-579-589', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Terrance', '1512726@student.hcmus.edu.vn', '1-844-596-25', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Avery', '1612726@student.hcmus.edu.vn', '0800-460-974', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Clara', '1414722@student.hcmus.edu.vn', '1-844-189-24', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Jaime', '1415253@student.hcmus.edu.vn', '0800-233-405', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Ben', '1513822@student.hcmus.edu.vn', '0800-389-439', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Robert', '1312811@student.hcmus.edu.vn', '0800-194-845', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Javier', '1315733@student.hcmus.edu.vn', '0800-074-157', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Victor', '1411140@student.hcmus.edu.vn', '1-844-351-58', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Wayne', '1315243@student.hcmus.edu.vn', '1-888-434-63', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Claire', '1612450@student.hcmus.edu.vn', '0800-290-308', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Mackenzie', '1615535@student.hcmus.edu.vn', '0800-819-638', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Nicholas', '1615822@student.hcmus.edu.vn', '1-800-957-28', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Joel', '1613281@student.hcmus.edu.vn', '0800-816-678', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Bruce', '1415116@student.hcmus.edu.vn', '1-800-085-26', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Adalyn', '1511143@student.hcmus.edu.vn', '1-800-557-25', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Jerry', '1315229@student.hcmus.edu.vn', '0800-693-572', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Grace', '1514778@student.hcmus.edu.vn', '1-844-511-96', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Todd', '1615267@student.hcmus.edu.vn', '0800-127-470', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Kaitlyn', '1412852@student.hcmus.edu.vn', '0800-281-156', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Maya', '1415975@student.hcmus.edu.vn', '1-800-147-77', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Robert', '1514343@student.hcmus.edu.vn', '0800-331-739', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Mitchell', '1313811@student.hcmus.edu.vn', '0800-493-374', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Lauren', '1615435@student.hcmus.edu.vn', '0800-618-955', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Jerome', '1315452@student.hcmus.edu.vn', '0800-165-676', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Bobby', '1312843@student.hcmus.edu.vn', '0800-434-071', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Julian', '1314221@student.hcmus.edu.vn', '1-888-827-58', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Jesus', '1615751@student.hcmus.edu.vn', '0800-576-749', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Mitchell', '1315116@student.hcmus.edu.vn', '0800-668-094', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Lillian', '1612468@student.hcmus.edu.vn', '1-844-235-33', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Maya', '1611118@student.hcmus.edu.vn', '0800-655-167', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Travis', '1311378@student.hcmus.edu.vn', '1-888-286-80', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Victor', '1514468@student.hcmus.edu.vn', '1-855-616-15', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Peter', '1415774@student.hcmus.edu.vn', '1-888-317-45', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Lila', '1411651@student.hcmus.edu.vn', '1-855-511-88', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Natalie', '1313109@student.hcmus.edu.vn', '0800-130-619', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Mark', '1314955@student.hcmus.edu.vn', '1-888-380-46', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Peter', '1513227@student.hcmus.edu.vn', '1-866-758-84', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Tim', '1313636@student.hcmus.edu.vn', '0800-466-575', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Gordon', '1412534@student.hcmus.edu.vn', '0800-235-417', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Charlie', '1615617@student.hcmus.edu.vn', '0800-703-201', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Curtis', '1613774@student.hcmus.edu.vn', '1-866-434-81', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Clifton', '1411975@student.hcmus.edu.vn', '1-877-288-28', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Charlotte', '1511485@student.hcmus.edu.vn', '1-877-217-22', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Ben', '1311756@student.hcmus.edu.vn', '1-844-448-31', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Gabriel', '1412281@student.hcmus.edu.vn', '0800-314-895', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Joseph', '1315722@student.hcmus.edu.vn', '0800-929-528', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Sarah', '1415822@student.hcmus.edu.vn', '0800-084-450', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Olivia', '1615197@student.hcmus.edu.vn', '1-877-608-63', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Brooklyn', '1415886@student.hcmus.edu.vn', '0800-498-246', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Claire', '1614727@student.hcmus.edu.vn', '1-844-277-43', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Maya', '1611717@student.hcmus.edu.vn', '0800-086-836', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Erik', '1313822@student.hcmus.edu.vn', '0800-431-282', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Fernando', '1615367@student.hcmus.edu.vn', '1-866-872-64', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Marc', '1611682@student.hcmus.edu.vn', '1-844-115-60', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Nelson', '1515281@student.hcmus.edu.vn', '0800-543-525', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Jesse', '1612617@student.hcmus.edu.vn', '1-866-393-18', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Sarah', '1614441@student.hcmus.edu.vn', '1-866-563-21', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Lance', '1512732@student.hcmus.edu.vn', '0800-621-925', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Franklin', '1411851@student.hcmus.edu.vn', '0800-231-375', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Kirk', '1614682@student.hcmus.edu.vn', '0800-286-235', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Mario', '1615140@student.hcmus.edu.vn', '1-866-092-23', bcrypt.hashSync('1512517', 10), 1],
];
var user15=[
    ['White', 'Cory', '1611227@student.hcmus.edu.vn', '1-877-651-06', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Bruce', '1515741@student.hcmus.edu.vn', '0800-111-496', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Leon', '1514750@student.hcmus.edu.vn', '1-866-575-42', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Zoe', '1613654@student.hcmus.edu.vn', '1-844-583-54', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Victoria', '1511587@student.hcmus.edu.vn', '0800-715-839', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Terrance', '1312378@student.hcmus.edu.vn', '0800-037-469', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Ben', '1311636@student.hcmus.edu.vn', '0800-947-258', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Todd', '1612026@student.hcmus.edu.vn', '0800-363-224', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Herman', '1511754@student.hcmus.edu.vn', '0800-958-527', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Ken', '1511534@student.hcmus.edu.vn', '0800-666-606', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Aaliyah', '1613565@student.hcmus.edu.vn', '0800-509-643', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Mario', '1512587@student.hcmus.edu.vn', '0800-640-468', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Herman', '1511294@student.hcmus.edu.vn', '1-866-773-58', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Joseph', '1312726@student.hcmus.edu.vn', '0800-664-333', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Jason', '1412450@student.hcmus.edu.vn', '0800-434-612', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Aria', '1615556@student.hcmus.edu.vn', '1-877-311-06', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Ray', '1312534@student.hcmus.edu.vn', '1-844-371-14', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Ava', '1313452@student.hcmus.edu.vn', '0800-672-483', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Jeffery', '1314294@student.hcmus.edu.vn', '0800-254-808', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Juan', '1414535@student.hcmus.edu.vn', '1-844-178-62', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Donald', '1413253@student.hcmus.edu.vn', '0800-712-553', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Arianna', '1414733@student.hcmus.edu.vn', '1-877-811-43', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Nora', '1512741@student.hcmus.edu.vn', '1-877-564-81', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Leo', '1413086@student.hcmus.edu.vn', '0800-635-142', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Douglas', '1514975@student.hcmus.edu.vn', '0800-830-453', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Scarlett', '1314378@student.hcmus.edu.vn', '0800-386-206', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Leo', '1411682@student.hcmus.edu.vn', '1-877-730-74', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Casey', '1315682@student.hcmus.edu.vn', '0800-224-877', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Mitchell', '1411118@student.hcmus.edu.vn', '1-888-689-21', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Andy', '1513820@student.hcmus.edu.vn', '1-800-435-92', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Armando', '1311847@student.hcmus.edu.vn', '0800-584-231', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Ava', '1515587@student.hcmus.edu.vn', '0800-096-965', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Edward', '1415294@student.hcmus.edu.vn', '1-888-882-78', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Nora', '1614839@student.hcmus.edu.vn', '1-844-319-18', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Dan', '1514229@student.hcmus.edu.vn', '1-855-184-71', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Leo', '1411888@student.hcmus.edu.vn', '0800-923-736', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Victoria', '1414267@student.hcmus.edu.vn', '0800-137-065', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Ronnie', '1311318@student.hcmus.edu.vn', '0800-161-184', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Jerome', '1511822@student.hcmus.edu.vn', '0800-395-075', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Eric', '1311733@student.hcmus.edu.vn', '0800-886-536', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Lillian', '1414343@student.hcmus.edu.vn', '1-866-776-66', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Keira', '1414601@student.hcmus.edu.vn', '1-877-738-38', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Clara', '1412161@student.hcmus.edu.vn', '0800-761-342', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Ruben', '1315654@student.hcmus.edu.vn', '0800-273-031', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Camilla', '1612411@student.hcmus.edu.vn', '0800-494-336', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Angel', '1412535@student.hcmus.edu.vn', '0800-456-272', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Aaron', '1615452@student.hcmus.edu.vn', '1-844-175-65', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Erik', '1512851@student.hcmus.edu.vn', '0800-388-537', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Bobby', '1514143@student.hcmus.edu.vn', '1-877-754-43', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Ernest', '1614617@student.hcmus.edu.vn', '1-844-688-21', bcrypt.hashSync('1512517', 10), 1],
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
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', user13), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', user14), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', user15), function (error, results, fields) {
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
