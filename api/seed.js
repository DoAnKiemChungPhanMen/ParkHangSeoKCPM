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

var insert_users2 = [
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

var insert_users3 = [
    ['Stewart', 'Casey', '1415263@student.hcmus.edu.vn', '0800-488-248', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Travis', '1615774@student.hcmus.edu.vn', '0800-293-949', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Gianna', '1411726@student.hcmus.edu.vn', '0800-555-324', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Ruben', '1411197@student.hcmus.edu.vn', '1-844-047-58', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Alex', '1514843@student.hcmus.edu.vn', '0800-664-433', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Barry', '1411719@student.hcmus.edu.vn', '1-844-111-03', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Violet', '1413224@student.hcmus.edu.vn', '0800-565-201', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Ava', '1313118@student.hcmus.edu.vn', '1-877-942-43', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Nicholas', '1311806@student.hcmus.edu.vn', '1-866-061-59', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Jacob', '1415847@student.hcmus.edu.vn', '0800-925-774', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Manuel', '1511367@student.hcmus.edu.vn', '1-877-851-66', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Victoria', '1514112@student.hcmus.edu.vn', '1-844-123-88', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Eric', '1612273@student.hcmus.edu.vn', '1-855-751-54', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Keith', '1614741@student.hcmus.edu.vn', '0800-081-369', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Ramon', '1313719@student.hcmus.edu.vn', '1-877-647-55', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Violet', '1613197@student.hcmus.edu.vn', '0800-456-849', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Scarlett', '1515467@student.hcmus.edu.vn', '1-855-214-31', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Zoe', '1613161@student.hcmus.edu.vn', '0800-860-375', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Camilla', '1413855@student.hcmus.edu.vn', '1-844-444-68', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Johnnie', '1611147@student.hcmus.edu.vn', '0800-311-315', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Paisley', '1414587@student.hcmus.edu.vn', '1-866-822-26', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Aaliyah', '1311108@student.hcmus.edu.vn', '1-866-227-14', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Darrell', '1514253@student.hcmus.edu.vn', '1-877-337-11', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Philip', '1314820@student.hcmus.edu.vn', '0800-112-513', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Fernando', '1612778@student.hcmus.edu.vn', '0800-202-989', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Juan', '1311116@student.hcmus.edu.vn', '1-877-881-51', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Isabelle', '1411806@student.hcmus.edu.vn', '0800-647-441', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Julian', '1411116@student.hcmus.edu.vn', '0800-265-227', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Mark', '1615651@student.hcmus.edu.vn', '1-866-981-77', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Francisco', '1514717@student.hcmus.edu.vn', '0800-683-672', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Francisco', '1613294@student.hcmus.edu.vn', '0800-117-446', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Darrell', '1615042@student.hcmus.edu.vn', '1-844-487-94', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Lawrence', '1614822@student.hcmus.edu.vn', '0800-030-641', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Brooklyn', '1314243@student.hcmus.edu.vn', '0800-630-415', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Lance', '1512820@student.hcmus.edu.vn', '1-866-593-44', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Ernest', '1314158@student.hcmus.edu.vn', '1-844-714-56', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Angel', '1311587@student.hcmus.edu.vn', '1-800-774-64', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Francisco', '1313822@student.hcmus.edu.vn', '0800-182-412', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Henry', '1615143@student.hcmus.edu.vn', '0800-363-448', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Mario', '1614630@student.hcmus.edu.vn', '0800-616-572', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Maya', '1614751@student.hcmus.edu.vn', '0800-366-803', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Aaliyah', '1312035@student.hcmus.edu.vn', '1-844-097-34', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Angel', '1314668@student.hcmus.edu.vn', '0800-209-897', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Ernest', '1512227@student.hcmus.edu.vn', '0800-153-092', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Olivia', '1313630@student.hcmus.edu.vn', '0800-824-180', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Benjamin', '1611086@student.hcmus.edu.vn', '0800-678-627', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Emily', '1313253@student.hcmus.edu.vn', '0800-315-495', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Ellie', '1511281@student.hcmus.edu.vn', '0800-296-866', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Lila', '1314855@student.hcmus.edu.vn', '1-877-041-29', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Nora', '1413281@student.hcmus.edu.vn', '0800-687-431', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Philip', '1313158@student.hcmus.edu.vn', '1-844-937-67', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Leon', '1311263@student.hcmus.edu.vn', '0800-962-256', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Vivian', '1414617@student.hcmus.edu.vn', '1-855-977-12', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Jason', '1312565@student.hcmus.edu.vn', '0800-802-648', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Savannah', '1313263@student.hcmus.edu.vn', '0800-276-550', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Ella', '1514294@student.hcmus.edu.vn', '1-844-715-82', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Claude', '1512886@student.hcmus.edu.vn', '1-855-681-85', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Clinton', '1314741@student.hcmus.edu.vn', '1-866-182-12', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Manuel', '1413367@student.hcmus.edu.vn', '0800-536-663', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Douglas', '1311435@student.hcmus.edu.vn', '0800-240-783', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Ian', '1314042@student.hcmus.edu.vn', '0800-923-862', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Keith', '1513147@student.hcmus.edu.vn', '1-844-944-54', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Lauren', '1614467@student.hcmus.edu.vn', '1-855-378-52', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Ken', '1313112@student.hcmus.edu.vn', '0800-478-525', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Avery', '1411161@student.hcmus.edu.vn', '1-855-695-68', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Scarlett', '1613263@student.hcmus.edu.vn', '1-844-241-37', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Javier', '1412556@student.hcmus.edu.vn', '1-855-584-75', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Stanley', '1413108@student.hcmus.edu.vn', '0800-081-902', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Nora', '1515630@student.hcmus.edu.vn', '1-844-516-38', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Manuel', '1313161@student.hcmus.edu.vn', '1-844-865-61', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Jesus', '1511988@student.hcmus.edu.vn', '1-844-177-55', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Victoria', '1315888@student.hcmus.edu.vn', '1-800-338-46', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Victoria', '1515263@student.hcmus.edu.vn', '0800-668-454', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Ryan', '1314446@student.hcmus.edu.vn', '0800-832-128', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Matthew', '1612732@student.hcmus.edu.vn', '0800-612-521', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Lance', '1312717@student.hcmus.edu.vn', '0800-857-716', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Andy', '1512754@student.hcmus.edu.vn', '1-877-809-66', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Antonio', '1413243@student.hcmus.edu.vn', '0800-368-615', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Gilbert', '1315988@student.hcmus.edu.vn', '1-844-258-98', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Kenneth', '1611441@student.hcmus.edu.vn', '0800-852-742', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Erik', '1413822@student.hcmus.edu.vn', '0800-878-341', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Cory', '1413774@student.hcmus.edu.vn', '0800-317-858', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Jason', '1513614@student.hcmus.edu.vn', '0800-277-781', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Ken', '1415378@student.hcmus.edu.vn', '0800-346-098', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Allan', '1412147@student.hcmus.edu.vn', '0800-113-320', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Sarah', '1313750@student.hcmus.edu.vn', '1-866-356-34', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Benjamin', '1612839@student.hcmus.edu.vn', '0800-852-537', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Gordon', '1614197@student.hcmus.edu.vn', '0800-621-213', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Arianna', '1614147@student.hcmus.edu.vn', '1-855-151-75', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Benjamin', '1614750@student.hcmus.edu.vn', '0800-151-021', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Paisley', '1314601@student.hcmus.edu.vn', '0800-588-638', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Aria', '1515750@student.hcmus.edu.vn', '1-877-845-72', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Stanley', '1312630@student.hcmus.edu.vn', '1-877-343-15', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Makayla', '1513143@student.hcmus.edu.vn', '1-855-880-33', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Ella', '1311646@student.hcmus.edu.vn', '1-877-694-32', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Curtis', '1611161@student.hcmus.edu.vn', '0800-142-316', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Bob', '1415654@student.hcmus.edu.vn', '1-800-378-37', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Allison', '1412727@student.hcmus.edu.vn', '1-866-828-11', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Wayne', '1413118@student.hcmus.edu.vn', '0800-042-224', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Sarah', '1511411@student.hcmus.edu.vn', '0800-841-768', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Bobby', '1313858@student.hcmus.edu.vn', '0800-665-914', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Avery', '1513858@student.hcmus.edu.vn', '0800-881-846', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Jaime', '1511630@student.hcmus.edu.vn', '1-844-681-13', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Claude', '1313733@student.hcmus.edu.vn', '1-844-928-26', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Makayla', '1515535@student.hcmus.edu.vn', '1-877-528-49', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Everett', '1615843@student.hcmus.edu.vn', '0800-109-233', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Marc', '1615224@student.hcmus.edu.vn', '1-866-286-23', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Scarlett', '1613726@student.hcmus.edu.vn', '0800-561-191', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Aaron', '1513853@student.hcmus.edu.vn', '1-866-863-72', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Sarah', '1312485@student.hcmus.edu.vn', '0800-368-681', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Victor', '1313851@student.hcmus.edu.vn', '0800-381-198', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Alex', '1511955@student.hcmus.edu.vn', '1-866-812-55', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Jose', '1511035@student.hcmus.edu.vn', '1-866-236-27', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Ryan', '1514116@student.hcmus.edu.vn', '1-844-825-88', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Mackenzie', '1312267@student.hcmus.edu.vn', '0800-754-173', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Terrance', '1413450@student.hcmus.edu.vn', '1-866-848-97', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Jesse', '1612843@student.hcmus.edu.vn', '1-877-458-24', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Ava', '1515654@student.hcmus.edu.vn', '0800-111-113', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Michael', '1512556@student.hcmus.edu.vn', '1-855-018-43', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Aaron', '1513852@student.hcmus.edu.vn', '0800-677-435', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Lonnie', '1613116@student.hcmus.edu.vn', '0800-359-706', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Avery', '1411855@student.hcmus.edu.vn', '0800-411-206', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Gabriel', '1315851@student.hcmus.edu.vn', '1-800-243-42', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Jesus', '1511861@student.hcmus.edu.vn', '1-866-272-35', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Violet', '1512224@student.hcmus.edu.vn', '0800-567-511', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Brooklyn', '1512778@student.hcmus.edu.vn', '0800-581-662', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Scarlett', '1515651@student.hcmus.edu.vn', '0800-315-493', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Clinton', '1311338@student.hcmus.edu.vn', '0800-877-995', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Vivian', '1613587@student.hcmus.edu.vn', '1-844-627-52', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Marion', '1314026@student.hcmus.edu.vn', '0800-268-668', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Jerome', '1612140@student.hcmus.edu.vn', '0800-237-377', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Everett', '1615975@student.hcmus.edu.vn', '0800-111-926', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Mark', '1414651@student.hcmus.edu.vn', '1-866-789-81', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Adalyn', '1415751@student.hcmus.edu.vn', '0800-288-751', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Armando', '1313468@student.hcmus.edu.vn', '1-844-880-91', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Todd', '1611490@student.hcmus.edu.vn', '1-866-059-44', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Todd', '1413435@student.hcmus.edu.vn', '1-877-709-68', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Gabriel', '1511086@student.hcmus.edu.vn', '1-866-916-08', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Terry', '1411446@student.hcmus.edu.vn', '0800-134-358', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Barry', '1412108@student.hcmus.edu.vn', '1-888-959-32', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Violet', '1515140@student.hcmus.edu.vn', '0800-367-528', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Aaliyah', '1315294@student.hcmus.edu.vn', '0800-654-508', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Kirk', '1511851@student.hcmus.edu.vn', '0800-489-688', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Natalie', '1413852@student.hcmus.edu.vn', '1-866-183-42', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Terrence', '1414888@student.hcmus.edu.vn', '0800-393-217', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Matthew', '1315109@student.hcmus.edu.vn', '1-866-779-18', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Casey', '1413109@student.hcmus.edu.vn', '1-800-418-47', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Lila', '1414774@student.hcmus.edu.vn', '0800-879-092', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Arthur', '1315227@student.hcmus.edu.vn', '0800-437-401', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Paisley', '1514086@student.hcmus.edu.vn', '0800-854-354', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Antonio', '1614617@student.hcmus.edu.vn', '0800-367-445', bcrypt.hashSync('1512517', 10), 1],
];

var insert_users4 = [
    ['Hughes', 'Ruben', '1612435@student.hcmus.edu.vn', '0800-340-911', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Lila', '1415806@student.hcmus.edu.vn', '1-877-625-26', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Savannah', '1614888@student.hcmus.edu.vn', '1-844-475-39', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Gabriel', '1315820@student.hcmus.edu.vn', '1-855-332-52', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Bobby', '1415450@student.hcmus.edu.vn', '0800-514-753', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Juan', '1612741@student.hcmus.edu.vn', '1-855-874-81', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Herman', '1612534@student.hcmus.edu.vn', '0800-923-525', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Adalyn', '1615485@student.hcmus.edu.vn', '0800-371-047', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Ian', '1312318@student.hcmus.edu.vn', '0800-824-281', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Ellie', '1514485@student.hcmus.edu.vn', '1-800-988-72', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Mackenzie', '1313281@student.hcmus.edu.vn', '1-877-366-87', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Hannah', '1615726@student.hcmus.edu.vn', '0800-315-138', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Sydney', '1611615@student.hcmus.edu.vn', '0800-417-799', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Vivian', '1512852@student.hcmus.edu.vn', '0800-832-725', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Francisco', '1412851@student.hcmus.edu.vn', '0800-047-545', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Wayne', '1615402@student.hcmus.edu.vn', '0800-184-242', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Maya', '1313227@student.hcmus.edu.vn', '1-866-977-21', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Antonio', '1312338@student.hcmus.edu.vn', '0800-312-525', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Ruben', '1614238@student.hcmus.edu.vn', '1-855-856-13', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Alexander', '1312490@student.hcmus.edu.vn', '0800-151-364', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Jaime', '1411668@student.hcmus.edu.vn', '1-800-185-48', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Hannah', '1615630@student.hcmus.edu.vn', '1-866-032-82', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Charlotte', '1311452@student.hcmus.edu.vn', '1-844-955-42', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Dan', '1411535@student.hcmus.edu.vn', '1-844-676-36', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Gene', '1615756@student.hcmus.edu.vn', '0800-545-064', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Jerome', '1414636@student.hcmus.edu.vn', '0800-458-901', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Violet', '1511719@student.hcmus.edu.vn', '0800-552-539', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Kevin', '1312402@student.hcmus.edu.vn', '0800-652-342', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Everett', '1412273@student.hcmus.edu.vn', '1-866-358-05', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Armando', '1512535@student.hcmus.edu.vn', '0800-236-096', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Erik', '1412726@student.hcmus.edu.vn', '1-800-341-56', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Olivia', '1614490@student.hcmus.edu.vn', '1-844-745-85', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Claire', '1611820@student.hcmus.edu.vn', '1-855-839-14', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Lillian', '1513273@student.hcmus.edu.vn', '1-888-563-11', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Gabriel', '1415617@student.hcmus.edu.vn', '1-844-581-63', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Casey', '1511975@student.hcmus.edu.vn', '0800-006-787', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Mackenzie', '1413719@student.hcmus.edu.vn', '1-877-786-23', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Peter', '1512294@student.hcmus.edu.vn', '0800-422-784', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Kylie', '1511811@student.hcmus.edu.vn', '0800-360-151', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Emily', '1612402@student.hcmus.edu.vn', '1-844-448-84', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Claude', '1312774@student.hcmus.edu.vn', '1-855-733-88', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Darrell', '1313441@student.hcmus.edu.vn', '0800-281-814', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Casey', '1613617@student.hcmus.edu.vn', '1-800-114-35', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Herman', '1514615@student.hcmus.edu.vn', '1-800-328-66', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Ray', '1413741@student.hcmus.edu.vn', '1-877-012-71', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Kenneth', '1515227@student.hcmus.edu.vn', '1-877-883-16', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Benjamin', '1611727@student.hcmus.edu.vn', '1-855-841-27', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Charlotte', '1514490@student.hcmus.edu.vn', '1-800-486-71', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Clifton', '1613467@student.hcmus.edu.vn', '0800-332-057', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Aaliyah', '1613035@student.hcmus.edu.vn', '1-855-808-84', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Juan', '1415411@student.hcmus.edu.vn', '1-888-323-86', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Nicholas', '1512485@student.hcmus.edu.vn', '0800-280-185', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Nelson', '1513630@student.hcmus.edu.vn', '1-866-721-41', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Nora', '1614411@student.hcmus.edu.vn', '1-844-743-78', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Ruben', '1415446@student.hcmus.edu.vn', '0800-826-186', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Dwayne', '1511806@student.hcmus.edu.vn', '0800-926-658', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Claude', '1314886@student.hcmus.edu.vn', '0800-361-066', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Adalyn', '1614109@student.hcmus.edu.vn', '1-866-683-33', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Zoe', '1514224@student.hcmus.edu.vn', '1-866-167-92', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Bradley', '1614263@student.hcmus.edu.vn', '1-866-332-54', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Mackenzie', '1611186@student.hcmus.edu.vn', '0800-186-118', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Dwayne', '1513118@student.hcmus.edu.vn', '0800-985-390', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Kaitlyn', '1614535@student.hcmus.edu.vn', '0800-158-514', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Raul', '1313601@student.hcmus.edu.vn', '1-855-886-66', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Zoe', '1512367@student.hcmus.edu.vn', '1-888-176-55', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Vivian', '1614534@student.hcmus.edu.vn', '1-855-540-65', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Kylie', '1613668@student.hcmus.edu.vn', '0800-724-754', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Ian', '1413988@student.hcmus.edu.vn', '1-888-800-18', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Benjamin', '1614601@student.hcmus.edu.vn', '1-855-494-44', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Ernest', '1411485@student.hcmus.edu.vn', '0800-472-495', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Allison', '1612157@student.hcmus.edu.vn', '0800-014-433', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Vivian', '1414851@student.hcmus.edu.vn', '1-844-368-35', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Douglas', '1511565@student.hcmus.edu.vn', '1-888-908-43', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Jason', '1611281@student.hcmus.edu.vn', '1-866-745-38', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Sydney', '1411879@student.hcmus.edu.vn', '1-844-741-87', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Lonnie', '1412485@student.hcmus.edu.vn', '0800-536-842', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Gabriel', '1312587@student.hcmus.edu.vn', '1-855-265-67', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Claude', '1513811@student.hcmus.edu.vn', '1-866-435-61', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Donald', '1515378@student.hcmus.edu.vn', '1-844-113-37', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Gordon', '1311490@student.hcmus.edu.vn', '1-866-534-75', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Avery', '1511839@student.hcmus.edu.vn', '1-888-469-62', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Roberto', '1514727@student.hcmus.edu.vn', '1-877-897-33', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Dwayne', '1615441@student.hcmus.edu.vn', '1-866-686-42', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Ava', '1313338@student.hcmus.edu.vn', '1-844-581-84', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Stella', '1514238@student.hcmus.edu.vn', '0800-856-871', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Jesus', '1615955@student.hcmus.edu.vn', '1-855-136-23', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Jesse', '1312750@student.hcmus.edu.vn', '0800-946-865', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Mario', '1614855@student.hcmus.edu.vn', '0800-795-955', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Raul', '1415888@student.hcmus.edu.vn', '0800-496-684', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Clifton', '1312273@student.hcmus.edu.vn', '0800-022-136', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Nicholas', '1311467@student.hcmus.edu.vn', '1-866-577-72', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Roberto', '1415147@student.hcmus.edu.vn', '0800-055-351', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Joel', '1614161@student.hcmus.edu.vn', '0800-071-415', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Johnnie', '1511490@student.hcmus.edu.vn', '0800-108-178', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Franklin', '1611158@student.hcmus.edu.vn', '1-844-423-44', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Brett', '1411733@student.hcmus.edu.vn', '0800-462-448', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Johnnie', '1412886@student.hcmus.edu.vn', '0800-472-777', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Keira', '1312617@student.hcmus.edu.vn', '1-855-254-46', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Robert', '1513879@student.hcmus.edu.vn', '1-866-277-61', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Herman', '1615343@student.hcmus.edu.vn', '1-800-829-67', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Curtis', '1413378@student.hcmus.edu.vn', '1-877-053-46', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Victor', '1311858@student.hcmus.edu.vn', '1-866-571-26', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Paisley', '1613534@student.hcmus.edu.vn', '0800-365-664', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Dwayne', '1313741@student.hcmus.edu.vn', '0800-851-253', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Juan', '1614614@student.hcmus.edu.vn', '0800-462-178', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Hailey', '1313221@student.hcmus.edu.vn', '0800-794-534', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Peter', '1312086@student.hcmus.edu.vn', '1-877-885-76', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Marion', '1312294@student.hcmus.edu.vn', '0800-553-378', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Isabelle', '1611378@student.hcmus.edu.vn', '1-877-924-28', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Gianna', '1515109@student.hcmus.edu.vn', '0800-028-474', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Ben', '1511886@student.hcmus.edu.vn', '0800-667-233', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Henry', '1513140@student.hcmus.edu.vn', '1-855-536-41', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Rodney', '1315343@student.hcmus.edu.vn', '1-844-201-53', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Ella', '1612888@student.hcmus.edu.vn', '1-844-786-06', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Tim', '1515116@student.hcmus.edu.vn', '0800-962-261', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Lonnie', '1415535@student.hcmus.edu.vn', '0800-026-711', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Rodney', '1311158@student.hcmus.edu.vn', '1-844-492-85', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Savannah', '1613253@student.hcmus.edu.vn', '0800-873-537', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Terry', '1615273@student.hcmus.edu.vn', '0800-764-117', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Manuel', '1513378@student.hcmus.edu.vn', '0800-675-121', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Julian', '1612042@student.hcmus.edu.vn', '1-877-517-28', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Nora', '1413026@student.hcmus.edu.vn', '1-855-603-56', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Joseph', '1315668@student.hcmus.edu.vn', '0800-079-241', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Charlie', '1314273@student.hcmus.edu.vn', '0800-676-150', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Mitchell', '1512654@student.hcmus.edu.vn', '0800-144-648', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Camilla', '1413035@student.hcmus.edu.vn', '0800-537-425', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Jason', '1615754@student.hcmus.edu.vn', '1-844-727-87', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Clifton', '1311221@student.hcmus.edu.vn', '1-855-284-83', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Bob', '1412717@student.hcmus.edu.vn', '0800-245-433', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Herman', '1412026@student.hcmus.edu.vn', '0800-475-504', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Peter', '1614221@student.hcmus.edu.vn', '0800-911-559', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Marc', '1414197@student.hcmus.edu.vn', '1-877-327-34', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Ray', '1414161@student.hcmus.edu.vn', '0800-803-326', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Raul', '1511852@student.hcmus.edu.vn', '0800-605-156', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Paisley', '1315157@student.hcmus.edu.vn', '0800-841-378', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Jeffery', '1414026@student.hcmus.edu.vn', '1-888-915-65', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Hailey', '1412654@student.hcmus.edu.vn', '1-877-141-50', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Leo', '1611654@student.hcmus.edu.vn', '1-844-817-68', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Gianna', '1614853@student.hcmus.edu.vn', '1-877-627-63', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Bruce', '1315224@student.hcmus.edu.vn', '1-800-001-85', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Jeffery', '1512774@student.hcmus.edu.vn', '1-800-145-16', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Vivian', '1514035@student.hcmus.edu.vn', '1-844-387-71', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Vivian', '1612955@student.hcmus.edu.vn', '0800-750-513', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Ramon', '1513719@student.hcmus.edu.vn', '0800-962-882', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Ray', '1312221@student.hcmus.edu.vn', '1-855-245-23', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Keira', '1613988@student.hcmus.edu.vn', '1-844-561-39', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Jorge', '1411955@student.hcmus.edu.vn', '1-866-214-35', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Stella', '1514839@student.hcmus.edu.vn', '0800-170-198', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Wade', '1315086@student.hcmus.edu.vn', '1-877-608-87', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Jerry', '1514367@student.hcmus.edu.vn', '1-866-577-45', bcrypt.hashSync('1512517', 10), 1],
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
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users2), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users3), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users4), function (error, results, fields) {
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
