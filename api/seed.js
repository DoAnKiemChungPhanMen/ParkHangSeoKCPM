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
    ['16VP', '16vp@student.hcmus.edu.vn', 2], //5
    ['15VP', '15vp@student.hcmus.edu.vn', 2], //6
    ['14VP', '14vp@student.hcmus.edu.vn', 2], //7
    ['13VP', '13vp@student.hcmus.edu.vn', 2], //8
    ['16CLC', '16clc@student.hcmus.edu.vn', 3], //9
    ['15CLC', '15clc@student.hcmus.edu.vn', 3], //10
    ['14CLC', '14clc@student.hcmus.edu.vn', 3], //11
    ['13CLC', '13clc@student.hcmus.edu.vn', 3], //12
    ['16TN', '16tn@student.hcmus.edu.vn', 4], //13
    ['15TN', '15tn@student.hcmus.edu.vn', 4], //14
    ['14TN', '14tn@student.hcmus.edu.vn', 4], //15
    ['13TN', '13tn@student.hcmus.edu.vn', 4], //16
    ['16TN', '16tt@student.hcmus.edu.vn', 5], //17
    ['15TT', '15tt@student.hcmus.edu.vn', 5], //18
    ['14TT', '14tt@student.hcmus.edu.vn', 5], //19
    ['13TT', '13tt@student.hcmus.edu.vn', 5], //20
];
//[code, name, semester_id, program_id, office_hour, note]
var insert_courses = [
    ['DEO251', 'Computational Biology and Chemistry', 4, 2, null, null],
    ['BXD572', 'Advances in Engineering Software', 4, 1, null, null],
    ['RPY307', 'Computers and Biomedical Research', 4, 1, null, null],
    ['VKLW825', 'Computer Languages', 4, 3, null, 'Sed ut perspiciatis'],
    ['BVX636', 'Computer Standards & Interfaces', 4, 3, null, null],
    ['DIPX607', 'Computer Aided Geometric Design', 4, 5, null, null],
    ['GUK125', 'Computational Geometry', 4, 5, null, null],
    ['HGV739', 'Computer Vision, Graphics, and Image Processing', 4, 2, null, null],
    ['CFG527', 'Computer Compacts', 4, 1, null, 'Sed ut perspiciatis'],
    ['SPI115', 'Applied Soft Computing', 4, 3, null, null],
    ['TDJXY828', 'Cognitive Systems Research', 4, 4, null, null],
    ['DTAPU640', 'Artificial Intelligence', 4, 2, null, null],
    ['TTYJ773', 'Computer Networks', 4, 4, null, null],
    ['YFO817', 'Biometric Technology Today', 4, 5, null, null],
    ['VFGP382', 'Artificial Intelligence in Medicine', 4, 5, null, 'Sed ut perspiciatis'],
    ['MWU251', 'Computer Networks (1976],', 4, 2, null, null],
    ['UPWF117', 'Computer Methods in Applied Mechanics and Engineering', 4, 3, null, null],
    ['NGU771', 'Advanced Engineering Informatics', 4, 5, null, 'Sed ut perspiciatis'],
    ['LJF488', 'Computer Programs in Biomedicine', 4, 5, null, 'Sed ut perspiciatis'],
    ['ISCGD902', 'Computer Speech & Language', 4, 1, null, null],
    ['SYSCA372', 'Computer Law & Security Report', 4, 2, null, null],
    ['CKOHH125', 'Computers & Chemistry', 4, 1, null, null],
    ['BBVTH758', 'Computer Methods and Programs in Biomedicine', 4, 1, null, null],
    ['KFLID866', 'Computational Statistics & Data Analysis', 4, 1, null, null],
    ['XWBV912', 'Computer Vision and Image Understanding', 4, 3, null, null],
    ['ILJX823', 'Computers and Standards', 4, 2, null, null],
    ['XYARK043', 'Artificial Intelligence in Engineering', 4, 2, null, null],
    ['POTYY911', 'Computer Physics Reports', 4, 4, null, null],
    ['OKU795', 'Computer Communications', 4, 3, null, 'Sed ut perspiciatis'],
    ['ZMX660', 'Computers & Urban Society', 4, 4, null, null],
    ['LBX450', 'Computers & Security', 4, 5, null, 'Sed ut perspiciatis'],
    ['MUQ436', 'Computers & Structures', 4, 4, null, 'Sed ut perspiciatis'],
    ['HTX111', 'Computer Languages, Systems & Structures', 4, 5, null, null],
    ['EKIEU541', 'Computerized Medical Imaging and Graphics', 4, 3, null, null],
    ['ITSYH813', 'Computer Networks and ISDN Systems', 4, 5, null, null],
    ['QHWQB333', 'Computer Fraud & Security', 4, 4, null, null],
    ['GKPT667', 'Ad Hoc Networks', 4, 2, null, null],
    ['PUM854', 'Computer Fraud & Security Bulletin', 4, 4, null, null],
    ['FOPI085', 'Computers in Biology and Medicine', 4, 2, null, null],
    ['OMWT331', 'Computers & Geosciences', 4, 1, null, null],
    ['TDO667', 'Computer Physics Communications', 4, 1, null, null],
    ['IVR855', 'AEU - International Journal of Electronics and Communications', 4, 4, null, null],
    ['XKNKO437', 'Computers and Geotechnics', 4, 5, null, 'Sed ut perspiciatis'],
    ['DJRQ310', 'Computer-Aided Design', 4, 4, null, null],
    ['RSR044', 'Cognitive Science', 4, 4, null, null],
    ['LFS755', 'Computers and Electronics in Agriculture', 4, 1, null, null],
    ['KUS664', 'Computer Graphics and Image Processing', 4, 3, null, null],
    ['BOC224', 'Card Technology Today', 4, 2, null, null],
    ['WMD836', 'Computers & Graphics', 4, 3, null, null],
    ['IXFM718', 'Computer Audit Update', 4, 3, null, null],
];

//[class_id,course_id,schedules]
var insert_class_has_course = [
    [1, 7, '10-I6-TH'],
    [1, 15, '19-E5-TH'],
    [1, 18, '3-B20-TH'],
    [1, 19, '16-I1-LT;13-B8-TH;14-B13-LT'],
    [1, 31, '4-F23-LT;2-F23-TH'],
    [1, 33, '12-F23-LT'],
    [1, 35, '1-F23-TH;19-C17-LT;3-E1-LT'],
    [1, 43, '9-C10-LT'],
    [2, 6, '3-B3-TH;1-B6-TH;5-E13-TH'],
    [2, 7, '1-F14-LT'],
    [2, 14, '7-B6-LT;3-E8-TH;2-E19-TH'],
    [2, 15, '12-B15-TH'],
    [2, 19, '7-I8-TH;9-B22-TH'],
    [2, 35, '6-B10-TH;7-I7-TH;19-I18-TH'],
    [2, 43, '6-E16-LT'],
    [3, 6, '21-C9-LT;3-B19-TH;14-E9-TH'],
    [3, 7, '2-C11-LT;16-B4-TH'],
    [3, 14, '0-B17-TH;21-E17-TH'],
    [3, 15, '19-F4-TH'],
    [3, 18, '12-F8-TH;17-C18-LT;20-B13-LT'],
    [3, 31, '1-B15-TH;19-B1-LT;7-F12-LT'],
    [3, 35, '0-F2-TH;16-F2-LT'],
    [3, 43, '12-B21-TH;16-I4-TH;0-I14-LT'],
    [4, 6, '17-I14-TH;10-F15-TH'],
    [4, 7, '19-B13-TH'],
    [4, 14, '19-I16-TH;19-C1-TH'],
    [4, 18, '8-E2-TH;1-B7-LT;21-F19-LT'],
    [4, 19, '3-E12-LT'],
    [4, 31, '17-B13-TH'],
    [4, 33, '11-I2-TH;3-B17-TH;19-E21-LT'],
    [4, 43, '17-B12-LT;16-C3-LT;0-I11-TH'],
    [5, 1, '9-E11-TH;13-F22-LT;9-C13-LT'],
    [5, 8, '10-E22-TH'],
    [5, 27, '5-I19-TH;1-F2-TH'],
    [5, 39, '15-B1-TH;15-C18-LT'],
    [6, 1, '2-I20-LT;1-I23-TH;14-I6-TH'],
    [6, 12, '12-E5-TH;21-B20-TH'],
    [6, 16, '21-I3-TH;9-B8-TH;16-F9-TH'],
    [6, 21, '9-E12-LT;17-E2-TH'],
    [6, 27, '16-E20-TH;1-I23-LT'],
    [6, 37, '5-I10-LT'],
    [6, 39, '16-C4-LT'],
    [6, 48, '12-B14-LT;19-B7-TH;14-F12-TH'],
    [7, 1, '15-E20-LT;9-B13-TH;16-C2-TH'],
    [7, 8, '0-F2-TH;6-I9-LT;7-I2-TH'],
    [7, 12, '19-F18-TH'],
    [7, 21, '4-I20-LT'],
    [7, 26, '2-C22-LT;3-E17-LT;10-I15-LT'],
    [7, 27, '11-E21-LT'],
    [7, 37, '11-C23-LT'],
    [7, 48, '8-C13-LT;7-B23-LT;2-B19-TH'],
    [8, 8, '14-I16-LT;1-F5-LT'],
    [8, 12, '11-I13-TH'],
    [8, 16, '10-B6-LT;2-E4-LT;2-C14-LT'],
    [8, 21, '1-F10-TH'],
    [8, 27, '8-B6-TH;8-C2-TH;9-B12-TH'],
    [8, 37, '0-I10-LT;2-E15-TH;11-F17-LT'],
    [8, 39, '6-F16-TH;18-I3-TH'],
    [9, 2, '10-B18-TH;2-I5-LT'],
    [9, 3, '3-F6-TH;14-F8-LT'],
    [9, 9, '1-F20-LT'],
    [9, 20, '21-B2-TH'],
    [9, 22, '5-E10-TH;8-E11-LT;4-F13-LT'],
    [9, 23, '13-B12-TH;2-C8-LT;11-F23-LT'],
    [9, 40, '9-E21-LT'],
    [9, 41, '17-I10-TH;4-B22-LT'],
    [9, 46, '0-B16-TH;9-E8-LT;11-E11-TH'],
    [10, 2, '5-E16-TH'],
    [10, 9, '7-I20-LT;12-B19-LT'],
    [10, 23, '20-I8-LT;1-F9-LT'],
    [10, 24, '9-C11-TH;3-I22-TH;8-C7-TH'],
    [10, 41, '10-F9-TH'],
    [10, 46, '7-B13-LT'],
    [11, 2, '14-I20-LT;17-B23-TH;20-C4-TH'],
    [11, 3, '9-I16-LT;15-I5-LT'],
    [11, 9, '8-I15-LT;10-F5-LT;9-I15-TH'],
    [11, 20, '21-C12-TH;8-F23-LT;8-I20-LT'],
    [11, 22, '3-B18-LT'],
    [11, 23, '18-E7-LT;5-B18-TH;14-E1-LT'],
    [11, 24, '19-I15-LT;3-E9-LT'],
    [11, 40, '19-F13-TH;11-C13-LT'],
    [11, 41, '15-C7-TH;17-B22-TH;15-I18-TH'],
    [12, 2, '11-F13-LT'],
    [12, 3, '4-F22-LT;15-B16-TH;14-B11-TH'],
    [12, 9, '20-E9-TH;1-F4-TH;5-I2-TH'],
    [12, 20, '11-I8-TH;1-B3-LT;11-C6-TH'],
    [12, 23, '13-C21-LT;2-B5-LT'],
    [12, 40, '11-I10-LT'],
    [12, 41, '18-F6-LT'],
    [13, 11, '10-I18-TH;0-I15-TH'],
    [13, 30, '20-F14-TH;14-C5-LT;19-E7-LT'],
    [13, 32, '4-B5-TH'],
    [13, 36, '8-F17-LT;10-F17-LT;13-I3-LT'],
    [13, 42, '12-E4-LT;14-F18-TH;2-F20-TH'],
    [13, 45, '14-C15-LT'],
    [14, 11, '10-B22-TH;18-B2-LT'],
    [14, 13, '20-E5-LT'],
    [14, 28, '10-E1-LT;9-B15-TH'],
    [14, 32, '16-I18-TH;12-F2-LT;5-C11-LT'],
    [14, 36, '0-E19-LT;15-B14-LT;3-I3-LT'],
    [14, 38, '19-C1-LT'],
    [14, 42, '13-I10-LT;12-F23-LT;2-C21-TH'],
    [14, 44, '5-E1-LT;10-C15-LT;20-F12-TH'],
    [14, 45, '5-I10-TH;0-B7-LT;0-I15-TH'],
    [15, 11, '1-C7-LT;21-F5-TH;3-F3-TH'],
    [15, 13, '4-B19-TH'],
    [15, 28, '6-F8-TH;18-B7-LT;8-B15-TH'],
    [15, 30, '21-B8-LT;18-B13-TH;19-F11-TH'],
    [15, 32, '21-B20-TH'],
    [15, 36, '8-C5-TH;6-F8-TH;1-F2-LT'],
    [15, 38, '8-E3-LT'],
    [15, 42, '10-C5-TH'],
    [15, 44, '4-I10-LT;4-I1-TH;18-I2-LT'],
    [16, 11, '12-C17-LT'],
    [16, 13, '12-I5-LT;10-B11-LT'],
    [16, 28, '4-I16-TH;15-F19-TH;12-I5-LT'],
    [16, 32, '2-B23-TH;0-F1-TH;18-I22-TH'],
    [16, 36, '3-B15-LT;19-B8-LT;12-F21-LT'],
    [16, 38, '2-I6-LT;21-C4-LT;2-I7-LT'],
    [16, 42, '20-B20-TH;9-E5-LT;3-C8-TH'],
    [16, 44, '0-I23-LT;6-C10-LT;13-E11-LT'],
    [17, 4, '3-E8-TH;19-E23-LT;17-F6-LT'],
    [17, 10, '2-F20-TH'],
    [17, 25, '10-F23-TH'],
    [17, 34, '7-F13-LT'],
    [17, 47, '11-C7-LT;17-C8-LT'],
    [17, 49, '4-B9-LT'],
    [17, 50, '0-B12-LT;18-B22-LT'],
    [18, 4, '11-E3-TH;8-B4-TH;2-F5-LT'],
    [18, 17, '9-F10-LT;18-B21-LT;15-I14-TH'],
    [18, 25, '16-B11-LT;19-B16-TH;0-E12-TH'],
    [18, 29, '10-C6-LT;7-I5-LT;8-F13-TH'],
    [18, 34, '16-C10-TH;12-F10-LT;0-C14-TH'],
    [18, 47, '9-B15-LT;5-E14-TH;3-B13-TH'],
    [18, 49, '15-B13-LT;18-E17-LT;8-E16-TH'],
    [18, 50, '18-I3-TH;14-E15-LT;1-I6-TH'],
    [19, 10, '8-I15-TH'],
    [19, 17, '14-F3-TH'],
    [19, 25, '0-F19-LT;18-I12-LT;6-E12-LT'],
    [19, 29, '16-B19-LT;7-I23-TH;16-F1-TH'],
    [19, 34, '13-E9-LT;10-F17-TH'],
    [19, 49, '15-E23-LT;17-I4-LT'],
    [19, 50, '6-I5-TH'],
    [20, 5, '11-F10-TH'],
    [20, 10, '8-E15-TH;2-B3-LT;0-E15-TH'],
    [20, 17, '5-I15-LT;9-F23-LT;6-E19-TH'],
    [20, 47, '0-E14-TH;12-F23-TH;13-I4-LT'],
    [20, 50, '10-C19-TH'],
];


