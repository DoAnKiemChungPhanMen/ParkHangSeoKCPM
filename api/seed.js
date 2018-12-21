var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var async = require("async");
var fs = require('fs');

var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

//[name]
var insert_roles = [
    ['Student'],
    ['Teacher'],
    ['Staff'],
    ['Admin']
];
//[name, start_date, end_date, vacation_time]
var insert_semesters = [
    ['HK1 2015-2016', '2015-10-1 00:00:00', '2015-12-23 00:00:00', '24/12/2015 - 5/1/2016'], //1
    ['HK2 2015-2016', '2016-1-15 00:00:00', '2016-4-28 00:00:00', '30/4/2016 - 2/5/2016'],   //2
    ['HK3 2015-2016', '2016-5-5 00:00:00', '2016-8-8 00:00:00', '16/8/2016 - 25/9/2016'],     //3
    ['HK1 2016-2017', '2016-10-2 00:00:00', '2016-12-25 00:00:00', '24/12/2016 - 6/1/2017'],  //4
    ['HK2 2016-2017', '2017-1-16 00:00:00', '2017-5-2 00:00:00', '30/4/2017 - 2/5/2017'],    //5
    ['HK3 2016-2017', '2017-5-8 00:00:00', '2017-8-11 00:00:00', '16/8/2017 - 25/9/2017'],   //6
    ['HK1 2017-2018', '2017-10-2 00:00:00', '2017-12-25 00:00:00', '24/12/2017 - 6/1/2017'],  //7
    ['HK2 2017-2018', '2018-1-16 00:00:00', '2018-5-2 00:00:00', '30/4/2018 - 2/5/2018'],    //8
    ['HK3 2017-2018', '2018-5-8 00:00:00', '2018-8-11 00:00:00', '16/8/2018 - 25/9/2018'],   //9
    ['HK1 2018-2019', '2018-10-2 00:00:00', '2018-12-25 00:00:00', '24/12/2018 - 6/1/2018'],  //10
    ['HK2 2018-2019', '2019-1-16 00:00:00', '2019-5-2 00:00:00', '30/4/2019 - 2/5/2019'],     //11
    ['HK3 2018-2019', '2019-5-8 00:00:00', '2019-8-11 00:00:00', '16/8/2019 - 25/9/2019'],    //12
];
//[name,code]
var insert_programs = [
    ['Chính Quy', 'CTT'],
    ['Việt Pháp', 'VP'],
    ['Chất lượng cao', 'CLC'],
    ['Cử nhân tài năng', 'TN'],
    ['Chương trình tiên tiến', 'TT'],
];
//[code,email,program_id]
var insert_classes = [
    ['16CTT', '16ctt@student.hcmus.edu.vn', 1], //1
    ['15CTT', '15ctt@student.hcmus.edu.vn', 1], //2
    ['14CTT', '14ctt@student.hcmus.edu.vn', 1], //3
    ['13CTT', '13ctt@student.hcmus.edu.vn', 1], //4
    ['16VP', '16vp@student.hcmus.edu.vn', 2], //6
    ['15VP', '15vp@student.hcmus.edu.vn', 2], //7
    ['14VP', '14vp@student.hcmus.edu.vn', 2], //8
    ['13VP', '13vp@student.hcmus.edu.vn', 2], //9
    ['16CLC', '16clc@student.hcmus.edu.vn', 3], //10
    ['15CLC', '15clc@student.hcmus.edu.vn', 3], //11
    ['14CLC', '14clc@student.hcmus.edu.vn', 3], //12
    ['13CLC', '13clc@student.hcmus.edu.vn', 3], //13
    ['16TN', '16tn@student.hcmus.edu.vn', 4], //19
    ['15TN', '15tn@student.hcmus.edu.vn', 4], //20
    ['14TN', '14tn@student.hcmus.edu.vn', 4], //21
    ['13TN', '13tn@student.hcmus.edu.vn', 4], //22
    ['16TN', '16tt@student.hcmus.edu.vn', 5], //19
    ['15TT', '15tt@student.hcmus.edu.vn', 5], //20
    ['14TT', '14tt@student.hcmus.edu.vn', 5], //21
    ['13TT', '13tt@student.hcmus.edu.vn', 5], //22
];
//[code, name, semester_id, program_id, office_hour, note]
var insert_courses=[
    ['DEO251','Computational Biology and Chemistry',4,2,NULL,NULL],
['BXD572','Advances in Engineering Software',4,1,NULL,NULL],
['RPY307','Computers and Biomedical Research',4,1,NULL,NULL],
['VKLW825','Computer Languages',4,3,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['BVX636','Computer Standards & Interfaces',4,3,NULL,NULL],
['DIPX607','Computer Aided Geometric Design',4,5,NULL,NULL],
['GUK125','Computational Geometry',4,5,NULL,NULL],
['HGV739','Computer Vision, Graphics, and Image Processing',4,2,NULL,NULL],
['CFG527','Computer Compacts',4,1,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['SPI115','Applied Soft Computing',4,3,NULL,NULL],
['TDJXY828','Cognitive Systems Research',4,4,NULL,NULL],
['DTAPU640','Artificial Intelligence',4,2,NULL,NULL],
['TTYJ773','Computer Networks',4,4,NULL,NULL],
['YFO817','Biometric Technology Today',4,5,NULL,NULL],
['VFGP382','Artificial Intelligence in Medicine',4,5,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['MWU251','Computer Networks [1976],',4,2,NULL,NULL],
['UPWF117','Computer Methods in Applied Mechanics and Engineering',4,3,NULL,NULL],
['NGU771','Advanced Engineering Informatics',4,5,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['LJF488','Computer Programs in Biomedicine',4,5,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['ISCGD902','Computer Speech & Language',4,1,NULL,NULL],
['SYSCA372','Computer Law & Security Report',4,2,NULL,NULL],
['CKOHH125','Computers & Chemistry',4,1,NULL,NULL],
['BBVTH758','Computer Methods and Programs in Biomedicine',4,1,NULL,NULL],
['KFLID866','Computational Statistics & Data Analysis',4,1,NULL,NULL],
['XWBV912','Computer Vision and Image Understanding',4,3,NULL,NULL],
['ILJX823','Computers and Standards',4,2,NULL,NULL],
['XYARK043','Artificial Intelligence in Engineering',4,2,NULL,NULL],
['POTYY911','Computer Physics Reports',4,4,NULL,NULL],
['OKU795','Computer Communications',4,3,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['ZMX660','Computers & Urban Society',4,4,NULL,NULL],
['LBX450','Computers & Security',4,5,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['MUQ436','Computers & Structures',4,4,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['HTX111','Computer Languages, Systems & Structures',4,5,NULL,NULL],
['EKIEU541','Computerized Medical Imaging and Graphics',4,3,NULL,NULL],
['ITSYH813','Computer Networks and ISDN Systems',4,5,NULL,NULL],
['QHWQB333','Computer Fraud & Security',4,4,NULL,NULL],
['GKPT667','Ad Hoc Networks',4,2,NULL,NULL],
['PUM854','Computer Fraud & Security Bulletin',4,4,NULL,NULL],
['FOPI085','Computers in Biology and Medicine',4,2,NULL,NULL],
['OMWT331','Computers & Geosciences',4,1,NULL,NULL],
['TDO667','Computer Physics Communications',4,1,NULL,NULL],
['IVR855','AEU - International Journal of Electronics and Communications',4,4,NULL,NULL],
['XKNKO437','Computers and Geotechnics',4,5,'Sed ut perspiciatis unde omnis ',NULL,NULL,NULL],
['DJRQ310','Computer-Aided Design',4,4,NULL,NULL],
['RSR044','Cognitive Science',4,4,NULL,NULL],
['LFS755','Computers and Electronics in Agriculture',4,1,NULL,NULL],
['KUS664','Computer Graphics and Image Processing',4,3,NULL,NULL],
['BOC224','Card Technology Today',4,2,NULL,NULL],
['WMD836','Computers & Graphics',4,3,NULL,NULL],
['IXFM718','Computer Audit Update',4,3,NULL,NULL],
];

//[class_id,course_id,schedules]
var  insert_class_has_course=[
    [1, 6, '7-B17-LT;18-B19-LT;20-E3-TH'],
[1, 7, '21-F9-TH;1-B3-TH'],
[1, 14, '7-F13-TH'],
[1, 15, '6-F10-LT;1-B23-LT;16-I14-TH'],
[1, 18, '17-F15-LT;9-B11-LT'],
[1, 19, '1-B17-TH;3-C16-TH'],
[1, 31, '19-C13-LT'],
[1, 33, '12-F22-TH'],
[1, 35, '14-I7-LT;9-B10-TH;13-F17-LT'],
[1, 43, '19-I23-LT;21-B3-TH;12-F9-TH'],
[2, 6, '0-E21-TH'],
[2, 7, '19-C3-LT'],
[2, 14, '19-F12-TH'],
[2, 15, '11-I2-LT'],
[2, 18, '4-B7-LT;21-C18-TH;2-E16-LT'],
[2, 19, '2-I22-TH'],
[2, 31, '12-I17-TH'],
[2, 33, '11-E19-TH'],
[2, 35, '9-B19-TH;12-B4-TH;13-C21-LT'],
[2, 43, '19-I7-LT;11-E1-LT'],
[3, 6, '3-E14-LT;7-I22-TH'],
[3, 7, '9-E5-LT;18-E4-TH;16-F2-TH'],
[3, 14, '15-F11-TH;12-I17-TH;14-B9-LT'],
[3, 15, '10-F9-LT;12-E1-LT;10-B5-TH'],
[3, 18, '11-C21-TH;9-I19-LT;14-I17-TH'],
[3, 19, '2-I3-LT;13-E7-TH;21-E21-TH'],
[3, 31, '4-E6-TH;18-C21-LT;7-B19-LT'],
[3, 33, '5-I23-TH;4-E1-LT;10-I1-TH'],
[3, 35, '18-C20-TH;14-E19-TH;18-C4-TH'],
[3, 43, '9-I17-LT'],
[4, 6, '1-I15-TH;6-F7-LT;15-E18-TH'],
[4, 7, '15-F14-LT;8-E12-TH'],
[4, 14, '2-E14-TH;13-E3-LT'],
[4, 15, '15-I14-TH;6-I12-TH;2-I5-TH'],
[4, 18, '11-I14-TH;17-B19-TH;14-I1-LT'],
[4, 19, '0-I14-LT;21-I2-TH'],
[4, 31, '12-I20-LT;13-E23-TH;5-B12-LT'],
[4, 33, '14-I16-LT;0-E1-LT;19-B19-TH'],
[4, 35, '14-B7-TH;8-I11-TH;14-B17-TH'],
[4, 43, '20-F10-TH;2-B4-TH;21-I1-TH'],
[5, 1, '2-E17-TH;19-C21-LT'],
[5, 8, '7-C5-LT;4-E9-TH;15-B1-LT'],
[5, 12, '20-C2-TH;5-I22-TH;3-B19-TH'],
[5, 16, '19-B1-LT'],
[5, 21, '19-F7-TH;16-I5-LT'],
[5, 26, '18-I13-LT;18-F14-TH;20-C5-TH'],
[5, 27, '7-F22-LT;2-F10-LT'],
[5, 37, '14-C18-TH'],
[5, 39, '13-E2-TH;4-E14-TH;0-I12-LT'],
[5, 48, '17-I8-TH'],
[6, 1, '18-B14-TH;19-C5-TH;15-E14-TH'],
[6, 8, '12-E16-TH;1-I6-LT;10-F3-LT'],
[6, 12, '5-F23-LT'],
[6, 16, '13-C21-TH'],
[6, 21, '14-F8-TH'],
[6, 26, '21-E3-LT;10-F23-LT'],
[6, 27, '10-E14-LT;16-F14-LT;14-E8-TH'],
[6, 37, '8-B16-TH;4-I4-TH;11-E13-TH'],
[6, 39, '4-I13-TH'],
[6, 48, '16-I15-TH;13-I5-TH;9-F8-TH'],
[7, 1, '18-I11-LT;5-I13-LT'],
[7, 8, '9-F9-TH;2-C2-LT;16-I6-LT'],
[7, 12, '9-B23-TH'],
[7, 16, '19-C10-LT;13-E7-LT'],
[7, 21, '18-B7-TH;1-B19-LT;7-I16-LT'],
[7, 26, '3-I23-TH;18-I22-LT;3-B22-LT'],
[7, 27, '19-F4-TH;19-F2-TH'],
[7, 37, '15-C7-TH'],
[7, 39, '13-I16-TH;13-C7-TH;1-I16-TH'],
[7, 48, '0-E10-TH;18-B8-LT'],
[8, 1, '5-B2-TH;16-C3-LT'],
[8, 8, '16-E13-LT;10-B19-LT;12-C9-TH'],
[8, 12, '16-I11-LT;9-B17-TH;1-I10-LT'],
[8, 16, '11-C11-LT;1-I13-LT;6-E11-TH'],
[8, 21, '19-E23-TH'],
[8, 26, '11-I10-LT'],
[8, 27, '3-C15-LT;7-F21-TH'],
[8, 37, '16-E23-LT;14-F15-LT'],
[8, 39, '7-F3-TH'],
[8, 48, '15-B23-LT'],
[9, 2, '6-E17-LT'],
[9, 3, '9-B2-LT;3-C13-LT'],
[9, 9, '14-B10-LT'],
[9, 20, '18-C9-LT'],
[9, 22, '21-B23-TH;16-I3-TH;1-F16-LT'],
[9, 23, '19-I2-TH'],
[9, 24, '7-F14-TH;14-B19-LT;9-I14-LT'],
[9, 40, '9-F21-TH;0-I23-TH;20-F5-TH'],
[9, 41, '5-C4-TH;1-F8-TH'],
[9, 46, '19-F23-TH;3-F13-TH;1-F6-TH'],
[10, 2, '13-C17-LT;8-E6-TH;1-E1-LT'],
[10, 3, '18-C1-TH'],
[10, 9, '15-F22-TH;16-F21-LT'],
[10, 20, '8-F6-TH'],
[10, 22, '15-E13-TH'],
[10, 23, '18-F5-TH;4-F7-TH;17-B6-LT'],
[10, 24, '10-F23-TH;21-C21-TH;7-E11-TH'],
[10, 40, '0-B3-LT;0-E11-LT'],
[10, 41, '11-E22-LT;18-C21-TH;19-I10-LT'],
[10, 46, '5-C12-TH'],
[11, 2, '21-E17-LT'],
[11, 3, '15-C10-LT'],
[11, 9, '15-C12-LT;19-E18-LT;0-F20-TH'],
[11, 20, '18-B19-TH;15-B23-LT;20-F23-LT'],
[11, 22, '1-E23-TH;12-I15-LT;15-C19-LT'],
[11, 23, '9-C21-LT;5-C20-LT;2-C10-LT'],
[11, 24, '16-F8-LT;19-F10-LT'],
[11, 40, '15-F5-LT;11-E13-TH;17-C4-LT'],
[11, 41, '11-F7-LT;1-C14-LT'],
[11, 46, '13-F4-LT;2-E9-LT;12-F21-LT'],
[12, 2, '6-F4-TH;14-C8-LT;11-I6-TH'],
[12, 3, '3-B9-LT;8-C10-TH;4-E22-TH'],
[12, 9, '21-F18-LT'],
[12, 20, '6-C2-LT'],
[12, 22, '0-F1-LT;16-I2-LT'],
[12, 23, '0-F15-TH'],
[12, 24, '16-C23-TH;8-E9-TH;18-B20-LT'],
[12, 40, '12-B18-TH;20-B14-TH;4-E19-TH'],
[12, 41, '2-I12-LT;15-I8-LT;8-E5-TH'],
[12, 46, '12-C4-LT;2-F14-TH'],
[13, 11, '6-I3-LT;5-E1-LT;14-E8-LT'],
[13, 13, '17-C14-LT;21-C16-TH'],
[13, 28, '7-C22-LT'],
[13, 30, '5-E16-LT;0-I21-TH'],
[13, 32, '1-E1-TH'],
[13, 36, '3-F18-LT;2-I16-LT;16-C13-LT'],
[13, 38, '6-B22-LT;10-E10-TH'],
[13, 42, '7-B11-LT;16-I10-LT;3-F15-LT'],
[13, 44, '21-E2-LT;17-I15-TH;6-E5-TH'],
[13, 45, '20-C16-LT;8-C18-LT'],
[14, 11, '11-E18-TH;2-I2-TH;9-F18-TH'],
[14, 13, '10-I2-TH;17-B21-TH'],
[14, 28, '9-E20-TH;4-I4-LT'],
[14, 30, '0-B10-TH;11-F6-LT;3-B13-TH'],
[14, 32, '21-B14-LT;16-F21-TH;5-C4-LT'],
[14, 36, '11-B19-TH'],
[14, 38, '6-E14-TH;4-C19-LT;21-E13-LT'],
[14, 42, '16-I10-TH'],
[14, 44, '9-F7-TH;9-I16-LT;1-B21-TH'],
[14, 45, '4-B18-TH'],
[15, 11, '8-B11-LT'],
[15, 13, '17-B20-LT;14-B3-LT'],
[15, 28, '19-C20-LT;19-F15-TH;19-E4-LT'],
[15, 30, '13-B14-LT;20-F21-LT;18-F2-TH'],
[15, 32, '21-F7-TH'],
[15, 36, '2-F17-TH;10-F3-LT;14-C18-TH'],
[15, 38, '11-C6-LT'],
[15, 42, '7-B15-TH;5-I6-TH;8-B9-LT'],
[15, 44, '3-I16-TH'],
[15, 45, '8-F12-TH;5-B12-TH;20-B20-TH'],
[16, 11, '15-F5-LT;17-I21-TH;6-E14-TH'],
[16, 13, '5-F9-LT;14-C14-TH'],
[16, 28, '19-F20-LT;8-I6-LT'],
[16, 30, '6-F5-TH;11-I3-LT;20-C16-TH'],
[16, 32, '19-B11-TH'],
[16, 36, '20-C6-TH;7-I5-TH;19-E8-LT'],
[16, 38, '14-E18-TH'],
[16, 42, '17-E3-LT'],
[16, 44, '4-B9-LT;3-E7-LT;20-I7-LT'],
[16, 45, '17-E5-TH;1-B3-LT;21-F21-TH'],
[17, 4, '11-B19-TH;11-C7-TH'],
[17, 5, '14-I2-TH'],
[17, 10, '13-F11-LT;15-F6-LT;6-E12-TH'],
[17, 17, '10-F7-TH;20-E13-TH'],
[17, 25, '4-F13-LT;6-C18-TH'],
[17, 29, '3-E17-LT'],
[17, 34, '0-E12-TH;18-E1-LT;19-E12-LT'],
[17, 47, '5-I16-LT;13-C7-TH'],
[17, 49, '10-C17-LT;2-B5-TH'],
[17, 50, '10-I21-LT;3-E10-LT'],
[18, 4, '12-C17-TH;16-C19-LT;0-E20-TH'],
[18, 5, '16-I18-TH;18-F17-TH;6-C8-LT'],
[18, 10, '14-E4-TH;16-E1-LT;7-E6-LT'],
[18, 17, '13-E23-TH;2-B5-LT;19-B1-TH'],
[18, 25, '18-E23-TH'],
[18, 29, '17-F7-TH;9-F6-TH;18-E1-TH'],
[18, 34, '11-I16-TH;17-B14-TH;10-C17-LT'],
[18, 47, '12-C8-LT;0-E15-LT'],
[18, 49, '19-E7-TH;15-E20-LT;4-C2-LT'],
[18, 50, '20-B9-LT'],
[19, 4, '15-I5-TH'],
[19, 5, '11-C3-LT'],
[19, 10, '18-F10-LT'],
[19, 17, '2-C4-TH;18-F3-LT;3-E9-TH'],
[19, 25, '10-B16-LT;0-E18-TH;18-B5-LT'],
[19, 29, '1-I22-TH'],
[19, 34, '12-F9-LT'],
[19, 47, '6-E15-TH'],
[19, 49, '3-E3-LT;18-B4-TH;2-F20-TH'],
[19, 50, '13-E4-LT;9-C7-LT;17-I8-TH'],
[20, 4, '0-E22-TH;17-B12-TH;1-B1-TH'],
[20, 5, '2-C14-TH;6-C5-LT'],
[20, 10, '19-I7-TH;10-I14-LT;20-I18-TH'],
[20, 17, '13-B17-LT;3-F5-LT;16-C20-TH'],
[20, 25, '1-B22-LT;17-C10-LT;1-E6-LT'],
[20, 29, '10-F16-LT;12-I22-TH;9-I13-LT'],
[20, 34, '19-I5-TH;7-F18-LT;14-B2-LT'],
[20, 47, '6-F8-TH;21-C21-TH;17-F19-LT'],
[20, 49, '21-I14-TH;8-C9-LT;6-I11-LT'],
];
//[first_name,last_name,email,phone,password,role_id]
var insert_users = [
    ['Đinh Bá', 'Tiến', 'dbtien@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('dbtien', 10), 2], //1
    ['Nguyễn Hữu', 'Anh', 'nhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nhanh', 10), 2], //2
    ['Nguyễn Hữu', 'Nhã', 'nhnha@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nhnha', 10), 2], //3
    ['Nguyễn Ngọc', 'Thu', 'nnthu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nnthu', 10), 2], //4
    ['Nguyễn Văn', 'Hùng', 'nvhung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nvhung', 10), 2], //5
    ['Trần Minh', 'Triết', 'tmtriet@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tmtriet', 10), 2], //6
    ['Phạm Hoàng', 'Uyên', 'phuyen@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('phuyen', 10), 2], //7
    ['Nguyễn Phúc', 'Sơn', 'npson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('npson', 10), 2], //8
    ['Ngô Tuấn', 'Phương', 'ntphuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntphuong', 10), 2], //9
    ['Nguyễn Tuấn', 'Nam', 'ntnam@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntnam', 10), 2], //10
    ['Nguyễn Thanh', 'Phương', 'ntphuong1@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntphuong1', 10), 2], //11
    ['Trần Trung', 'Dũng', 'ttdung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ttdung', 10), 2], //12
    ['Trần Thái', 'Sơn', 'ttson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ttson', 10), 2], //13
    ['Ngô Đức', 'Thành', 'ndthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ndthanh', 10), 2], //14
    ['Dương Nguyên', 'Vũ', 'dnvu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('dnvu', 10), 2], //15
    ['Lâm Quang', 'Vũ', 'lqvu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lqvu', 10), 2], //16
    ['Hồ Tuấn', 'Thanh', 'htthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('htthanh', 10), 2], //17
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tploc', 10), 2], //18
    ['Nguyễn Hữu Trí', 'Nhật', 'nhtnhat@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nhtnhat', 10), 2], //19
    ['Nguyễn Duy Hoàng', 'Minh', 'ndhminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ndhminh', 10), 2], //20
    ['Lương Vĩ', 'Minh', 'lvminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lvminh', 10), 2], //21
    ['Nguyễn Vinh', 'Tiệp', 'nvtiep@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nvtiep', 10), 2], //22
    ['Phạm Việt', 'Khôi', 'pvkhoi@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('pvkhoi', 10), 2], //23
    ['Nguyễn Văn', 'Thìn', 'nvthin@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nvthin', 10), 2], //24
    ['Nguyễn Thị Thanh', 'Huyền', 'ntthuyen@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntthuyen', 10), 2], //25
    ['Vũ Quốc', 'Hoàng', 'vqhoang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('vqhoang', 10), 2], //26
    ['Lê Quốc', 'Hòa', 'lqhoa@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lqhoa', 10), 2], //27
    ['Chung Thùy', 'Linh', 'ctlinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ctlinh', 10), 2], //28
    ['Lê Yên', 'Thanh', 'lythanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lythanh', 10), 2], //29
    ['Võ Hoài', 'Việt', 'vhviet@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('vhviet', 10), 2], //30
    ['Phạm Thanh', 'Tùng', 'pttung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('pttung', 10), 2], //31
    ['Nguyễn Đức', 'Huy', 'ndhuy@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ndhuy', 10), 2], //32
    ['Nguyễn Khắc', 'Huy', 'nkhuy@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nkhuy', 10), 2], //33
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tdquang', 10), 2], //34
    ['Trần Ngọc Đạt', 'Thành', 'tndthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tndthanh', 10), 2], //35
    ['Lê Minh', 'Quốc', 'lmquoc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lmquoc', 10), 2], //36
    ['Phạm Đức', 'Thịnh', 'pdthinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('pdthinh', 10), 2], //37
    ['Bùi Quốc', 'Minh', 'bqminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('bqminh', 10), 2], //38
    ['Võ Duy', 'Anh', 'vdanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('vdanh', 10), 2], //39
    ['Trần Thị Bích', 'Hạnh', 'ttbhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ttbhanh', 10), 2], //40
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tploc', 10), 2], //41
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tdquang', 10), 2], //42
    ['Tuấn Nguyên Đức', 'Hoài', 'tndhoai@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('tndhoai', 10), 2], //43
    ['Trần Hoàng', 'Khanh', 'thkhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('thkhanh', 10), 2], //44
    ['Lê Thị', 'Nhàn', 'ltnhan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ltnhan', 10), 2], //45
    ['Nguyễn Thị Thu', 'Vân', 'nttvan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nttvan', 10), 2], //46
    ['Nguyễn Thanh', 'Trọng', 'nttrong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('nttrong', 10), 2], //47
    ['Phạm Tuấn', 'Sơn', 'ptson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ptson', 10), 2], //48
    ['Đỗ Hoàng', 'Cường', 'dhcuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('dhcuong', 10), 2], //49
    ['Quản Thị Nguyệt', 'Thơ', 'qtntho@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('qtntho', 10), 2], //50
    ['Nguyễn Trần Minh', 'Thư', 'ntmthu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntmthu', 10), 2], //51
    ['Đặng Bình', 'Phương', 'dbphuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('dbphuong', 10), 2], //52
    ['Cao Thị Thùy', 'Liên', 'cttlien@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('cttlien', 10), 2], //53
    ['Trần Xuân Thiên', 'An', 'txtan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('txtan', 10), 2], //54
    ['Ngô Chánh', 'Đức', 'ncduc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ncduc', 10), 2], //55
    ['Lê Văn', 'Chánh', 'lvchanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lvchanh', 10), 2], //56
    ['Huỳnh Ngọc', 'Chương', 'hnchuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('hnchuong', 10), 2], //57
    ['Nguyễn Thanh Quản', 'Quản', 'ntquan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntquan', 10), 2], //58
    ['Lê Viết', 'Long', 'lvlong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lvlong', 10), 2], //59
    ['Nguyễn Thành', 'Long', 'ntlong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('ntlong', 10), 2], //60
    ['Lê Nguyễn Hoài', 'Nam', 'lnhnam@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('lnhnam', 10), 2], //61
    ['Bùi Đắc', 'Thịnh', 'bdthinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('bdthinh', 10), 2], //  

    //16APCS
    ['Nguyễn Toàn', 'Anh', '1651001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //63
    ['Võ Thành', 'An', '1651002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //64
    ['Huỳnh Gia', 'Bảo', '1651003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //65
    ['Phan Bình', 'Khang', '1651004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //66
    ['Cao Khắc Lê', 'Duy', '1651006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //67
    ['Lê Thanh', 'Duy', '1651007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //68
    ['Lê Sử Trường', 'Giang', '1651008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //69
    ['Lê Lưu Quỳnh,', 'Giao', '1651009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //70
    ['Nguyễn Đình,', 'Hiếu', '1651010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //71
    ['Nguyễn Huy', 'Hoàng', '1651011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //72
    ['Võ Anh', 'Hoàng', '1651012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //73
    //15APCS
    ['Nguyễn Đăng,', 'Hoàn', '1551001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //74
    ['Nguyễn Hoàng Phúc', 'Huy', '1551002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //75
    ['Trần Quang', 'Huy', '1551003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //76
    ['Lâm Gia', 'Khang', '1551004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //77
    ['Nguyễn Trần Duy', 'Khang', '1551005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //78
    ['Võ Thành Đăng', 'Khoa', '1551006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //79
    ['Hoàng', 'Khôi', '1551007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //80
    ['Chương Thế', 'Kiệt', '1551008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //81
    ['Võ Hồng', 'Lâm', '1551009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //82
    ['Triệu Quốc', 'Lập', '1551010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //83
    ['Võ Thị Nhật', 'Linh', '1551011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //84
    ['Đào Khước Anh', 'Nguyên', '1551012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //85
    ['Nguyễn Phúc', 'Nguyên', '1551013@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //86
    //14APCS
    ['Hồ Hữu', 'Phát', '1451001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //87
    ['Huỳnh Trần Anh', 'Phương', '1451002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //88
    ['Nguyễn Ngọc', 'Thanh', '1451003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //89
    ['Kim Nhật', 'Thành', '1451004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //90
    ['Thái', 'Thiện', '1451005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //91
    ['Nguyễn Bảo', 'Toàn', '1451006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //92
    ['Trịnh Hoàng', 'Triều', '1451007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //93
    ['Lê Minh', 'Trí', '1451008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //94
    ['Nguyễn Quang Minh', 'Trí', '1451009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //95
    ['Quách Minh', 'Trí', '1451010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //96
    ['Lê Quốc', 'Trung', '1451011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //97
    ['Huỳnh Minh', 'Tú', '1451012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //98
    //13APCS
    ['Cao Thanh', 'Tùng', '1351001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //99
    ['Huỳnh Thanh Quang', 'Tùng', '1351002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //100
    ['Văn Duy', 'Vinh', '1351003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //101
    ['Nguyễn Lê', 'Bảo', '1351004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //102
    ['Trương Minh', 'Bảo', '1351005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //103
    ['Phan Văn', 'Thuyên', '1351006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //104
    ['Trình Xuân', 'Sơn', '1351007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //105
    ['Hồ Ngọc Huỳnh', 'Mai', '1351008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //106
    ['Nguyễn Đắc', 'Phúc', '1351009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //107
    ['Đinh Duy', 'Tùng', '1351010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //108
    ['Trần Tinh', 'Chí', '1351011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //109
    ['Lê Trần Ngọc', 'Minh', '1351012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //110
    ['Dương Gia', 'Tuấn', '1351013@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //111
    ['Phan Hoàng', 'Anh', '1351014@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //112
    ['Ngụy Thiên', 'Ban', '1351015@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //113

    //16CLC1
    ['Nguyễn Toàn', 'Hai', '1653001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //114
    ['Võ Thành', 'Nguyen', '1653002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //115
    ['Huỳnh Gia', 'Thang', '1653003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //116
    ['Phan Bình', 'Gia', '1653004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //117
    ['Lý Trung', 'Dung', '1653005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //118
    ['Cao Khắc Lê', 'Vien', '1653006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //119
    ['Lê Thanh', 'Tri', '1653007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //120
    ['Lê Sử Trường', 'Duong', '1653008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //121
    ['Lê Lưu Quỳnh,', 'Khan', '1653009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //122
    ['Nguyễn Đình,', 'Duong', '1653010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //123
    ['Nguyễn Huy', 'Khanh', '1653011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //124
    //16CLC2
    ['Võ Anh', 'Thuy', '1653012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //125
    ['Nguyễn Đăng,', 'Dao', '1653013@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //126
    ['Nguyễn Hoàng Phúc', 'Uoc', '1653014@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //127
    ['Trần Quang', 'Xuan', '1653015@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //128
    ['Lâm Gia', 'Huong', '1653016@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //129
    ['Nguyễn Trần Duy', 'Khang', '1653017@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //130
    ['Võ Thành Đăng', 'Khoa', '1653018@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //131
    ['Hoàng', 'Van', '1653019@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //132
    ['Chương Thế', 'Don', '1653020@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //133
    ['Võ Hồng', 'Lien', '1653021@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //134
    ['Triệu Quốc', 'Lập', '1653022@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //135
    //15CLC
    ['Võ Thị Nhật', 'Linh', '1553001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //136
    ['Đào Khước Anh', 'Nguyên', '1553002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //137
    ['Nguyễn Phúc', 'Nguyên', '1553003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //138
    ['Hồ Hữu', 'Phát', '1553004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //139
    ['Huỳnh Trần Anh', 'Phương', '1553005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //140
    ['Nguyễn Ngọc', 'Thanh', '1553006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //141
    ['Kim Nhật', 'Thành', '1553007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //142
    ['Thái', 'Thiện', '1553008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //143
    ['Nguyễn Bảo', 'Minh', '1553009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //144
    ['Trịnh Hoàng', 'Triều', '1553010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //145
    //14CLC
    ['Lê Minh', 'Trí', '1453001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //146
    ['Nguyễn Quang Minh', 'Trí', '1453002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //147
    ['Quách Minh', 'Trí', '1453003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //148
    ['Lê Quốc', 'Trung', '1453004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //149
    ['Huỳnh Minh', 'Tú', '1453005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //150
    ['Cao Thanh', 'Tùng', '1453006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //151
    ['Huỳnh Thanh Quang', 'Tùng', '1453007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //152
    ['Văn Duy', 'Vinh', '1453008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //153
    ['Nguyễn Lê', 'Bảo', '1453009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //154
    ['Trương Minh', 'Bảo', '1453010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //155
    //13CLC
    ['Phan Văn', 'Thuyên', '1353001@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //156
    ['Trình Xuân', 'Sơn', '1353002@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //157
    ['Hồ Ngọc Huỳnh', 'Mai', '1353003@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //158
    ['Nguyễn Đắc', 'Phúc', '1353004@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //159
    ['Đinh Duy', 'Tùng', '1353005@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //160
    ['Trần Tinh', 'Chí', '1353006@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //161
    ['Lê Trần Ngọc', 'Minh', '1353007@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //162
    ['Dương Gia', 'Tuấn', '1353008@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //163
    ['Phan Hoàng', 'Anh', '1353009@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //164
    ['Ngụy Thiên', 'Ban', '1353010@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //165
    ['Ngô Trường', 'Đạt', '1353011@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353011', 10), 1], //166
    ['Nguyễn Thanh', 'Hoàng', '1353012@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353012', 10), 1], //167

    ['Lê Anh', 'Thảo', 'lathao@fit.hcmus.edu.vn', '01228718705', bcrypt.hashSync('lathao', 10), 3], //168
    ['Nguyễn Thị Minh', 'Phúc', 'ntmphuc@fit.hcmus.edu.vn', '01228718705', bcrypt.hashSync('ntmphuc', 10), 3], //169

    ['Park Hang', 'Seo', 'parkhangseo@fit.hcmus.edu.vn', '01228718705', bcrypt.hashSync('korea', 10), 4], //170

    //['Huỳnh Hữu', 'Nghĩa', '1412572@student.hcmus.edu.vn', '01228718705', bcrypt.hashSync('1353019', 10), 1], //171
];
//[teacher_id,course_id,teacher_role],
var insert_teacher_teach_course = [
    ['1', '1', '0'],
    ['17', '1', '1'],
    ['18', '1', '1'],

    ['2', '2', '0'],
    ['19', '2', '1'],

    ['3', '3', '0'],
    ['20', '3', '1'],

    ['4', '4', '0'],

    ['5', '5', '0'],

    ['6', '6', '0'],
    ['21', '6', '1'],
    ['22', '6', '1'],
    ['23', '6', '1'],

    ['7', '7', '0'],
    ['24', '7', '1'],
    ['8', '8', '0'],

    ['19', '8', '1'],

    ['9', '9', '0'],

    ['10', '10', '0'],
    ['25', '10', '1'],

    ['11', '11', '0'],
    ['26', '11', '1'],

    ['12', '12', '0'],
    ['27', '12', '1'],
    ['28', '12', '1'],

    ['2', '13', '0'],
    ['6', '13', '0'],
    ['22', '13', '1'],
    ['23', '13', '1'],
    ['29', '13', '1'],

    ['13', '14', '0'],
    ['31', '14', '1'],
    ['30', '14', '1'],

    ['14', '15', '0'],
    ['22', '15', '1'],

    ['16', '16', '0'],
    ['23', '16', '1'],
    ['31', '16', '1'],
    ['32', '16', '1'],
    ['33', '16', '1'],
    ['34', '16', '1'],

    ['15', '17', '0'],
    ['38', '17', '1'],
    ['37', '17', '1'],
    ['36', '17', '1'],
    ['35', '17', '1'],

    ['16', '18', '0'],
    ['40', '18', '1'],
    ['39', '18', '1'],

    ['16', '19', '0'],
    ['31', '19', '1'],
    ['43', '19', '1'],
    ['17', '19', '1'],
    ['42', '19', '1'],
    ['40', '19', '1'],

    ['1', '20', '0'],
    ['17', '20', '1'],
    ['18', '20', '1'],

    ['45', '21', '0'],
    ['21', '21', '1'],
    ['55', '21', '1'],

    ['46', '22', '0'],
    ['56', '22', '1'],

    ['47', '23', '0'],
    ['57', '23', '1'],

    ['48', '24', '0'],
    ['58', '24', '1'],
    ['59', '24', '1'],

    ['49', '25', '0'],
    ['60', '25', '1'],
    ['59', '25', '1'],

    ['7', '26', '0'],
    ['24', '26', '1'],

    ['9', '27', '0'],

    ['4', '28', '0'],

    ['50', '29', '0'],

    ['51', '30', '0'],
    ['61', '30', '1'],
    ['62', '30', '1'],

    ['52', '31', '0'],
    ['17', '31', '1'],
    ['32', '31', '1'],

    ['40', '32', '0'],
    ['21', '32', '1'],
    ['34', '32', '1'],

    ['16', '33', '0'],
    ['40', '33', '1'],
    ['18', '33', '1'],

    ['53', '34', '0'],
    ['32', '34', '1'],

    ['54', '35', '0'],
];
//[id, stud_id, class_id]
var insert_students = [
    //16APCS
    [63, '1651001', '1'], //63
    [64, '1651002', '1'], //64
    [65, '1651003', '1'], //65
    [66, '1651004', '1'], //66
    [67, '1651006', '1'], //67
    [68, '1651007', '1'], //68
    [69, '1651008', '1'], //69
    [70, '1651009', '1'], //70
    [71, '1651010', '1'], //71
    [72, '1651011', '1'], //72
    [73, '1651012', '1'], //73
    //15APCS
    [74, '1551001', '2'], //74
    [75, '1551002', '2'], //75
    [76, '1551003', '2'], //76
    [77, '1551004', '2'], //77
    [78, '1551005', '2'], //78
    [79, '1551006', '2'], //79
    [80, '1551007', '2'], //80
    [81, '1551008', '2'], //81
    [82, '1551009', '2'], //82
    [83, '1551010', '2'], //83
    [84, '1551011', '2'], //84
    [85, '1551012', '2'], //85
    [86, '1551013', '2'], //86
    //14APCS
    [87, '1451001', '3'], //87
    [88, '1451002', '3'], //88
    [89, '1451003', '3'], //89
    [90, '1451004', '3'], //90
    [91, '1451005', '3'], //91
    [92, '1451006', '3'], //92
    [93, '1451007', '3'], //93
    [94, '1451008', '3'], //94
    [95, '1451009', '3'], //95
    [96, '1451010', '3'], //96
    [97, '1451011', '3'], //97
    [98, '1451012', '3'], //98
    //13APCS
    [99, '1351001', '4'], //99
    [100, '1351002', '4'], //100
    [101, '1351003', '4'], //101
    [102, '1351004', '4'], //102
    [103, '1351005', '4'], //103
    [104, '1351006', '4'], //104
    [105, '1351007', '4'], //105
    [106, '1351008', '4'], //106
    [107, '1351009', '4'], //107
    [108, '1351010', '4'], //108
    [109, '1351011', '4'], //109
    [110, '1351012', '4'], //110
    [111, '1351013', '4'], //111
    [112, '1351014', '4'], //112
    [113, '1351015', '4'], //113

    //16CLC1
    [114, '1653001', '9'], //114
    [115, '1653002', '9'], //115
    [116, '1653003', '9'], //116
    [117, '1653004', '9'], //117
    [118, '1653005', '9'], //118
    [119, '1653006', '9'], //119
    [120, '1653007', '9'], //120
    [121, '1653008', '9'], //121
    [122, '1653009', '9'], //122
    [123, '1653010', '9'], //123
    [124, '1653011', '9'], //124
    //16CLC2
    [125, '1653012', '10'], //125
    [126, '1653013', '10'], //126
    [127, '1653014', '10'], //127
    [128, '1653015', '10'], //128
    [129, '1653016', '10'], //129
    [130, '1653017', '10'], //130
    [131, '1653018', '10'], //131
    [132, '1653019', '10'], //132
    [133, '1653020', '10'], //133
    [134, '1653021', '10'], //134
    [135, '1653022', '10'], //135
    //15CLC
    [136, '1553001', '11'], //136
    [137, '1553002', '11'], //137
    [138, '1553003', '11'], //138
    [139, '1553004', '11'], //139
    [140, '1553005', '11'], //140
    [141, '1553006', '11'], //141
    [142, '1553007', '11'], //142
    [143, '1553008', '11'], //143
    [144, '1553009', '11'], //144
    [145, '1553010', '11'], //145
    //14CLC
    [146, '1453001', '12'], //146
    [147, '1453002', '12'], //147
    [148, '1453003', '12'], //148
    [149, '1453004', '12'], //149
    [150, '1453005', '12'], //150
    [151, '1453006', '12'], //151
    [152, '1453007', '12'], //152
    [153, '1453008', '12'], //153
    [154, '1453009', '12'], //154
    [155, '1453010', '12'], //155
    //13CLC
    [156, '1353001', '13'], //156
    [157, '1353002', '13'], //157
    [158, '1353003', '13'], //158
    [159, '1353004', '13'], //159
    [160, '1353005', '13'], //160
    [161, '1353006', '13'], //161
    [162, '1353007', '13'], //162
    [163, '1353008', '13'], //163
    [164, '1353009', '13'], //164
    [165, '1353010', '13'], //165
    [166, '1353011', '13'], //166
    [167, '1353012', '13'], //167
    //[171, '1353019', '13'], //171
];
//[course_id , student_id]
var insert_student_enroll_course = [
    //16APCS
    [1, 63], //63
    [1, 64], //64
    [1, 65], //65
    [1, 66], //66
    [1, 67], //67
    [1, 68], //68
    [1, 69], //69
    [1, 70], //70
    [1, 71], //71
    [1, 72], //72
    [1, 73], //73

    [2, 63], //63
    [2, 64], //64
    [2, 65], //65
    [2, 66], //66
    [2, 67], //67
    [2, 68], //68
    [2, 69], //69
    [2, 70], //70
    [2, 71], //71
    [2, 72], //72
    [2, 73], //73

    [3, 63], //63
    [3, 64], //64
    [3, 65], //65
    [3, 66], //66
    [3, 67], //67
    [3, 68], //68
    [3, 69], //69
    [3, 70], //70
    [3, 71], //71
    [3, 72], //72
    [3, 73], //73

    [4, 63], //63
    [4, 64], //64
    [4, 65], //65
    [4, 66], //66
    [4, 67], //67
    [4, 68], //68
    [4, 69], //69
    [4, 70], //70
    [4, 71], //71
    [4, 72], //72
    [4, 73], //73

    [5, 63], //63
    [5, 64], //64
    [5, 65], //65
    [5, 66], //66
    [5, 67], //67
    [5, 68], //68
    [5, 69], //69
    [5, 70], //70
    [5, 71], //71
    [5, 72], //72
    [5, 73], //73
    //15APCS
    [6, 74], //74
    [6, 75], //75
    [6, 76], //76
    [6, 77], //77
    [6, 78], //78
    [6, 79], //79
    [6, 80], //80
    [6, 81], //81
    [6, 82], //82
    [6, 83], //83
    [6, 84], //84
    [6, 85], //85
    [6, 86], //86

    [7, 74], //74
    [7, 75], //75
    [7, 76], //76
    [7, 77], //77
    [7, 78], //78
    [7, 79], //79
    [7, 80], //80
    [7, 81], //81
    [7, 82], //82
    [7, 83], //83
    [7, 84], //84
    [7, 85], //85
    [7, 86], //86

    [8, 74], //74
    [8, 75], //75
    [8, 76], //76
    [8, 77], //77
    [8, 78], //78
    [8, 79], //79
    [8, 80], //80
    [8, 81], //81
    [8, 82], //82
    [8, 83], //83
    [8, 84], //84
    [8, 85], //85
    [8, 86], //86

    [9, 74], //74
    [9, 75], //75
    [9, 76], //76
    [9, 77], //77
    [9, 78], //78
    [9, 79], //79
    [9, 80], //80
    [9, 81], //81
    [9, 82], //82
    [9, 83], //83
    [9, 84], //84
    [9, 85], //85
    [9, 86], //86

    [10, 74], //74
    [10, 75], //75
    [10, 76], //76
    [10, 77], //77
    [10, 78], //78
    [10, 79], //79
    [10, 80], //80
    [10, 81], //81
    [10, 82], //82
    [10, 83], //83
    [10, 84], //84
    [10, 85], //85
    [10, 86], //86

    //14APCS
    [11, 87], //87
    [11, 88], //88
    [11, 89], //89
    [11, 90], //90
    [11, 91], //91
    [11, 92], //92
    [11, 93], //93
    [11, 94], //94
    [11, 95], //95
    [11, 96], //96
    [11, 97], //97
    [11, 98], //98

    [12, 87], //87
    [12, 88], //88
    [12, 89], //89
    [12, 90], //90
    [12, 91], //91
    [12, 92], //92
    [12, 93], //93
    [12, 94], //94
    [12, 95], //95
    [12, 96], //96
    [12, 97], //97
    [12, 98], //98

    [13, 87], //87
    [13, 88], //88
    [13, 89], //89
    [13, 90], //90
    [13, 91], //91
    [13, 92], //92
    [13, 93], //93
    [13, 94], //94
    [13, 95], //95
    [13, 96], //96
    [13, 97], //97
    [13, 98], //98

    [14, 87], //87
    [14, 88], //88
    [14, 89], //89
    [14, 90], //90
    [14, 91], //91
    [14, 92], //92
    [14, 93], //93
    [14, 94], //94
    [14, 95], //95
    [14, 96], //96
    [14, 97], //97
    [14, 98], //98

    [15, 87], //87
    [15, 88], //88
    [15, 89], //89
    [15, 90], //90
    [15, 91], //91
    [15, 92], //92
    [15, 93], //93
    [15, 94], //94
    [15, 95], //95
    [15, 96], //96
    [15, 97], //97
    [15, 98], //98

    [16, 87], //87
    [16, 88], //88
    [16, 89], //89
    [16, 90], //90
    [16, 91], //91
    [16, 92], //92
    [16, 93], //93
    [16, 94], //94
    [16, 95], //95
    [16, 96], //96
    [16, 97], //97
    [16, 98], //98

    //13APCS
    [17, 99], //99
    [17, 100], //100
    [17, 101], //101
    [17, 102], //102
    [17, 103], //103
    [17, 104], //104
    [17, 105], //105
    [17, 106], //106
    [17, 107], //107
    [17, 108], //108
    [17, 109], //109
    [17, 110], //110
    [17, 111], //111
    [17, 112], //112
    [17, 113], //113

    [18, 99], //99
    [18, 100], //100
    [18, 101], //101
    [18, 102], //102
    [18, 103], //103
    [18, 104], //104
    [18, 105], //105
    [18, 106], //106
    [18, 107], //107
    [18, 108], //108
    [18, 109], //109
    [18, 110], //110
    [18, 111], //111
    [18, 112], //112
    [18, 113], //113

    [19, 99], //99
    [19, 100], //100
    [19, 101], //101
    [19, 102], //102
    [19, 103], //103
    [19, 104], //104
    [19, 105], //105
    [19, 106], //106
    [19, 107], //107
    [19, 108], //108
    [19, 109], //109
    [19, 110], //110
    [19, 111], //111
    [19, 112], //112
    [19, 113], //113

    //16CLC1
    [20, 114], //114
    [20, 115], //115
    [20, 116], //116
    [20, 117], //117
    [20, 118], //118
    [20, 119], //119
    [20, 120], //120
    [20, 121], //121
    [20, 122], //122
    [20, 123], //123
    [20, 124], //1241

    [21, 114], //114
    [21, 115], //115
    [21, 116], //116
    [21, 117], //117
    [21, 118], //118
    [21, 119], //119
    [21, 120], //120
    [21, 121], //121
    [21, 122], //122
    [21, 123], //123
    [21, 124], //124

    [22, 114], //114
    [22, 115], //115
    [22, 116], //116
    [22, 117], //117
    [22, 118], //118
    [22, 119], //119
    [22, 120], //120
    [22, 121], //121
    [22, 122], //122
    [22, 123], //123
    [22, 124], //124

    [23, 114], //114
    [23, 115], //115
    [23, 116], //116
    [23, 117], //117
    [23, 118], //118
    [23, 119], //119
    [23, 120], //120
    [23, 121], //121
    [23, 122], //122
    [23, 123], //123
    [23, 124], //124

    //16CLC2
    [24, 125], //125
    [24, 126], //126
    [24, 127], //127
    [24, 128], //128
    [24, 129], //129
    [24, 130], //130
    [24, 131], //131
    [24, 132], //132
    [24, 133], //133
    [24, 134], //134
    [24, 135], //135

    [25, 125], //125
    [25, 126], //126
    [25, 127], //127
    [25, 128], //128
    [25, 129], //129
    [25, 130], //130
    [25, 131], //131
    [25, 132], //132
    [25, 133], //133
    [25, 134], //134
    [25, 135], //135

    [26, 125], //125
    [26, 126], //126
    [26, 127], //127
    [26, 128], //128
    [26, 129], //129
    [26, 130], //130
    [26, 131], //131
    [26, 132], //132
    [26, 133], //133
    [26, 134], //134
    [26, 135], //135

    [27, 125], //125
    [27, 126], //126
    [27, 127], //127
    [27, 128], //128
    [27, 129], //129
    [27, 130], //130
    [27, 131], //131
    [27, 132], //132
    [27, 133], //133
    [27, 134], //134
    [27, 135], //135

    //15CLC
    [28, 136], //136
    [28, 137], //137
    [28, 138], //138
    [28, 139], //139
    [28, 140], //140
    [28, 141], //141
    [28, 142], //142
    [28, 143], //143
    [28, 144], //144
    [28, 145], //145

    [29, 136], //136
    [29, 137], //137
    [29, 138], //138
    [29, 139], //139
    [29, 140], //140
    [29, 141], //141
    [29, 142], //142
    [29, 143], //143
    [29, 144], //144
    [29, 145], //145

    [30, 136], //136
    [30, 137], //137
    [30, 138], //138
    [30, 139], //139
    [30, 140], //140
    [30, 141], //141
    [30, 142], //142
    [30, 143], //143
    [30, 144], //144
    [30, 145], //145

    [31, 136], //136
    [31, 137], //137
    [31, 138], //138
    [31, 139], //139
    [31, 140], //140
    [31, 141], //141
    [31, 142], //142
    [31, 143], //143
    [31, 144], //144
    [31, 145], //145

    [32, 136], //136
    [32, 137], //137
    [32, 138], //138
    [32, 139], //139
    [32, 140], //140
    [32, 141], //141
    [32, 142], //142
    [32, 143], //143
    [32, 144], //144
    [32, 145], //145

    //14CLC
    [33, 146], //146
    [33, 147], //147
    [33, 148], //148
    [33, 149], //149
    [33, 150], //150
    [33, 151], //151
    [33, 152], //152
    [33, 153], //153
    [33, 154], //154
    [33, 155], //155

    [34, 146], //146
    [34, 147], //147
    [34, 148], //148
    [34, 149], //149
    [34, 150], //150
    [34, 151], //151
    [34, 152], //152
    [34, 153], //153
    [34, 154], //154
    [34, 155], //155

    [35, 146], //146
    [35, 147], //147
    [35, 148], //148
    [35, 149], //149
    [35, 150], //150
    [35, 151], //151
    [35, 152], //152
    [35, 153], //153
    [35, 154], //154
    [35, 155], //155

    [36, 146], //146
    [36, 147], //147
    [36, 148], //148
    [36, 149], //149
    [36, 150], //150
    [36, 151], //151
    [36, 152], //152
    [36, 153], //153
    [36, 154], //154
    [36, 155], //155

    [37, 146], //146
    [37, 147], //147
    [37, 148], //148
    [37, 149], //149
    [37, 150], //150
    [37, 151], //151
    [37, 152], //152
    [37, 153], //153
    [37, 154], //154
    [37, 155], //155

    //13CLC
    [38, 156], //156
    [38, 157], //157
    [38, 158], //158
    [38, 159], //159
    [38, 160], //160
    [38, 161], //161
    [38, 162], //162
    [38, 163], //163
    [38, 164], //164
    [38, 165], //166
    [38, 167], //167

    [39, 156], //156
    [39, 157], //157
    [39, 158], //158
    [39, 159], //159
    [39, 160], //160
    [39, 161], //161
    [39, 162], //162
    [39, 163], //163
    [39, 164], //164
    [39, 165], //166
    [39, 167], //167
];
//[student_id, reason, start_date, end_date]
var insert_absence_requests = [
    [63, 'Đi khám nghĩa vụ quân sự', '2017-05-31 00:00:00', '2017-06-01 00:00:00'],
    [63, 'Đi thi ACM', '2017-06-03 00:00:00', '2017-06-10 00:00:00'],
];
//[course_id,class_id,closed]
var insert_attendance = [
    [20, 9, 1], //1
    [20, 9, 1], //2
    [20, 10, 1], //3
    [20, 10, 0], //4
];
//[attendance_id, student_id, attendance_type]
var insert_attendance_detail = [
    [1, 114, 1],
    [1, 115, 0],
    [1, 116, 1],
    [1, 117, 0],
    [1, 118, 1],
    [1, 119, 0],
    [1, 120, 1],
    [1, 121, 0],
    [1, 122, 1],
    [1, 123, 0],
    [1, 124, 1],

    [2, 114, 0],
    [2, 115, 1],
    [2, 116, 0],
    [2, 117, 1],
    [2, 118, 0],
    [2, 119, 1],
    [2, 120, 0],
    [2, 121, 1],
    [2, 122, 0],
    [2, 123, 1],
    [2, 124, 0],

    [3, 125, 0],
    [3, 126, 1],
    [3, 127, 0],
    [3, 128, 1],
    [3, 129, 0],
    [3, 130, 1],
    [3, 131, 0],
    [3, 132, 1],
    [3, 133, 0],
    [3, 134, 1],
    [3, 135, 0],

    [4, 125, 0],
    [4, 126, 1],
    [4, 127, 0],
    [4, 128, 1],
    [4, 129, 0],
    [4, 130, 1],
    [4, 131, 0],
    [4, 132, 1],
    [4, 133, 0],
    [4, 134, 1],
    [4, 135, 0],
];
//[from_id, to_id, title, content, category, type, read, replied]
var insert_feeback = [
    [null, null, 'Phòng học kém chất lượng', 'Máy lạnh nóng quớ', 2, 3, false, false],//1
    [171, 1, 'Thầy dạy quá nhanh', 'Thầy có thể dạy chậm lại cho em dễ hiểu ?', 1, 1, false, false],//2
    [171, null, 'Ổ điện hỏng', 'Ổ điện dãy giữa phòng I44 bị hỏng', 2, 1, true, true],//3
    [171, null, 'Lớp 13CLC hư', 'Lớp 13CLC nói chuyện quá nhiều trong giờ', 1, 1, true, true],//4
    [null, null, 'Phòng học chất lượng thấp', 'Khong co may lanh', 2, 3, false, false],//5
    [171, 1, 'Thầy dạy quá khó hiểu', 'Thầy có thể dạy chậm lại cho em dễ hiểu ?', 1, 1, false, false],//6
    [171, 2, 'Cô hay đến lớp trễ', 'Tóc mới của cô làm em khó tập trung quá!', 1, 1, false, false],//7
    [1, null, 'Ổ điện không mở được', 'Cô hãy fix giúp tụi em', 2, 1, true, true],//8
    [1, null, 'Lớp 13CLC cúp học cả lớp', 'Lớp 13CLC nói chuyện quá ', 1, 1, true, true]//9
];
//[title, class_has_course_id, created_by,is_template]
var insert_quiz = [
    ['KTLT tuần 1', 20, 1, 1], //1
];
//[quiz_id, text, option_a, option_b, option_c, option_d, correct_option, timer]
var insert_quiz_question = [
    [1, `Kiểu nào có kích thước lớn nhất`, 'int', 'char', 'long', 'double', 'double', 10], //1
    [1, `Dạng hậu tố của biểu thức 9 - (5 + 2) là ?`, '95-+2', '95-2+', '952+-', '95+2-', '952+-', 10], //2
    [1, `Giả sử a và b là hai số thực. Biểu thức nào dưới đây là không được phép theo cú pháp của ngôn ngữ lập trình C?`, 'ab', 'a-=b', 'a>>=b', 'a*=b', 'a>>=b', 10],//3
];
//[quiz_question_id, selected_option, answered_by]
var insert_quiz_answer = [
    [1, `C`, 114], //1
    [1, `D`, 115], //2
    [2, `B`, 114], //3
    [2, `C`, 115], //4
    [3, `C`, 116], //3
    [3, `A`, 117], //4
];
//[to_id, message, object_id, type]
var insert_notifications = [
    [null, 1, `Đinh Bá Tiến sent you a feedback`, 5, _global.notification_type.sent_feedback], //1
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
                connection.query(format('INSERT INTO roles (name) VALUES %L', insert_roles), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO semesters (name,start_date,end_date,vacation_time) VALUES %L', insert_semesters), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO programs (name,code) VALUES %L', insert_programs), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO classes (name,email,program_id) VALUES %L', insert_classes), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO courses (code,name,semester_id,program_id,office_hour,note) VALUES %L', insert_courses), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO class_has_course (class_id,course_id,schedules) VALUES %L', insert_class_has_course), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO teacher_teach_course (teacher_id,course_id,teacher_role) VALUES %L', insert_teacher_teach_course), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', insert_students), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            // function (callback) {
            //     connection.query(format('INSERT INTO student_enroll_course (class_has_course_id,student_id) VALUES %L', insert_student_enroll_course), function (error, results, fields) {
            //         if (error) {
            //             callback(error);
            //         } else {
            //             callback();
            //         }
            //     });
            // },
            function (callback) {
                connection.query(format('INSERT INTO absence_requests (student_id, reason, start_date, end_date) VALUES %L', insert_absence_requests), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            // function (callback) {
            //     connection.query(format('INSERT INTO attendance (course_id,class_id,closed) VALUES %L', insert_attendance), function (error, results, fields) {
            //         if (error) {
            //             callback(error);
            //         } else {
            //             callback();
            //         }
            //     });
            // },
            // function (callback) {
            //     connection.query(format('INSERT INTO attendance_detail (attendance_id, student_id, attendance_type) VALUES %L', insert_attendance_detail), function (error, results, fields) {
            //         if (error) {
            //             callback(error);
            //         } else {
            //             callback();
            //         }
            //     });
            // },
            function (callback) {
                connection.query(format('INSERT INTO feedbacks (from_id, to_id, title, content, category, type, read, replied) VALUES %L', insert_feeback), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO quiz (title, class_has_course_id, created_by, is_template) VALUES %L', insert_quiz), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO quiz_questions (quiz_id, text, option_a, option_b, option_c, option_d, correct_option, timer) VALUES %L', insert_quiz_question), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO quiz_answers (quiz_question_id, selected_option ,answered_by) VALUES %L', insert_quiz_answer), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO notifications (to_id,from_id, message ,object_id, type) VALUES %L', insert_notifications), function (error, results, fields) {
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

var insert_admin = [
    ['Nguyễn Kim', 'Thảo', 'taonuaa004@gmail.com', '0929748527', bcrypt.hashSync('12121993a', 10), 4], //1
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

var gendData = function (res) {

    fs.readFile('1.txt','utf8', function (error, data) {
        if (error) {
            res.send('loi'+error);
        }
        else {
            var arrUser = data.split('\n');
            res.send(arrUser[0]);
        }
    });

    // pool_postgres.connect(function (error, connection, done) {
    //     async.series([
    //         //Start transaction
    //         function (callback) {
    //             connection.query('BEGIN', (error) => {
    //                 if (error) callback(error);
    //                 else callback();
    //             });
    //         },
    //         function (callback) {
    //             connection.query(arrUser[0], function (error, results, fields) {
    //                 if (error) {
    //                     callback(error);
    //                 } else {
    //                     callback();
    //                 }
    //             });
    //         },
    //         //Commit transaction
    //         function (callback) {
    //             connection.query('COMMIT', (error) => {
    //                 if (error) callback(error);
    //                 else callback();
    //             });
    //         },
    //     ], function (error) {
    //         if (error) {
    //             _global.sendError(res, error.message);
    //             connection.query('ROLLBACK', (error) => {
    //                 if (error) return console.log(error);
    //             });
    //             done(error);
    //             return console.log(error);
    //         } else {
    //             console.log('success seeding!---------------------------------------');
    //             res.send({ result: 'success', message: 'success seeding' });
    //             done();
    //         }
    //     });
    // });
}

router.get('/', function (req, res, next) {
    //seeding_mysql(res);
    seeding_postgres(res);
});
router.get('/genData', function (req, res, next) {
    gendData(res);
});
router.get('/admin', function (req, res, next) {
    //seeding_mysql(res);
    seeding_admin(res);
});
module.exports = router;

// var insert_class_has_course = [
//     ['1', '1', '4-I44-LT;8-I41-LT;14-I11C-TH;15-I11C-TH;22-I44-LT'], //1
//     ['1', '2', '2-I42-TH;3-I42-TH;5-I44-LT;12-I44-LT'], //2
//     ['1', '3', '13-I42-LT;15-I42-TH;18-I42-LT;19-I42-TH'], //3
//     ['1', '4', '16-I44-LT;17-I44-LT'], //4
//     ['1', '5', '20-OUT-TH;21-OUT-TH'], //5

//     ['2', '6', '12-I42-LT;20-I42-LT'], //6
//     ['2', '7', '8-I42-LT;9-I42-LT;18-B11A-TH'], //7
//     ['2', '8', '1-I42-LT;10-I23-TH;11-I23-TH;17-I23-LT'], //8
//     ['2', '9', '14-I23-LT;15-I23-LT'], //9
//     ['2', '10', '6-B11A-LT;7-B11A-LT;13-I11C-TH'], //10

//     ['3', '11', '1-I23-LT;5-I23-LT;12-I11C-TH;12-I44-LT'], //11
//     ['3', '12', '0-I23-LT;6-I11C-TH;7-I11C-TH;16-I23-LT'], //12
//     ['3', '13', '4-I23-LT;13-I23-LT;22-I23-TH'], //13
//     ['3', '14', '2-I11C-TH;11-I44-LT;19-I44-LT'], //14
//     ['3', '15', '3-I44-LT;20-I44-LT;23-I23-TH'], //15
//     ['3', '16', '8-I23-LT;9-I23-LT'], //16

//     ['4', '17', '6-I44-LT;7-I41-LT'], //17
//     ['4', '18', '2-I44-LT;10-I44-LT'], //18
//     ['4', '19', '12-I41-LT;13-I41-LT'], //19

//     ['9', '20', '0-B11A-LT;7-I61-TH;20-B11A-LT'], //20
//     ['9', '21', '5-B11A-LT;21-I41-LT'], //21
//     ['9', '22', '14-B11A-LT;15-B11A-LT;23-I41-TH'], //22
//     ['9', '23', '10-B11A-LT;19-I41-TH;22-IB11A-LT'], //23

//     ['10', '20', '1-B11A-LT;6-I61-TH;21-B11A-LT'], //24
//     ['10', '21', '4-B11A-LT;20-B11A-LT'], //25
//     ['10', '22', '12-B11A-LT;13-B11A-TH;22-I41-TH'], //26
//     ['10', '23', '11-B11A-LT;18-I41-TH;23-IB11A-LT'], //27

//     ['11', '24', '1-B11A-LT;6-I61-TH;21-B11A-LT'], //28
//     ['11', '25', '4-B11A-LT;20-B11A-LT'], //29
//     ['11', '26', '12-B11A-LT;13-B11A-TH;22-I41-TH'], //30
//     ['11', '27', '11-B11A-LT;18-I41-TH;23-IB11A-LT'], //31
//     ['11', '28', '11-B11A-LT;18-I41-TH;23-IB11A-LT'], //32

//     ['12', '29', '11-B11A-LT;18-I41-TH;23-IB11A-LT'], //33
//     ['12', '30', '16-I41-LT;17-I41-LT'], //34
//     ['12', '31', '10-B11B-LT;11-B11B-LT'], //35
//     ['12', '32', '6-B11B-LT;7-B11B-TH'], //36
//     ['12', '33', '1-I44-LT;18-I44-LT'], //37

//     ['13', '34', '6-I42-LT;7-I42-LT'], //38
//     ['13', '35', '16-B11A-LT;17-B11A-LT'], //39
// ];
// var insert_courses = [
//     ['CS162', 'Introduction to Computer Science II', '4', '3', null, null], //1
//     ['MTH252', 'Calculus II', '4', '3', null, null], //2
//     ['PH212', 'General Physics II', '4', '3', 'T3 (14-16h) B38', null], //3
//     ['CTH001', 'Fundamental principles of  Marxism and Leninism', '4', '3', null, 'Bắt đầu từ tuần 16/1'], //4
//     ['TC001', 'Physical Education', '4', '3', null, null], //5
//     ['WR227', 'Technical Writing', '4', '3', 'T7 (8h30-11h30)', 'HT2'], //6
//     ['STAT451', 'Applied Statistics for Engineers and Scientists I', '4', '3', null, null], //7
//     ['CS251', 'Logical Structures', '4', '3', null, null], //8
//     ['CTH003', "Ho Chi Minh's Ideology", '4', '3', null, null], //9
//     ['ECE341', 'Computer Hardware', '4', '3', null, 'Tuần 9/1 học chiều T2 thay vì T3'], //10
//     ['CS322', 'Languages and Compiler Design II', '4', '3', null, null], //11
//     ['CS333', 'Introduction to Operating Systems', '4', '3', null, null], //12
//     ['CS350', 'Introduction to Computer Science II', '4', '3', null, null], //13
//     ['CS411', 'Computer Graphics', '4', '3', null, 'Sau tết học lại từ tuần 20/2'], //14
//     ['CS419', 'Introduction to Information Retrieval', '4', '3', null, null], //15
//     ['CS422', 'Software analysis and design', '4', '3', null, 'HT2'], //16
//     ['CS407', 'Technology Innovation and Leadership', '4', '3', 'T6 (8h30-9h30) JVN', null], //17
//     ['CS423', 'Software Testing', '4', '3', null, 'HT2'], //18
//     ['CS488', 'Software Engineering Capstone II', '4', '3', null, null], //19

//     ['CTT008', 'Kỹ thuật lập trình', '4', '1', null, null], //20
//     ['CTT010', 'Nhập môn CNTT 2', '4', '1', null, 'HT2'], //21
//     ['TTH026', 'Giải tích B1', '4', '1', null, null], //22
//     ['KTH001', 'Kinh tế đại cương', '4', '1', null, null], //23
//     ['CTT103', 'Hệ điều hành', '4', '1', null, 'HT2'], //24
//     ['CTT105', 'Mạng máy tính', '4', '1', null, null], //25
//     ['TTH043', 'Xác suất thống kê', '4', '1', null, null], //26
//     ['CTH003', 'Tư tưởng Hồ Chí Minh', '4', '1', null, null], //27
//     ['CTH001', 'Những nguyên lý cơ bản của CN Mác-Lênin', '4', '1', null, 'Bắt đầu từ 16/1'], //28
//     ['JAP001', 'Tiếng Nhật', '4', '1', null, null], //29
//     ['CTT204', 'Phân tích thiết kế hệ thống thông tin', '4', '1', null, 'HT2'], //30
//     ['CTT504', 'Phân tích thiết kế phần mềm', '4', '1', null, 'HT2, Bắt đầu lúc 13h-16h30'], //31
//     ['CTT528', 'Phát triển ứng dụng web', '4', '1', null, 'HT2, Bắt đầu lúc 13h-16h30'], //32
//     ['CTT503', 'Kiểm chứng phần mềm', '4', '1', null, 'HT2'], //33
//     ['CTT125', 'Khởi nghiệp', '4', '1', null, null], //34
//     ['PLD001', 'Pháp luật đại cương', '4', '1', null, null], //35
// ];