//[first_name,last_name,email,phone,password,role_id]
//[first_name,last_name,email,phone,password,role_id]
var insert_users = [
    ['Đinh Bá', 'Tiến', 'dbtien@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Hữu', 'Anh', 'nhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Hữu', 'Nhã', 'nhnha@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Ngọc', 'Thu', 'nnthu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Văn', 'Hùng', 'nvhung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Minh', 'Triết', 'tmtriet@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Phạm Hoàng', 'Uyên', 'phuyen@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Phúc', 'Sơn', 'npson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Ngô Tuấn', 'Phương', 'ntphuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Tuấn', 'Nam', 'ntnam@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thanh', 'Phương', 'ntphuong1@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Trung', 'Dũng', 'ttdung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Thái', 'Sơn', 'ttson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Ngô Đức', 'Thành', 'ndthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Dương Nguyên', 'Vũ', 'dnvu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lâm Quang', 'Vũ', 'lqvu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Hồ Tuấn', 'Thanh', 'htthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Hữu Trí', 'Nhật', 'nhtnhat@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Duy Hoàng', 'Minh', 'ndhminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lương Vĩ', 'Minh', 'lvminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Vinh', 'Tiệp', 'nvtiep@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Phạm Việt', 'Khôi', 'pvkhoi@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Văn', 'Thìn', 'nvthin@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thị Thanh', 'Huyền', 'ntthuyen@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Vũ Quốc', 'Hoàng', 'vqhoang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Quốc', 'Hòa', 'lqhoa@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Chung Thùy', 'Linh', 'ctlinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Yên', 'Thanh', 'lythanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Võ Hoài', 'Việt', 'vhviet@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Phạm Thanh', 'Tùng', 'pttung@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Đức', 'Huy', 'ndhuy@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Khắc', 'Huy', 'nkhuy@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Ngọc Đạt', 'Thành', 'tndthanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Minh', 'Quốc', 'lmquoc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Phạm Đức', 'Thịnh', 'pdthinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Bùi Quốc', 'Minh', 'bqminh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Võ Duy', 'Anh', 'vdanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Thị Bích', 'Hạnh', 'ttbhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Tuấn Nguyên Đức', 'Hoài', 'tndhoai@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Hoàng', 'Khanh', 'thkhanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Thị', 'Nhàn', 'ltnhan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thị Thu', 'Vân', 'nttvan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thanh', 'Trọng', 'nttrong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Phạm Tuấn', 'Sơn', 'ptson@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Đỗ Hoàng', 'Cường', 'dhcuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Quản Thị Nguyệt', 'Thơ', 'qtntho@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Trần Minh', 'Thư', 'ntmthu@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Đặng Bình', 'Phương', 'dbphuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Cao Thị Thùy', 'Liên', 'cttlien@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Trần Xuân Thiên', 'An', 'txtan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Ngô Chánh', 'Đức', 'ncduc@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Văn', 'Chánh', 'lvchanh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Huỳnh Ngọc', 'Chương', 'hnchuong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thanh Quản', 'Quản', 'ntquan@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Viết', 'Long', 'lvlong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Nguyễn Thành', 'Long', 'ntlong@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Lê Nguyễn Hoài', 'Nam', 'lnhnam@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
    ['Bùi Đắc', 'Thịnh', 'bdthinh@fit.hcmus.edu.vn', '090xxxx', bcrypt.hashSync('1512517', 10), 2],
];
var insert_user1=[
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
var insert_user2=[
    ['Rivera', 'Jerome', '1611263@student.hcmus.edu.vn', '0800-164-112', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Johnnie', '1514534@student.hcmus.edu.vn', '0800-686-422', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Maya', '1614587@student.hcmus.edu.vn', '1-866-717-83', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Keira', '1511238@student.hcmus.edu.vn', '1-877-739-45', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Violet', '1315754@student.hcmus.edu.vn', '0800-216-373', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Ray', '1312143@student.hcmus.edu.vn', '1-844-546-09', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Christopher', '1514614@student.hcmus.edu.vn', '0800-234-149', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Jesse', '1415988@student.hcmus.edu.vn', '0800-877-816', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Kaitlyn', '1413411@student.hcmus.edu.vn', '1-844-334-19', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Jesse', '1512490@student.hcmus.edu.vn', '0800-878-875', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Leon', '1313224@student.hcmus.edu.vn', '0800-752-214', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Cory', '1312822@student.hcmus.edu.vn', '1-888-597-22', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Perry', '1613452@student.hcmus.edu.vn', '0800-635-966', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Mark', '1514197@student.hcmus.edu.vn', '1-855-618-66', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Ramon', '1315822@student.hcmus.edu.vn', '0800-824-613', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Jeffery', '1611726@student.hcmus.edu.vn', '0800-724-561', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Kaitlyn', '1515861@student.hcmus.edu.vn', '0800-447-526', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Mark', '1513615@student.hcmus.edu.vn', '0800-312-241', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Phillip', '1512243@student.hcmus.edu.vn', '0800-618-493', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Sarah', '1615654@student.hcmus.edu.vn', '1-866-341-66', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Juan', '1412615@student.hcmus.edu.vn', '1-855-118-78', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Isabelle', '1312975@student.hcmus.edu.vn', '1-800-312-24', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Franklin', '1411587@student.hcmus.edu.vn', '0800-909-465', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Wade', '1612750@student.hcmus.edu.vn', '0800-175-413', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Ernest', '1411243@student.hcmus.edu.vn', '1-800-074-34', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Makayla', '1311086@student.hcmus.edu.vn', '0800-478-565', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Emily', '1512822@student.hcmus.edu.vn', '1-877-748-86', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Darryl', '1312853@student.hcmus.edu.vn', '0800-485-144', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Gordon', '1615646@student.hcmus.edu.vn', '1-855-768-51', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Kevin', '1512853@student.hcmus.edu.vn', '1-888-485-85', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Julian', '1314143@student.hcmus.edu.vn', '1-855-850-34', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Ronnie', '1611535@student.hcmus.edu.vn', '0800-425-377', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Marc', '1513886@student.hcmus.edu.vn', '1-800-281-55', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Julian', '1413587@student.hcmus.edu.vn', '0800-672-398', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Victoria', '1315411@student.hcmus.edu.vn', '0800-422-928', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Gabriel', '1313450@student.hcmus.edu.vn', '0800-564-116', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Donald', '1612754@student.hcmus.edu.vn', '1-888-606-68', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Peter', '1415035@student.hcmus.edu.vn', '0800-718-093', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Marion', '1611435@student.hcmus.edu.vn', '1-844-051-66', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Hannah', '1512847@student.hcmus.edu.vn', '1-844-558-58', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Gilbert', '1414402@student.hcmus.edu.vn', '0800-305-621', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Matthew', '1312756@student.hcmus.edu.vn', '1-855-716-53', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Lawrence', '1611026@student.hcmus.edu.vn', '1-855-646-36', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Alexander', '1312281@student.hcmus.edu.vn', '0800-536-543', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Lillian', '1513157@student.hcmus.edu.vn', '1-866-623-01', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Sarah', '1614774@student.hcmus.edu.vn', '0800-818-456', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Leon', '1413822@student.hcmus.edu.vn', '1-877-442-51', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Arthur', '1612108@student.hcmus.edu.vn', '1-800-007-73', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Lance', '1413727@student.hcmus.edu.vn', '0800-255-432', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Ken', '1415839@student.hcmus.edu.vn', '1-855-957-91', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Terry', '1511118@student.hcmus.edu.vn', '1-844-823-87', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Darryl', '1613273@student.hcmus.edu.vn', '0800-825-644', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Wade', '1513402@student.hcmus.edu.vn', '0800-344-649', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Charlie', '1312820@student.hcmus.edu.vn', '1-888-444-58', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Leon', '1314535@student.hcmus.edu.vn', '1-844-187-83', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Andy', '1312615@student.hcmus.edu.vn', '1-877-976-43', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Stanley', '1314778@student.hcmus.edu.vn', '0800-824-895', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Darrell', '1414253@student.hcmus.edu.vn', '0800-935-696', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Marvin', '1415086@student.hcmus.edu.vn', '0800-463-776', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Raul', '1612452@student.hcmus.edu.vn', '1-866-648-36', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Curtis', '1513727@student.hcmus.edu.vn', '1-888-341-42', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Juan', '1513534@student.hcmus.edu.vn', '1-877-451-96', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Isabelle', '1615116@student.hcmus.edu.vn', '1-877-236-77', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Roberto', '1615147@student.hcmus.edu.vn', '0800-180-347', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Dustin', '1415238@student.hcmus.edu.vn', '0800-881-616', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Clara', '1414750@student.hcmus.edu.vn', '0800-188-834', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Jerry', '1412441@student.hcmus.edu.vn', '0800-142-656', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Everett', '1513411@student.hcmus.edu.vn', '1-866-574-54', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Mitchell', '1413468@student.hcmus.edu.vn', '1-855-158-31', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Ramon', '1612820@student.hcmus.edu.vn', '1-866-762-77', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Hannah', '1413147@student.hcmus.edu.vn', '0800-777-118', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Ronnie', '1312435@student.hcmus.edu.vn', '1-877-881-54', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Arthur', '1414158@student.hcmus.edu.vn', '0800-257-725', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Makayla', '1612441@student.hcmus.edu.vn', '1-866-277-23', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Larry', '1514668@student.hcmus.edu.vn', '0800-914-794', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Adalyn', '1315485@student.hcmus.edu.vn', '0800-280-615', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jacob', '1614726@student.hcmus.edu.vn', '1-877-732-33', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Armando', '1313157@student.hcmus.edu.vn', '0800-729-472', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Terry', '1615086@student.hcmus.edu.vn', '0800-574-458', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Antonio', '1314806@student.hcmus.edu.vn', '1-855-881-23', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Scarlett', '1414565@student.hcmus.edu.vn', '0800-812-937', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Kaitlyn', '1314717@student.hcmus.edu.vn', '0800-726-344', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Violet', '1315886@student.hcmus.edu.vn', '0800-106-163', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Clinton', '1612682@student.hcmus.edu.vn', '1-866-449-13', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Barry', '1514108@student.hcmus.edu.vn', '1-844-615-24', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Sarah', '1513587@student.hcmus.edu.vn', '0800-974-495', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Avery', '1514847@student.hcmus.edu.vn', '1-844-466-77', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Roland', '1414852@student.hcmus.edu.vn', '1-844-568-16', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Charlie', '1315108@student.hcmus.edu.vn', '0800-857-655', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Larry', '1614435@student.hcmus.edu.vn', '1-855-312-74', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Wayne', '1611143@student.hcmus.edu.vn', '1-866-921-32', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Michael', '1415161@student.hcmus.edu.vn', '1-866-364-61', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Gene', '1614367@student.hcmus.edu.vn', '1-866-923-75', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Leo', '1415281@student.hcmus.edu.vn', '1-866-647-41', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Hannah', '1314879@student.hcmus.edu.vn', '1-866-311-50', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Claire', '1615722@student.hcmus.edu.vn', '1-855-822-75', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Nicholas', '1411224@student.hcmus.edu.vn', '1-844-645-15', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Manuel', '1514811@student.hcmus.edu.vn', '1-877-287-67', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Ellie', '1511617@student.hcmus.edu.vn', '0800-766-888', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Leo', '1515756@student.hcmus.edu.vn', '1-800-355-75', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Wayne', '1312668@student.hcmus.edu.vn', '0800-758-166', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Grace', '1515238@student.hcmus.edu.vn', '0800-589-442', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Ken', '1311253@student.hcmus.edu.vn', '1-877-276-84', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Jaime', '1411587@student.hcmus.edu.vn', '1-800-572-76', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Edward', '1613651@student.hcmus.edu.vn', '1-844-500-72', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Sarah', '1413294@student.hcmus.edu.vn', '1-800-125-97', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Ruben', '1311732@student.hcmus.edu.vn', '0800-769-694', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Roberto', '1412636@student.hcmus.edu.vn', '1-855-305-65', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Dan', '1411108@student.hcmus.edu.vn', '1-855-558-39', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Roland', '1412751@student.hcmus.edu.vn', '1-855-880-67', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Ben', '1414847@student.hcmus.edu.vn', '0800-555-603', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Gordon', '1315843@student.hcmus.edu.vn', '0800-966-517', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Hailey', '1612556@student.hcmus.edu.vn', '0800-231-267', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Darryl', '1412646@student.hcmus.edu.vn', '0800-905-809', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Christopher', '1411654@student.hcmus.edu.vn', '0800-421-332', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Aaliyah', '1313229@student.hcmus.edu.vn', '1-866-077-61', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Ronnie', '1613756@student.hcmus.edu.vn', '0800-468-816', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Nelson', '1311143@student.hcmus.edu.vn', '1-877-728-86', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Henry', '1312587@student.hcmus.edu.vn', '1-866-886-55', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Kevin', '1614157@student.hcmus.edu.vn', '1-855-825-71', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Terry', '1615861@student.hcmus.edu.vn', '1-844-343-45', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Rodney', '1514441@student.hcmus.edu.vn', '1-855-194-63', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Nelson', '1612975@student.hcmus.edu.vn', '1-855-114-56', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Lance', '1512109@student.hcmus.edu.vn', '0800-163-394', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Hannah', '1411750@student.hcmus.edu.vn', '0800-735-308', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Sam', '1613853@student.hcmus.edu.vn', '1-877-137-14', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Jesus', '1411026@student.hcmus.edu.vn', '0800-044-527', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Terrence', '1315847@student.hcmus.edu.vn', '0800-262-105', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Michael', '1412774@student.hcmus.edu.vn', '0800-859-640', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Dustin', '1615490@student.hcmus.edu.vn', '0800-665-080', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Eric', '1615852@student.hcmus.edu.vn', '0800-734-244', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Julian', '1612490@student.hcmus.edu.vn', '1-844-606-99', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Kenneth', '1512615@student.hcmus.edu.vn', '0800-659-175', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Ken', '1512238@student.hcmus.edu.vn', '0800-206-151', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Eric', '1611143@student.hcmus.edu.vn', '0800-102-845', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Raul', '1414143@student.hcmus.edu.vn', '1-855-354-11', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Casey', '1515774@student.hcmus.edu.vn', '1-866-448-60', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Christopher', '1613806@student.hcmus.edu.vn', '0800-515-673', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Alexander', '1411756@student.hcmus.edu.vn', '1-877-943-98', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Charlotte', '1612614@student.hcmus.edu.vn', '0800-064-971', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Roberto', '1314263@student.hcmus.edu.vn', '1-844-583-89', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Gene', '1511289@student.hcmus.edu.vn', '0800-876-278', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Rodney', '1413717@student.hcmus.edu.vn', '0800-631-257', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Phillip', '1614229@student.hcmus.edu.vn', '1-844-022-27', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Emily', '1412879@student.hcmus.edu.vn', '1-855-068-89', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Darryl', '1514118@student.hcmus.edu.vn', '1-844-280-77', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Leon', '1414035@student.hcmus.edu.vn', '0800-066-146', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Mario', '1611587@student.hcmus.edu.vn', '1-800-151-36', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Julia', '1313565@student.hcmus.edu.vn', '0800-427-281', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Joel', '1311853@student.hcmus.edu.vn', '0800-553-226', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Bob', '1514756@student.hcmus.edu.vn', '0800-942-257', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Brooklyn', '1614722@student.hcmus.edu.vn', '1-855-878-73', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Jesse', '1514161@student.hcmus.edu.vn', '0800-488-899', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Emily', '1513565@student.hcmus.edu.vn', '1-877-776-73', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Roland', '1312851@student.hcmus.edu.vn', '0800-788-323', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Alex', '1411601@student.hcmus.edu.vn', '1-866-445-01', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Todd', '1513238@student.hcmus.edu.vn', '1-888-154-81', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Kevin', '1412756@student.hcmus.edu.vn', '0800-538-818', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Hailey', '1611851@student.hcmus.edu.vn', '0800-815-672', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Gianna', '1315839@student.hcmus.edu.vn', '0800-934-767', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Allison', '1614289@student.hcmus.edu.vn', '1-888-911-58', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Clifton', '1511822@student.hcmus.edu.vn', '1-844-473-95', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Bobby', '1513556@student.hcmus.edu.vn', '0800-352-127', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Erik', '1412975@student.hcmus.edu.vn', '1-866-639-21', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Ben', '1312636@student.hcmus.edu.vn', '0800-771-571', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Brooklyn', '1313318@student.hcmus.edu.vn', '1-844-265-38', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Rodney', '1611750@student.hcmus.edu.vn', '0800-214-833', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Nicholas', '1615026@student.hcmus.edu.vn', '1-855-102-84', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Angel', '1314726@student.hcmus.edu.vn', '0800-030-242', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Arthur', '1314140@student.hcmus.edu.vn', '1-888-718-22', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Savannah', '1614668@student.hcmus.edu.vn', '1-855-232-76', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Franklin', '1614468@student.hcmus.edu.vn', '1-877-669-64', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Ryan', '1312614@student.hcmus.edu.vn', '0800-628-706', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Max', '1614485@student.hcmus.edu.vn', '1-855-754-53', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Cory', '1312157@student.hcmus.edu.vn', '1-877-620-86', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Aaron', '1612822@student.hcmus.edu.vn', '1-800-115-12', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Joel', '1415158@student.hcmus.edu.vn', '0800-326-351', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Vivian', '1315587@student.hcmus.edu.vn', '0800-066-317', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Christopher', '1512441@student.hcmus.edu.vn', '1-800-749-57', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Aria', '1514820@student.hcmus.edu.vn', '0800-523-155', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Salvador', '1613617@student.hcmus.edu.vn', '0800-697-752', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Olivia', '1413263@student.hcmus.edu.vn', '1-866-591-22', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Arianna', '1315263@student.hcmus.edu.vn', '1-866-605-40', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Violet', '1315615@student.hcmus.edu.vn', '0800-652-563', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Zoe', '1413646@student.hcmus.edu.vn', '1-855-254-29', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Arianna', '1411086@student.hcmus.edu.vn', '0800-701-955', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Ryan', '1413535@student.hcmus.edu.vn', '1-844-160-62', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Robert', '1415140@student.hcmus.edu.vn', '1-888-033-81', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Hannah', '1612727@student.hcmus.edu.vn', '0800-116-832', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Michael', '1312886@student.hcmus.edu.vn', '1-844-129-64', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Dwayne', '1615109@student.hcmus.edu.vn', '1-866-429-14', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Mario', '1313294@student.hcmus.edu.vn', '0800-154-015', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Hailey', '1411630@student.hcmus.edu.vn', '1-877-048-83', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Keira', '1413534@student.hcmus.edu.vn', '1-844-460-20', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Roland', '1412822@student.hcmus.edu.vn', '1-855-647-52', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Jesus', '1514267@student.hcmus.edu.vn', '1-855-821-23', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Ava', '1611467@student.hcmus.edu.vn', '0800-186-898', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Brooklyn', '1515452@student.hcmus.edu.vn', '1-866-772-50', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Violet', '1513717@student.hcmus.edu.vn', '0800-564-810', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Jesse', '1613402@student.hcmus.edu.vn', '0800-783-684', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Aria', '1311281@student.hcmus.edu.vn', '1-844-882-42', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Casey', '1512446@student.hcmus.edu.vn', '0800-361-128', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Marvin', '1314853@student.hcmus.edu.vn', '0800-607-681', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Mark', '1414756@student.hcmus.edu.vn', '0800-784-840', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Charlotte', '1413751@student.hcmus.edu.vn', '1-877-896-12', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Charlie', '1415741@student.hcmus.edu.vn', '0800-831-808', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Curtis', '1413556@student.hcmus.edu.vn', '1-844-367-73', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Darryl', '1512035@student.hcmus.edu.vn', '1-877-786-04', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Jesse', '1614485@student.hcmus.edu.vn', '1-844-340-31', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Eric', '1412847@student.hcmus.edu.vn', '1-855-745-73', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Charlie', '1311485@student.hcmus.edu.vn', '0800-727-557', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Wade', '1315035@student.hcmus.edu.vn', '0800-348-138', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Allan', '1414446@student.hcmus.edu.vn', '1-877-885-11', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Sydney', '1514751@student.hcmus.edu.vn', '0800-691-037', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Perry', '1415851@student.hcmus.edu.vn', '0800-219-634', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Jason', '1311147@student.hcmus.edu.vn', '0800-612-783', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Lauren', '1615378@student.hcmus.edu.vn', '1-800-142-83', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Sam', '1311886@student.hcmus.edu.vn', '1-844-561-60', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Henry', '1611751@student.hcmus.edu.vn', '1-866-805-22', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Michael', '1513855@student.hcmus.edu.vn', '0800-973-771', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Ken', '1513467@student.hcmus.edu.vn', '1-877-332-31', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Makayla', '1611732@student.hcmus.edu.vn', '1-877-515-81', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Avery', '1612116@student.hcmus.edu.vn', '1-855-177-97', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Lillian', '1411646@student.hcmus.edu.vn', '0800-252-032', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Philip', '1515343@student.hcmus.edu.vn', '0800-717-370', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Mitchell', '1611988@student.hcmus.edu.vn', '1-800-381-83', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Terrance', '1511318@student.hcmus.edu.vn', '0800-550-623', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Darrell', '1514852@student.hcmus.edu.vn', '1-866-437-77', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Darrell', '1513450@student.hcmus.edu.vn', '1-888-379-62', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Mackenzie', '1612617@student.hcmus.edu.vn', '1-877-229-34', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Alex', '1311722@student.hcmus.edu.vn', '0800-980-623', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Manuel', '1611886@student.hcmus.edu.vn', '1-844-481-16', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Joseph', '1611888@student.hcmus.edu.vn', '1-844-712-25', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Christopher', '1615468@student.hcmus.edu.vn', '0800-478-631', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Raul', '1412630@student.hcmus.edu.vn', '0800-456-012', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Hailey', '1613238@student.hcmus.edu.vn', '1-877-693-82', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Christopher', '1315811@student.hcmus.edu.vn', '0800-484-078', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Kaitlyn', '1615750@student.hcmus.edu.vn', '0800-113-533', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Armando', '1415109@student.hcmus.edu.vn', '0800-324-790', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Charlotte', '1615289@student.hcmus.edu.vn', '0800-553-426', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Mark', '1413140@student.hcmus.edu.vn', '1-844-290-74', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Brett', '1414338@student.hcmus.edu.vn', '0800-755-600', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Jacob', '1412485@student.hcmus.edu.vn', '1-888-767-77', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Gene', '1513243@student.hcmus.edu.vn', '0800-665-181', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Natalie', '1412490@student.hcmus.edu.vn', '0800-164-767', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Jesse', '1415042@student.hcmus.edu.vn', '0800-384-834', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Dan', '1513367@student.hcmus.edu.vn', '0800-470-594', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Edward', '1613722@student.hcmus.edu.vn', '1-844-589-90', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Marc', '1411727@student.hcmus.edu.vn', '0800-271-369', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Donald', '1512975@student.hcmus.edu.vn', '0800-287-726', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Charlie', '1314161@student.hcmus.edu.vn', '1-855-468-92', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Max', '1613847@student.hcmus.edu.vn', '0800-575-178', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Sam', '1512402@student.hcmus.edu.vn', '0800-227-273', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Phillip', '1513646@student.hcmus.edu.vn', '0800-862-716', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Lance', '1614565@student.hcmus.edu.vn', '1-844-408-56', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Jose', '1414741@student.hcmus.edu.vn', '1-866-426-13', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Ian', '1614646@student.hcmus.edu.vn', '1-844-618-62', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Jorge', '1515267@student.hcmus.edu.vn', '0800-884-554', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Lillian', '1512727@student.hcmus.edu.vn', '0800-236-993', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Leo', '1513263@student.hcmus.edu.vn', '1-888-362-18', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Charlie', '1513617@student.hcmus.edu.vn', '1-800-254-71', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Lawrence', '1511108@student.hcmus.edu.vn', '1-866-183-39', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Dwayne', '1614118@student.hcmus.edu.vn', '1-866-382-67', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Leo', '1511601@student.hcmus.edu.vn', '0800-944-613', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Benjamin', '1514243@student.hcmus.edu.vn', '0800-606-138', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Olivia', '1512636@student.hcmus.edu.vn', '0800-652-823', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Clara', '1311143@student.hcmus.edu.vn', '1-866-474-78', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Javier', '1612035@student.hcmus.edu.vn', '0800-120-280', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Everett', '1314858@student.hcmus.edu.vn', '0800-273-196', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Victor', '1314727@student.hcmus.edu.vn', '0800-745-815', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Andy', '1411614@student.hcmus.edu.vn', '0800-412-721', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Christopher', '1512485@student.hcmus.edu.vn', '0800-444-517', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Natalie', '1614651@student.hcmus.edu.vn', '0800-837-563', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Jaime', '1311267@student.hcmus.edu.vn', '1-877-344-14', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Sydney', '1314253@student.hcmus.edu.vn', '0800-814-221', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Hannah', '1515587@student.hcmus.edu.vn', '1-844-252-89', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Julian', '1413238@student.hcmus.edu.vn', '0800-381-413', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Dustin', '1613367@student.hcmus.edu.vn', '0800-878-172', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Allan', '1515197@student.hcmus.edu.vn', '0800-555-775', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Gabriel', '1312646@student.hcmus.edu.vn', '0800-179-561', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Sydney', '1414726@student.hcmus.edu.vn', '1-800-586-63', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Robert', '1612229@student.hcmus.edu.vn', '0800-443-517', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Scarlett', '1315221@student.hcmus.edu.vn', '0800-927-617', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Antonio', '1513318@student.hcmus.edu.vn', '0800-233-228', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Marvin', '1312143@student.hcmus.edu.vn', '0800-486-104', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Mitchell', '1414955@student.hcmus.edu.vn', '1-866-338-27', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Ramon', '1313143@student.hcmus.edu.vn', '0800-299-669', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Francisco', '1613441@student.hcmus.edu.vn', '0800-365-070', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Everett', '1313615@student.hcmus.edu.vn', '0800-381-186', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Donald', '1311441@student.hcmus.edu.vn', '1-855-184-51', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Ben', '1315490@student.hcmus.edu.vn', '1-800-281-26', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Claire', '1513726@student.hcmus.edu.vn', '1-877-052-63', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Edward', '1311617@student.hcmus.edu.vn', '1-888-203-85', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Curtis', '1414822@student.hcmus.edu.vn', '1-855-980-31', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Darryl', '1411467@student.hcmus.edu.vn', '0800-315-827', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Bruce', '1413446@student.hcmus.edu.vn', '1-855-940-86', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Phillip', '1611294@student.hcmus.edu.vn', '1-844-282-71', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Javier', '1312727@student.hcmus.edu.vn', '0800-649-824', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Jaime', '1514822@student.hcmus.edu.vn', '0800-561-442', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Joseph', '1613026@student.hcmus.edu.vn', '0800-814-767', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Phillip', '1312754@student.hcmus.edu.vn', '0800-646-823', bcrypt.hashSync('1512517', 10), 1],
];



// var insert_user3=[
//     ['Stewart', 'Casey', '1415263@student.hcmus.edu.vn', '0800-488-248', bcrypt.hashSync('1512517', 10), 1],
//     ['Evans', 'Travis', '1615774@student.hcmus.edu.vn', '0800-293-949', bcrypt.hashSync('1512517', 10), 1],
//     ['King', 'Gianna', '1411726@student.hcmus.edu.vn', '0800-555-324', bcrypt.hashSync('1512517', 10), 1],
//     ['Walker', 'Ruben', '1411197@student.hcmus.edu.vn', '1-844-047-58', bcrypt.hashSync('1512517', 10), 1],
//     ['Lewis', 'Alex', '1514843@student.hcmus.edu.vn', '0800-664-433', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Barry', '1411719@student.hcmus.edu.vn', '1-844-111-03', bcrypt.hashSync('1512517', 10), 1],
//     ['Brooks', 'Violet', '1413224@student.hcmus.edu.vn', '0800-565-201', bcrypt.hashSync('1512517', 10), 1],
//     ['Richardson', 'Ava', '1313118@student.hcmus.edu.vn', '1-877-942-43', bcrypt.hashSync('1512517', 10), 1],
//     ['Gomez', 'Nicholas', '1311806@student.hcmus.edu.vn', '1-866-061-59', bcrypt.hashSync('1512517', 10), 1],
//     ['Clark', 'Jacob', '1415847@student.hcmus.edu.vn', '0800-925-774', bcrypt.hashSync('1512517', 10), 1],
//     ['Wood', 'Manuel', '1511367@student.hcmus.edu.vn', '1-877-851-66', bcrypt.hashSync('1512517', 10), 1],
//     ['Scott', 'Victoria', '1514112@student.hcmus.edu.vn', '1-844-123-88', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Eric', '1612273@student.hcmus.edu.vn', '1-855-751-54', bcrypt.hashSync('1512517', 10), 1],
//     ['Martin', 'Keith', '1614741@student.hcmus.edu.vn', '0800-081-369', bcrypt.hashSync('1512517', 10), 1],
//     ['Scott', 'Ramon', '1313719@student.hcmus.edu.vn', '1-877-647-55', bcrypt.hashSync('1512517', 10), 1],
//     ['Adams', 'Violet', '1613197@student.hcmus.edu.vn', '0800-456-849', bcrypt.hashSync('1512517', 10), 1],
//     ['White', 'Scarlett', '1515467@student.hcmus.edu.vn', '1-855-214-31', bcrypt.hashSync('1512517', 10), 1],
//     ['Moore', 'Zoe', '1613161@student.hcmus.edu.vn', '0800-860-375', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Camilla', '1413855@student.hcmus.edu.vn', '1-844-444-68', bcrypt.hashSync('1512517', 10), 1],
//     ['Cox', 'Johnnie', '1611147@student.hcmus.edu.vn', '0800-311-315', bcrypt.hashSync('1512517', 10), 1],
//     ['Reed', 'Paisley', '1414587@student.hcmus.edu.vn', '1-866-822-26', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Aaliyah', '1311108@student.hcmus.edu.vn', '1-866-227-14', bcrypt.hashSync('1512517', 10), 1],
//     ['Long', 'Darrell', '1514253@student.hcmus.edu.vn', '1-877-337-11', bcrypt.hashSync('1512517', 10), 1],
//     ['Morales', 'Philip', '1314820@student.hcmus.edu.vn', '0800-112-513', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Fernando', '1612778@student.hcmus.edu.vn', '0800-202-989', bcrypt.hashSync('1512517', 10), 1],
//     ['Russell', 'Juan', '1311116@student.hcmus.edu.vn', '1-877-881-51', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Isabelle', '1411806@student.hcmus.edu.vn', '0800-647-441', bcrypt.hashSync('1512517', 10), 1],
//     ['Adams', 'Julian', '1411116@student.hcmus.edu.vn', '0800-265-227', bcrypt.hashSync('1512517', 10), 1],
//     ['Wright', 'Mark', '1615651@student.hcmus.edu.vn', '1-866-981-77', bcrypt.hashSync('1512517', 10), 1],
//     ['Murphy', 'Francisco', '1514717@student.hcmus.edu.vn', '0800-683-672', bcrypt.hashSync('1512517', 10), 1],
//     ['Morgan', 'Francisco', '1613294@student.hcmus.edu.vn', '0800-117-446', bcrypt.hashSync('1512517', 10), 1],
//     ['Anderson', 'Darrell', '1615042@student.hcmus.edu.vn', '1-844-487-94', bcrypt.hashSync('1512517', 10), 1],
//     ['Nguyen', 'Lawrence', '1614822@student.hcmus.edu.vn', '0800-030-641', bcrypt.hashSync('1512517', 10), 1],
//     ['Wilson', 'Brooklyn', '1314243@student.hcmus.edu.vn', '0800-630-415', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Lance', '1512820@student.hcmus.edu.vn', '1-866-593-44', bcrypt.hashSync('1512517', 10), 1],
//     ['Hill', 'Ernest', '1314158@student.hcmus.edu.vn', '1-844-714-56', bcrypt.hashSync('1512517', 10), 1],
//     ['Taylor', 'Angel', '1311587@student.hcmus.edu.vn', '1-800-774-64', bcrypt.hashSync('1512517', 10), 1],
//     ['Ortiz', 'Francisco', '1313822@student.hcmus.edu.vn', '0800-182-412', bcrypt.hashSync('1512517', 10), 1],
//     ['Jenkins', 'Henry', '1615143@student.hcmus.edu.vn', '0800-363-448', bcrypt.hashSync('1512517', 10), 1],
//     ['Nguyen', 'Mario', '1614630@student.hcmus.edu.vn', '0800-616-572', bcrypt.hashSync('1512517', 10), 1],
//     ['Carter', 'Maya', '1614751@student.hcmus.edu.vn', '0800-366-803', bcrypt.hashSync('1512517', 10), 1],
//     ['Bailey', 'Aaliyah', '1312035@student.hcmus.edu.vn', '1-844-097-34', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Angel', '1314668@student.hcmus.edu.vn', '0800-209-897', bcrypt.hashSync('1512517', 10), 1],
//     ['Rodriguez', 'Ernest', '1512227@student.hcmus.edu.vn', '0800-153-092', bcrypt.hashSync('1512517', 10), 1],
//     ['Jackson', 'Olivia', '1313630@student.hcmus.edu.vn', '0800-824-180', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Benjamin', '1611086@student.hcmus.edu.vn', '0800-678-627', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Emily', '1313253@student.hcmus.edu.vn', '0800-315-495', bcrypt.hashSync('1512517', 10), 1],
//     ['Davis', 'Ellie', '1511281@student.hcmus.edu.vn', '0800-296-866', bcrypt.hashSync('1512517', 10), 1],
//     ['Martin', 'Lila', '1314855@student.hcmus.edu.vn', '1-877-041-29', bcrypt.hashSync('1512517', 10), 1],
//     ['Nguyen', 'Nora', '1413281@student.hcmus.edu.vn', '0800-687-431', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Philip', '1313158@student.hcmus.edu.vn', '1-844-937-67', bcrypt.hashSync('1512517', 10), 1],
//     ['Jenkins', 'Leon', '1311263@student.hcmus.edu.vn', '0800-962-256', bcrypt.hashSync('1512517', 10), 1],
//     ['Lewis', 'Vivian', '1414617@student.hcmus.edu.vn', '1-855-977-12', bcrypt.hashSync('1512517', 10), 1],
//     ['Watson', 'Jason', '1312565@student.hcmus.edu.vn', '0800-802-648', bcrypt.hashSync('1512517', 10), 1],
//     ['Watson', 'Savannah', '1313263@student.hcmus.edu.vn', '0800-276-550', bcrypt.hashSync('1512517', 10), 1],
//     ['Harris', 'Ella', '1514294@student.hcmus.edu.vn', '1-844-715-82', bcrypt.hashSync('1512517', 10), 1],
//     ['Long', 'Claude', '1512886@student.hcmus.edu.vn', '1-855-681-85', bcrypt.hashSync('1512517', 10), 1],
//     ['Reyes', 'Clinton', '1314741@student.hcmus.edu.vn', '1-866-182-12', bcrypt.hashSync('1512517', 10), 1],
//     ['Collins', 'Manuel', '1413367@student.hcmus.edu.vn', '0800-536-663', bcrypt.hashSync('1512517', 10), 1],
//     ['Peterson', 'Douglas', '1311435@student.hcmus.edu.vn', '0800-240-783', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Ian', '1314042@student.hcmus.edu.vn', '0800-923-862', bcrypt.hashSync('1512517', 10), 1],
//     ['Barnes', 'Keith', '1513147@student.hcmus.edu.vn', '1-844-944-54', bcrypt.hashSync('1512517', 10), 1],
//     ['Nelson', 'Lauren', '1614467@student.hcmus.edu.vn', '1-855-378-52', bcrypt.hashSync('1512517', 10), 1],
//     ['Phillips', 'Ken', '1313112@student.hcmus.edu.vn', '0800-478-525', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Avery', '1411161@student.hcmus.edu.vn', '1-855-695-68', bcrypt.hashSync('1512517', 10), 1],
//     ['Jackson', 'Scarlett', '1613263@student.hcmus.edu.vn', '1-844-241-37', bcrypt.hashSync('1512517', 10), 1],
//     ['Gomez', 'Javier', '1412556@student.hcmus.edu.vn', '1-855-584-75', bcrypt.hashSync('1512517', 10), 1],
//     ['Morris', 'Stanley', '1413108@student.hcmus.edu.vn', '0800-081-902', bcrypt.hashSync('1512517', 10), 1],
//     ['Miller', 'Nora', '1515630@student.hcmus.edu.vn', '1-844-516-38', bcrypt.hashSync('1512517', 10), 1],
//     ['Thomas', 'Manuel', '1313161@student.hcmus.edu.vn', '1-844-865-61', bcrypt.hashSync('1512517', 10), 1],
//     ['Murphy', 'Jesus', '1511988@student.hcmus.edu.vn', '1-844-177-55', bcrypt.hashSync('1512517', 10), 1],
//     ['Wright', 'Victoria', '1315888@student.hcmus.edu.vn', '1-800-338-46', bcrypt.hashSync('1512517', 10), 1],
//     ['Gomez', 'Victoria', '1515263@student.hcmus.edu.vn', '0800-668-454', bcrypt.hashSync('1512517', 10), 1],
//     ['Ross', 'Ryan', '1314446@student.hcmus.edu.vn', '0800-832-128', bcrypt.hashSync('1512517', 10), 1],
//     ['Carter', 'Matthew', '1612732@student.hcmus.edu.vn', '0800-612-521', bcrypt.hashSync('1512517', 10), 1],
//     ['Johnson', 'Lance', '1312717@student.hcmus.edu.vn', '0800-857-716', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Andy', '1512754@student.hcmus.edu.vn', '1-877-809-66', bcrypt.hashSync('1512517', 10), 1],
//     ['Long', 'Antonio', '1413243@student.hcmus.edu.vn', '0800-368-615', bcrypt.hashSync('1512517', 10), 1],
//     ['Clark', 'Gilbert', '1315988@student.hcmus.edu.vn', '1-844-258-98', bcrypt.hashSync('1512517', 10), 1],
//     ['Mitchell', 'Kenneth', '1611441@student.hcmus.edu.vn', '0800-852-742', bcrypt.hashSync('1512517', 10), 1],
//     ['Morris', 'Erik', '1413822@student.hcmus.edu.vn', '0800-878-341', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Cory', '1413774@student.hcmus.edu.vn', '0800-317-858', bcrypt.hashSync('1512517', 10), 1],
//     ['Richardson', 'Jason', '1513614@student.hcmus.edu.vn', '0800-277-781', bcrypt.hashSync('1512517', 10), 1],
//     ['Diaz', 'Ken', '1415378@student.hcmus.edu.vn', '0800-346-098', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanchez', 'Allan', '1412147@student.hcmus.edu.vn', '0800-113-320', bcrypt.hashSync('1512517', 10), 1],
//     ['Phillips', 'Sarah', '1313750@student.hcmus.edu.vn', '1-866-356-34', bcrypt.hashSync('1512517', 10), 1],
//     ['Jones', 'Benjamin', '1612839@student.hcmus.edu.vn', '0800-852-537', bcrypt.hashSync('1512517', 10), 1],
//     ['Wright', 'Gordon', '1614197@student.hcmus.edu.vn', '0800-621-213', bcrypt.hashSync('1512517', 10), 1],
//     ['Davis', 'Arianna', '1614147@student.hcmus.edu.vn', '1-855-151-75', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Benjamin', '1614750@student.hcmus.edu.vn', '0800-151-021', bcrypt.hashSync('1512517', 10), 1],
//     ['Flores', 'Paisley', '1314601@student.hcmus.edu.vn', '0800-588-638', bcrypt.hashSync('1512517', 10), 1],
//     ['Cruz', 'Aria', '1515750@student.hcmus.edu.vn', '1-877-845-72', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Stanley', '1312630@student.hcmus.edu.vn', '1-877-343-15', bcrypt.hashSync('1512517', 10), 1],
//     ['Scott', 'Makayla', '1513143@student.hcmus.edu.vn', '1-855-880-33', bcrypt.hashSync('1512517', 10), 1],
//     ['Allen', 'Ella', '1311646@student.hcmus.edu.vn', '1-877-694-32', bcrypt.hashSync('1512517', 10), 1],
//     ['Russell', 'Curtis', '1611161@student.hcmus.edu.vn', '0800-142-316', bcrypt.hashSync('1512517', 10), 1],
//     ['Cook', 'Bob', '1415654@student.hcmus.edu.vn', '1-800-378-37', bcrypt.hashSync('1512517', 10), 1],
//     ['Bell', 'Allison', '1412727@student.hcmus.edu.vn', '1-866-828-11', bcrypt.hashSync('1512517', 10), 1],
//     ['Baker', 'Wayne', '1413118@student.hcmus.edu.vn', '0800-042-224', bcrypt.hashSync('1512517', 10), 1],
//     ['Perez', 'Sarah', '1511411@student.hcmus.edu.vn', '0800-841-768', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Bobby', '1313858@student.hcmus.edu.vn', '0800-665-914', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Avery', '1513858@student.hcmus.edu.vn', '0800-881-846', bcrypt.hashSync('1512517', 10), 1],
//     ['Stewart', 'Jaime', '1511630@student.hcmus.edu.vn', '1-844-681-13', bcrypt.hashSync('1512517', 10), 1],
//     ['Harris', 'Claude', '1313733@student.hcmus.edu.vn', '1-844-928-26', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Makayla', '1515535@student.hcmus.edu.vn', '1-877-528-49', bcrypt.hashSync('1512517', 10), 1],
//     ['Thompson', 'Everett', '1615843@student.hcmus.edu.vn', '0800-109-233', bcrypt.hashSync('1512517', 10), 1],
//     ['Allen', 'Marc', '1615224@student.hcmus.edu.vn', '1-866-286-23', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Scarlett', '1613726@student.hcmus.edu.vn', '0800-561-191', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Aaron', '1513853@student.hcmus.edu.vn', '1-866-863-72', bcrypt.hashSync('1512517', 10), 1],
//     ['White', 'Sarah', '1312485@student.hcmus.edu.vn', '0800-368-681', bcrypt.hashSync('1512517', 10), 1],
//     ['Green', 'Victor', '1313851@student.hcmus.edu.vn', '0800-381-198', bcrypt.hashSync('1512517', 10), 1],
//     ['Phillips', 'Alex', '1511955@student.hcmus.edu.vn', '1-866-812-55', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Jose', '1511035@student.hcmus.edu.vn', '1-866-236-27', bcrypt.hashSync('1512517', 10), 1],
//     ['Smith', 'Ryan', '1514116@student.hcmus.edu.vn', '1-844-825-88', bcrypt.hashSync('1512517', 10), 1],
//     ['Sullivan', 'Mackenzie', '1312267@student.hcmus.edu.vn', '0800-754-173', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanders', 'Terrance', '1413450@student.hcmus.edu.vn', '1-866-848-97', bcrypt.hashSync('1512517', 10), 1],
//     ['Cox', 'Jesse', '1612843@student.hcmus.edu.vn', '1-877-458-24', bcrypt.hashSync('1512517', 10), 1],
//     ['Parker', 'Ava', '1515654@student.hcmus.edu.vn', '0800-111-113', bcrypt.hashSync('1512517', 10), 1],
//     ['Collins', 'Michael', '1512556@student.hcmus.edu.vn', '1-855-018-43', bcrypt.hashSync('1512517', 10), 1],
//     ['Garcia', 'Aaron', '1513852@student.hcmus.edu.vn', '0800-677-435', bcrypt.hashSync('1512517', 10), 1],
//     ['Howard', 'Lonnie', '1613116@student.hcmus.edu.vn', '0800-359-706', bcrypt.hashSync('1512517', 10), 1],
//     ['Nguyen', 'Avery', '1411855@student.hcmus.edu.vn', '0800-411-206', bcrypt.hashSync('1512517', 10), 1],
//     ['Rodriguez', 'Gabriel', '1315851@student.hcmus.edu.vn', '1-800-243-42', bcrypt.hashSync('1512517', 10), 1],
//     ['Jenkins', 'Jesus', '1511861@student.hcmus.edu.vn', '1-866-272-35', bcrypt.hashSync('1512517', 10), 1],
//     ['Campbell', 'Violet', '1512224@student.hcmus.edu.vn', '0800-567-511', bcrypt.hashSync('1512517', 10), 1],
//     ['Fisher', 'Brooklyn', '1512778@student.hcmus.edu.vn', '0800-581-662', bcrypt.hashSync('1512517', 10), 1],
//     ['Diaz', 'Scarlett', '1515651@student.hcmus.edu.vn', '0800-315-493', bcrypt.hashSync('1512517', 10), 1],
//     ['Jenkins', 'Clinton', '1311338@student.hcmus.edu.vn', '0800-877-995', bcrypt.hashSync('1512517', 10), 1],
//     ['Edwards', 'Vivian', '1613587@student.hcmus.edu.vn', '1-844-627-52', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Marion', '1314026@student.hcmus.edu.vn', '0800-268-668', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanchez', 'Jerome', '1612140@student.hcmus.edu.vn', '0800-237-377', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Everett', '1615975@student.hcmus.edu.vn', '0800-111-926', bcrypt.hashSync('1512517', 10), 1],
//     ['Hill', 'Mark', '1414651@student.hcmus.edu.vn', '1-866-789-81', bcrypt.hashSync('1512517', 10), 1],
//     ['Clark', 'Adalyn', '1415751@student.hcmus.edu.vn', '0800-288-751', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Armando', '1313468@student.hcmus.edu.vn', '1-844-880-91', bcrypt.hashSync('1512517', 10), 1],
//     ['Perez', 'Todd', '1611490@student.hcmus.edu.vn', '1-866-059-44', bcrypt.hashSync('1512517', 10), 1],
//     ['Baker', 'Todd', '1413435@student.hcmus.edu.vn', '1-877-709-68', bcrypt.hashSync('1512517', 10), 1],
//     ['Cook', 'Gabriel', '1511086@student.hcmus.edu.vn', '1-866-916-08', bcrypt.hashSync('1512517', 10), 1],
//     ['Young', 'Terry', '1411446@student.hcmus.edu.vn', '0800-134-358', bcrypt.hashSync('1512517', 10), 1],
//     ['Ross', 'Barry', '1412108@student.hcmus.edu.vn', '1-888-959-32', bcrypt.hashSync('1512517', 10), 1],
//     ['Baker', 'Violet', '1515140@student.hcmus.edu.vn', '0800-367-528', bcrypt.hashSync('1512517', 10), 1],
//     ['Richardson', 'Aaliyah', '1315294@student.hcmus.edu.vn', '0800-654-508', bcrypt.hashSync('1512517', 10), 1],
//     ['Stewart', 'Kirk', '1511851@student.hcmus.edu.vn', '0800-489-688', bcrypt.hashSync('1512517', 10), 1],
//     ['Peterson', 'Natalie', '1413852@student.hcmus.edu.vn', '1-866-183-42', bcrypt.hashSync('1512517', 10), 1],
//     ['Hall', 'Terrence', '1414888@student.hcmus.edu.vn', '0800-393-217', bcrypt.hashSync('1512517', 10), 1],
//     ['Brooks', 'Matthew', '1315109@student.hcmus.edu.vn', '1-866-779-18', bcrypt.hashSync('1512517', 10), 1],
//     ['Gutierrez', 'Casey', '1413109@student.hcmus.edu.vn', '1-800-418-47', bcrypt.hashSync('1512517', 10), 1],
//     ['Taylor', 'Lila', '1414774@student.hcmus.edu.vn', '0800-879-092', bcrypt.hashSync('1512517', 10), 1],
//     ['Rivera', 'Arthur', '1315227@student.hcmus.edu.vn', '0800-437-401', bcrypt.hashSync('1512517', 10), 1],
//     ['Martin', 'Paisley', '1514086@student.hcmus.edu.vn', '0800-854-354', bcrypt.hashSync('1512517', 10), 1],
//     ['Gutierrez', 'Antonio', '1614617@student.hcmus.edu.vn', '0800-367-445', bcrypt.hashSync('1512517', 10), 1],
//     ['Hughes', 'Ruben', '1612435@student.hcmus.edu.vn', '0800-340-911', bcrypt.hashSync('1512517', 10), 1],
//     ['Morris', 'Lila', '1415806@student.hcmus.edu.vn', '1-877-625-26', bcrypt.hashSync('1512517', 10), 1],
//     ['Thompson', 'Savannah', '1614888@student.hcmus.edu.vn', '1-844-475-39', bcrypt.hashSync('1512517', 10), 1],
//     ['James', 'Gabriel', '1315820@student.hcmus.edu.vn', '1-855-332-52', bcrypt.hashSync('1512517', 10), 1],
//     ['Morales', 'Bobby', '1415450@student.hcmus.edu.vn', '0800-514-753', bcrypt.hashSync('1512517', 10), 1],
//     ['Mitchell', 'Juan', '1612741@student.hcmus.edu.vn', '1-855-874-81', bcrypt.hashSync('1512517', 10), 1],
//     ['Cox', 'Herman', '1612534@student.hcmus.edu.vn', '0800-923-525', bcrypt.hashSync('1512517', 10), 1],
//     ['Barnes', 'Adalyn', '1615485@student.hcmus.edu.vn', '0800-371-047', bcrypt.hashSync('1512517', 10), 1],
//     ['Wright', 'Ian', '1312318@student.hcmus.edu.vn', '0800-824-281', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Ellie', '1514485@student.hcmus.edu.vn', '1-800-988-72', bcrypt.hashSync('1512517', 10), 1],
//     ['Perez', 'Mackenzie', '1313281@student.hcmus.edu.vn', '1-877-366-87', bcrypt.hashSync('1512517', 10), 1],
//     ['Anderson', 'Hannah', '1615726@student.hcmus.edu.vn', '0800-315-138', bcrypt.hashSync('1512517', 10), 1],
//     ['Gomez', 'Sydney', '1611615@student.hcmus.edu.vn', '0800-417-799', bcrypt.hashSync('1512517', 10), 1],
//     ['Hughes', 'Vivian', '1512852@student.hcmus.edu.vn', '0800-832-725', bcrypt.hashSync('1512517', 10), 1],
//     ['Adams', 'Francisco', '1412851@student.hcmus.edu.vn', '0800-047-545', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Wayne', '1615402@student.hcmus.edu.vn', '0800-184-242', bcrypt.hashSync('1512517', 10), 1],
//     ['Ortiz', 'Maya', '1313227@student.hcmus.edu.vn', '1-866-977-21', bcrypt.hashSync('1512517', 10), 1],
//     ['Allen', 'Antonio', '1312338@student.hcmus.edu.vn', '0800-312-525', bcrypt.hashSync('1512517', 10), 1],
//     ['Rivera', 'Ruben', '1614238@student.hcmus.edu.vn', '1-855-856-13', bcrypt.hashSync('1512517', 10), 1],
//     ['Diaz', 'Alexander', '1312490@student.hcmus.edu.vn', '0800-151-364', bcrypt.hashSync('1512517', 10), 1],
//     ['Diaz', 'Jaime', '1411668@student.hcmus.edu.vn', '1-800-185-48', bcrypt.hashSync('1512517', 10), 1],
//     ['Lopez', 'Hannah', '1615630@student.hcmus.edu.vn', '1-866-032-82', bcrypt.hashSync('1512517', 10), 1],
//     ['Wright', 'Charlotte', '1311452@student.hcmus.edu.vn', '1-844-955-42', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanders', 'Dan', '1411535@student.hcmus.edu.vn', '1-844-676-36', bcrypt.hashSync('1512517', 10), 1],
//     ['Roberts', 'Gene', '1615756@student.hcmus.edu.vn', '0800-545-064', bcrypt.hashSync('1512517', 10), 1],
//     ['Thompson', 'Jerome', '1414636@student.hcmus.edu.vn', '0800-458-901', bcrypt.hashSync('1512517', 10), 1],
//     ['Davis', 'Violet', '1511719@student.hcmus.edu.vn', '0800-552-539', bcrypt.hashSync('1512517', 10), 1],
//     ['Johnson', 'Kevin', '1312402@student.hcmus.edu.vn', '0800-652-342', bcrypt.hashSync('1512517', 10), 1],
//     ['Davis', 'Everett', '1412273@student.hcmus.edu.vn', '1-866-358-05', bcrypt.hashSync('1512517', 10), 1],
//     ['Rivera', 'Armando', '1512535@student.hcmus.edu.vn', '0800-236-096', bcrypt.hashSync('1512517', 10), 1],
//     ['Peterson', 'Erik', '1412726@student.hcmus.edu.vn', '1-800-341-56', bcrypt.hashSync('1512517', 10), 1],
//     ['Green', 'Olivia', '1614490@student.hcmus.edu.vn', '1-844-745-85', bcrypt.hashSync('1512517', 10), 1],
//     ['Richardson', 'Claire', '1611820@student.hcmus.edu.vn', '1-855-839-14', bcrypt.hashSync('1512517', 10), 1],
//     ['Rivera', 'Lillian', '1513273@student.hcmus.edu.vn', '1-888-563-11', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Gabriel', '1415617@student.hcmus.edu.vn', '1-844-581-63', bcrypt.hashSync('1512517', 10), 1],
//     ['Perry', 'Casey', '1511975@student.hcmus.edu.vn', '0800-006-787', bcrypt.hashSync('1512517', 10), 1],
//     ['Gomez', 'Mackenzie', '1413719@student.hcmus.edu.vn', '1-877-786-23', bcrypt.hashSync('1512517', 10), 1],
//     ['Harris', 'Peter', '1512294@student.hcmus.edu.vn', '0800-422-784', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Kylie', '1511811@student.hcmus.edu.vn', '0800-360-151', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanders', 'Emily', '1612402@student.hcmus.edu.vn', '1-844-448-84', bcrypt.hashSync('1512517', 10), 1],
//     ['Richardson', 'Claude', '1312774@student.hcmus.edu.vn', '1-855-733-88', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanchez', 'Darrell', '1313441@student.hcmus.edu.vn', '0800-281-814', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Casey', '1613617@student.hcmus.edu.vn', '1-800-114-35', bcrypt.hashSync('1512517', 10), 1],
//     ['Morales', 'Herman', '1514615@student.hcmus.edu.vn', '1-800-328-66', bcrypt.hashSync('1512517', 10), 1],
//     ['Reed', 'Ray', '1413741@student.hcmus.edu.vn', '1-877-012-71', bcrypt.hashSync('1512517', 10), 1],
//     ['Parker', 'Kenneth', '1515227@student.hcmus.edu.vn', '1-877-883-16', bcrypt.hashSync('1512517', 10), 1],
//     ['Hill', 'Benjamin', '1611727@student.hcmus.edu.vn', '1-855-841-27', bcrypt.hashSync('1512517', 10), 1],
//     ['Russell', 'Charlotte', '1514490@student.hcmus.edu.vn', '1-800-486-71', bcrypt.hashSync('1512517', 10), 1],
//     ['Hall', 'Clifton', '1613467@student.hcmus.edu.vn', '0800-332-057', bcrypt.hashSync('1512517', 10), 1],
//     ['Baker', 'Aaliyah', '1613035@student.hcmus.edu.vn', '1-855-808-84', bcrypt.hashSync('1512517', 10), 1],
//     ['Rivera', 'Juan', '1415411@student.hcmus.edu.vn', '1-888-323-86', bcrypt.hashSync('1512517', 10), 1],
//     ['Peterson', 'Nicholas', '1512485@student.hcmus.edu.vn', '0800-280-185', bcrypt.hashSync('1512517', 10), 1],
//     ['Parker', 'Nelson', '1513630@student.hcmus.edu.vn', '1-866-721-41', bcrypt.hashSync('1512517', 10), 1],
//     ['Turner', 'Nora', '1614411@student.hcmus.edu.vn', '1-844-743-78', bcrypt.hashSync('1512517', 10), 1],
//     ['Moore', 'Ruben', '1415446@student.hcmus.edu.vn', '0800-826-186', bcrypt.hashSync('1512517', 10), 1],
//     ['Howard', 'Dwayne', '1511806@student.hcmus.edu.vn', '0800-926-658', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Claude', '1314886@student.hcmus.edu.vn', '0800-361-066', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Adalyn', '1614109@student.hcmus.edu.vn', '1-866-683-33', bcrypt.hashSync('1512517', 10), 1],
//     ['Howard', 'Zoe', '1514224@student.hcmus.edu.vn', '1-866-167-92', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Bradley', '1614263@student.hcmus.edu.vn', '1-866-332-54', bcrypt.hashSync('1512517', 10), 1],
//     ['Watson', 'Mackenzie', '1611186@student.hcmus.edu.vn', '0800-186-118', bcrypt.hashSync('1512517', 10), 1],
//     ['Allen', 'Dwayne', '1513118@student.hcmus.edu.vn', '0800-985-390', bcrypt.hashSync('1512517', 10), 1],
//     ['Campbell', 'Kaitlyn', '1614535@student.hcmus.edu.vn', '0800-158-514', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Raul', '1313601@student.hcmus.edu.vn', '1-855-886-66', bcrypt.hashSync('1512517', 10), 1],
//     ['Allen', 'Zoe', '1512367@student.hcmus.edu.vn', '1-888-176-55', bcrypt.hashSync('1512517', 10), 1],
//     ['Rogers', 'Vivian', '1614534@student.hcmus.edu.vn', '1-855-540-65', bcrypt.hashSync('1512517', 10), 1],
//     ['Ward', 'Kylie', '1613668@student.hcmus.edu.vn', '0800-724-754', bcrypt.hashSync('1512517', 10), 1],
//     ['Diaz', 'Ian', '1413988@student.hcmus.edu.vn', '1-888-800-18', bcrypt.hashSync('1512517', 10), 1],
//     ['Jackson', 'Benjamin', '1614601@student.hcmus.edu.vn', '1-855-494-44', bcrypt.hashSync('1512517', 10), 1],
//     ['Ramirez', 'Ernest', '1411485@student.hcmus.edu.vn', '0800-472-495', bcrypt.hashSync('1512517', 10), 1],
//     ['Scott', 'Allison', '1612157@student.hcmus.edu.vn', '0800-014-433', bcrypt.hashSync('1512517', 10), 1],
//     ['Butler', 'Vivian', '1414851@student.hcmus.edu.vn', '1-844-368-35', bcrypt.hashSync('1512517', 10), 1],
//     ['Perry', 'Douglas', '1511565@student.hcmus.edu.vn', '1-888-908-43', bcrypt.hashSync('1512517', 10), 1],
//     ['Reyes', 'Jason', '1611281@student.hcmus.edu.vn', '1-866-745-38', bcrypt.hashSync('1512517', 10), 1],
//     ['Edwards', 'Sydney', '1411879@student.hcmus.edu.vn', '1-844-741-87', bcrypt.hashSync('1512517', 10), 1],
//     ['Collins', 'Lonnie', '1412485@student.hcmus.edu.vn', '0800-536-842', bcrypt.hashSync('1512517', 10), 1],
//     ['Butler', 'Gabriel', '1312587@student.hcmus.edu.vn', '1-855-265-67', bcrypt.hashSync('1512517', 10), 1],
//     ['Lopez', 'Claude', '1513811@student.hcmus.edu.vn', '1-866-435-61', bcrypt.hashSync('1512517', 10), 1],
//     ['Flores', 'Donald', '1515378@student.hcmus.edu.vn', '1-844-113-37', bcrypt.hashSync('1512517', 10), 1],
//     ['Long', 'Gordon', '1311490@student.hcmus.edu.vn', '1-866-534-75', bcrypt.hashSync('1512517', 10), 1],
//     ['Taylor', 'Avery', '1511839@student.hcmus.edu.vn', '1-888-469-62', bcrypt.hashSync('1512517', 10), 1],
//     ['Garcia', 'Roberto', '1514727@student.hcmus.edu.vn', '1-877-897-33', bcrypt.hashSync('1512517', 10), 1],
//     ['Bell', 'Dwayne', '1615441@student.hcmus.edu.vn', '1-866-686-42', bcrypt.hashSync('1512517', 10), 1],
//     ['Harris', 'Ava', '1313338@student.hcmus.edu.vn', '1-844-581-84', bcrypt.hashSync('1512517', 10), 1],
//     ['Miller', 'Stella', '1514238@student.hcmus.edu.vn', '0800-856-871', bcrypt.hashSync('1512517', 10), 1],
//     ['Carter', 'Jesus', '1615955@student.hcmus.edu.vn', '1-855-136-23', bcrypt.hashSync('1512517', 10), 1],
//     ['Campbell', 'Jesse', '1312750@student.hcmus.edu.vn', '0800-946-865', bcrypt.hashSync('1512517', 10), 1],
//     ['Morris', 'Mario', '1614855@student.hcmus.edu.vn', '0800-795-955', bcrypt.hashSync('1512517', 10), 1],
//     ['Price', 'Raul', '1415888@student.hcmus.edu.vn', '0800-496-684', bcrypt.hashSync('1512517', 10), 1],
//     ['Price', 'Clifton', '1312273@student.hcmus.edu.vn', '0800-022-136', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Nicholas', '1311467@student.hcmus.edu.vn', '1-866-577-72', bcrypt.hashSync('1512517', 10), 1],
//     ['Hughes', 'Roberto', '1415147@student.hcmus.edu.vn', '0800-055-351', bcrypt.hashSync('1512517', 10), 1],
//     ['Gonzalez', 'Joel', '1614161@student.hcmus.edu.vn', '0800-071-415', bcrypt.hashSync('1512517', 10), 1],
//     ['Ward', 'Johnnie', '1511490@student.hcmus.edu.vn', '0800-108-178', bcrypt.hashSync('1512517', 10), 1],
//     ['Wilson', 'Franklin', '1611158@student.hcmus.edu.vn', '1-844-423-44', bcrypt.hashSync('1512517', 10), 1],
//     ['Perez', 'Brett', '1411733@student.hcmus.edu.vn', '0800-462-448', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Johnnie', '1412886@student.hcmus.edu.vn', '0800-472-777', bcrypt.hashSync('1512517', 10), 1],
//     ['Butler', 'Keira', '1312617@student.hcmus.edu.vn', '1-855-254-46', bcrypt.hashSync('1512517', 10), 1],
//     ['Walker', 'Robert', '1513879@student.hcmus.edu.vn', '1-866-277-61', bcrypt.hashSync('1512517', 10), 1],
//     ['Young', 'Herman', '1615343@student.hcmus.edu.vn', '1-800-829-67', bcrypt.hashSync('1512517', 10), 1],
//     ['Martinez', 'Curtis', '1413378@student.hcmus.edu.vn', '1-877-053-46', bcrypt.hashSync('1512517', 10), 1],
//     ['Campbell', 'Victor', '1311858@student.hcmus.edu.vn', '1-866-571-26', bcrypt.hashSync('1512517', 10), 1],
//     ['Anderson', 'Paisley', '1613534@student.hcmus.edu.vn', '0800-365-664', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Dwayne', '1313741@student.hcmus.edu.vn', '0800-851-253', bcrypt.hashSync('1512517', 10), 1],
//     ['Cooper', 'Juan', '1614614@student.hcmus.edu.vn', '0800-462-178', bcrypt.hashSync('1512517', 10), 1],
//     ['Hall', 'Hailey', '1313221@student.hcmus.edu.vn', '0800-794-534', bcrypt.hashSync('1512517', 10), 1],
//     ['Rodriguez', 'Peter', '1312086@student.hcmus.edu.vn', '1-877-885-76', bcrypt.hashSync('1512517', 10), 1],
//     ['Lee', 'Marion', '1312294@student.hcmus.edu.vn', '0800-553-378', bcrypt.hashSync('1512517', 10), 1],
//     ['Adams', 'Isabelle', '1611378@student.hcmus.edu.vn', '1-877-924-28', bcrypt.hashSync('1512517', 10), 1],
//     ['Evans', 'Gianna', '1515109@student.hcmus.edu.vn', '0800-028-474', bcrypt.hashSync('1512517', 10), 1],
//     ['Miller', 'Ben', '1511886@student.hcmus.edu.vn', '0800-667-233', bcrypt.hashSync('1512517', 10), 1],
//     ['Sanders', 'Henry', '1513140@student.hcmus.edu.vn', '1-855-536-41', bcrypt.hashSync('1512517', 10), 1],
//     ['Turner', 'Rodney', '1315343@student.hcmus.edu.vn', '1-844-201-53', bcrypt.hashSync('1512517', 10), 1],
//     ['Harris', 'Ella', '1612888@student.hcmus.edu.vn', '1-844-786-06', bcrypt.hashSync('1512517', 10), 1],
//     ['Gonzalez', 'Tim', '1515116@student.hcmus.edu.vn', '0800-962-261', bcrypt.hashSync('1512517', 10), 1],
//     ['Gray', 'Lonnie', '1415535@student.hcmus.edu.vn', '0800-026-711', bcrypt.hashSync('1512517', 10), 1],
//     ['Kelly', 'Rodney', '1311158@student.hcmus.edu.vn', '1-844-492-85', bcrypt.hashSync('1512517', 10), 1],
//     ['Foster', 'Savannah', '1613253@student.hcmus.edu.vn', '0800-873-537', bcrypt.hashSync('1512517', 10), 1],
//     ['Miller', 'Terry', '1615273@student.hcmus.edu.vn', '0800-764-117', bcrypt.hashSync('1512517', 10), 1],
//     ['Bell', 'Manuel', '1513378@student.hcmus.edu.vn', '0800-675-121', bcrypt.hashSync('1512517', 10), 1],
//     ['Gutierrez', 'Julian', '1612042@student.hcmus.edu.vn', '1-877-517-28', bcrypt.hashSync('1512517', 10), 1],
//     ['Rodriguez', 'Nora', '1413026@student.hcmus.edu.vn', '1-855-603-56', bcrypt.hashSync('1512517', 10), 1],
//     ['Campbell', 'Joseph', '1315668@student.hcmus.edu.vn', '0800-079-241', bcrypt.hashSync('1512517', 10), 1],
//     ['Carter', 'Charlie', '1314273@student.hcmus.edu.vn', '0800-676-150', bcrypt.hashSync('1512517', 10), 1],
//     ['Taylor', 'Mitchell', '1512654@student.hcmus.edu.vn', '0800-144-648', bcrypt.hashSync('1512517', 10), 1],
//     ['Lee', 'Camilla', '1413035@student.hcmus.edu.vn', '0800-537-425', bcrypt.hashSync('1512517', 10), 1],
//     ['Morris', 'Jason', '1615754@student.hcmus.edu.vn', '1-844-727-87', bcrypt.hashSync('1512517', 10), 1],
//     ['Evans', 'Clifton', '1311221@student.hcmus.edu.vn', '1-855-284-83', bcrypt.hashSync('1512517', 10), 1],
//     ['Moore', 'Bob', '1412717@student.hcmus.edu.vn', '0800-245-433', bcrypt.hashSync('1512517', 10), 1],
//     ['Taylor', 'Herman', '1412026@student.hcmus.edu.vn', '0800-475-504', bcrypt.hashSync('1512517', 10), 1],
//     ['Edwards', 'Peter', '1614221@student.hcmus.edu.vn', '0800-911-559', bcrypt.hashSync('1512517', 10), 1],
//     ['Gray', 'Marc', '1414197@student.hcmus.edu.vn', '1-877-327-34', bcrypt.hashSync('1512517', 10), 1],
//     ['Gray', 'Ray', '1414161@student.hcmus.edu.vn', '0800-803-326', bcrypt.hashSync('1512517', 10), 1],
//     ['Price', 'Raul', '1511852@student.hcmus.edu.vn', '0800-605-156', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Paisley', '1315157@student.hcmus.edu.vn', '0800-841-378', bcrypt.hashSync('1512517', 10), 1],
//     ['Hernandez', 'Jeffery', '1414026@student.hcmus.edu.vn', '1-888-915-65', bcrypt.hashSync('1512517', 10), 1],
//     ['Williams', 'Hailey', '1412654@student.hcmus.edu.vn', '1-877-141-50', bcrypt.hashSync('1512517', 10), 1],
//     ['Torres', 'Leo', '1611654@student.hcmus.edu.vn', '1-844-817-68', bcrypt.hashSync('1512517', 10), 1],
//     ['Ross', 'Gianna', '1614853@student.hcmus.edu.vn', '1-877-627-63', bcrypt.hashSync('1512517', 10), 1],
//     ['Flores', 'Bruce', '1315224@student.hcmus.edu.vn', '1-800-001-85', bcrypt.hashSync('1512517', 10), 1],
//     ['Reyes', 'Jeffery', '1512774@student.hcmus.edu.vn', '1-800-145-16', bcrypt.hashSync('1512517', 10), 1],
//     ['Lopez', 'Vivian', '1514035@student.hcmus.edu.vn', '1-844-387-71', bcrypt.hashSync('1512517', 10), 1],
//     ['Long', 'Vivian', '1612955@student.hcmus.edu.vn', '0800-750-513', bcrypt.hashSync('1512517', 10), 1],
//     ['Wood', 'Ramon', '1513719@student.hcmus.edu.vn', '0800-962-882', bcrypt.hashSync('1512517', 10), 1],
//     ['Bennett', 'Ray', '1312221@student.hcmus.edu.vn', '1-855-245-23', bcrypt.hashSync('1512517', 10), 1],
//     ['Parker', 'Keira', '1613988@student.hcmus.edu.vn', '1-844-561-39', bcrypt.hashSync('1512517', 10), 1],
//     ['Edwards', 'Jorge', '1411955@student.hcmus.edu.vn', '1-866-214-35', bcrypt.hashSync('1512517', 10), 1],
//     ['Rodriguez', 'Stella', '1514839@student.hcmus.edu.vn', '0800-170-198', bcrypt.hashSync('1512517', 10), 1],
//     ['Edwards', 'Wade', '1315086@student.hcmus.edu.vn', '1-877-608-87', bcrypt.hashSync('1512517', 10), 1],
//     ['Walker', 'Jerry', '1514367@student.hcmus.edu.vn', '1-866-577-45', bcrypt.hashSync('1512517', 10), 1],
// ];

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
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users1), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
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
            // function (callback) {
            //     connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users3), function (error, results, fields) {
            //         if (error) {
            //             callback(error);
            //         } else {
            //             callback();
            //         }
            //     });
            // },
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
            function (callback) {
                connection.query(format('INSERT INTO student_enroll_course (class_has_course_id,student_id) VALUES %L', insert_student_enroll_course), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO absence_requests (student_id, reason, start_date, end_date) VALUES %L', insert_absence_requests), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO attendance (course_id,class_id,closed) VALUES %L', insert_attendance), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO attendance_detail (attendance_id, student_id, attendance_type) VALUES %L', insert_attendance_detail), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
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
