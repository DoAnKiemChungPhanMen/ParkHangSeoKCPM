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
    ///
    ///
    //
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
    ['Reyes', 'Aria', '1412229@student.hcmus.edu.vn', '0800-621-546', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Nelson', '1612294@student.hcmus.edu.vn', '0800-214-892', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Hannah', '1511378@student.hcmus.edu.vn', '1-855-051-39', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Terrance', '1515158@student.hcmus.edu.vn', '0800-622-683', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Marvin', '1414811@student.hcmus.edu.vn', '0800-233-265', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Eric', '1411886@student.hcmus.edu.vn', '0800-078-102', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Jesus', '1512281@student.hcmus.edu.vn', '0800-348-736', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Terrence', '1314534@student.hcmus.edu.vn', '0800-081-498', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Kenneth', '1515186@student.hcmus.edu.vn', '1-866-634-60', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Hannah', '1312118@student.hcmus.edu.vn', '0800-425-588', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Fernando', '1314147@student.hcmus.edu.vn', '1-888-533-52', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Eric', '1414238@student.hcmus.edu.vn', '0800-926-682', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Brett', '1613490@student.hcmus.edu.vn', '0800-667-818', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Roland', '1311197@student.hcmus.edu.vn', '1-866-944-24', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Lillian', '1412452@student.hcmus.edu.vn', '1-877-761-79', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Isabelle', '1313614@student.hcmus.edu.vn', '1-844-246-87', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Wade', '1611741@student.hcmus.edu.vn', '0800-692-246', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Lawrence', '1312411@student.hcmus.edu.vn', '0800-997-055', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Bruce', '1315281@student.hcmus.edu.vn', '0800-813-658', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Clara', '1414886@student.hcmus.edu.vn', '0800-467-041', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Aaron', '1612367@student.hcmus.edu.vn', '1-855-814-13', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Alexander', '1515224@student.hcmus.edu.vn', '1-844-694-77', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Jorge', '1612751@student.hcmus.edu.vn', '1-844-515-82', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Claude', '1313534@student.hcmus.edu.vn', '0800-113-008', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Peter', '1313852@student.hcmus.edu.vn', '1-800-152-87', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Gene', '1412822@student.hcmus.edu.vn', '0800-619-293', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Mackenzie', '1514143@student.hcmus.edu.vn', '0800-680-385', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Ella', '1414378@student.hcmus.edu.vn', '0800-478-895', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Nora', '1415108@student.hcmus.edu.vn', '1-888-926-61', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Roberto', '1312468@student.hcmus.edu.vn', '1-866-476-45', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Stanley', '1515682@student.hcmus.edu.vn', '1-844-757-39', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Jose', '1515754@student.hcmus.edu.vn', '1-800-874-27', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Arthur', '1313839@student.hcmus.edu.vn', '0800-140-732', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Violet', '1515143@student.hcmus.edu.vn', '0800-332-937', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Keith', '1511224@student.hcmus.edu.vn', '0800-598-918', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Manuel', '1513109@student.hcmus.edu.vn', '0800-417-272', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Victor', '1515450@student.hcmus.edu.vn', '1-800-949-16', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Lawrence', '1612118@student.hcmus.edu.vn', '0800-238-584', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Kevin', '1511668@student.hcmus.edu.vn', '0800-911-026', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Jeffery', '1515026@student.hcmus.edu.vn', '0800-186-274', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Lillian', '1312147@student.hcmus.edu.vn', '1-866-822-77', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Jeffery', '1615858@student.hcmus.edu.vn', '0800-487-435', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Ellie', '1513116@student.hcmus.edu.vn', '0800-346-161', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Casey', '1415118@student.hcmus.edu.vn', '0800-312-632', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Kenneth', '1612601@student.hcmus.edu.vn', '1-800-012-64', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Antonio', '1511853@student.hcmus.edu.vn', '0800-555-371', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Sydney', '1412468@student.hcmus.edu.vn', '0800-539-501', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Dustin', '1311630@student.hcmus.edu.vn', '1-800-735-18', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Allan', '1315253@student.hcmus.edu.vn', '0800-138-312', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Max', '1411722@student.hcmus.edu.vn', '1-855-753-51', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Angel', '1414654@student.hcmus.edu.vn', '0800-116-566', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Ronnie', '1315147@student.hcmus.edu.vn', '0800-035-228', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Francisco', '1311601@student.hcmus.edu.vn', '1-855-317-35', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Philip', '1413820@student.hcmus.edu.vn', '1-844-815-12', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Camilla', '1414157@student.hcmus.edu.vn', '1-877-456-46', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Salvador', '1411468@student.hcmus.edu.vn', '1-888-275-62', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Lauren', '1614378@student.hcmus.edu.vn', '1-866-011-70', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Phillip', '1315646@student.hcmus.edu.vn', '0800-074-136', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Jason', '1614450@student.hcmus.edu.vn', '0800-385-023', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Aria', '1512157@student.hcmus.edu.vn', '0800-151-834', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Ava', '1315727@student.hcmus.edu.vn', '1-888-150-20', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Casey', '1312042@student.hcmus.edu.vn', '1-877-519-24', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Roland', '1414086@student.hcmus.edu.vn', '1-855-139-27', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Sam', '1612221@student.hcmus.edu.vn', '0800-152-341', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Grace', '1313042@student.hcmus.edu.vn', '1-866-239-53', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Gianna', '1412035@student.hcmus.edu.vn', '0800-528-190', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Kirk', '1612338@student.hcmus.edu.vn', '1-877-413-16', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Terry', '1415615@student.hcmus.edu.vn', '0800-789-665', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Lila', '1413289@student.hcmus.edu.vn', '1-877-343-43', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Lillian', '1514281@student.hcmus.edu.vn', '1-866-626-79', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Alex', '1513636@student.hcmus.edu.vn', '1-855-173-71', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Ian', '1511858@student.hcmus.edu.vn', '0800-325-141', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Wade', '1614820@student.hcmus.edu.vn', '0800-648-482', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Salvador', '1311682@student.hcmus.edu.vn', '1-866-872-48', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Bradley', '1413754@student.hcmus.edu.vn', '0800-835-856', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Ellie', '1413853@student.hcmus.edu.vn', '0800-723-721', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Makayla', '1413587@student.hcmus.edu.vn', '1-800-329-07', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Jesse', '1515646@student.hcmus.edu.vn', '0800-334-589', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Keith', '1311534@student.hcmus.edu.vn', '0800-141-455', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Scarlett', '1415556@student.hcmus.edu.vn', '1-866-145-14', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Armando', '1315273@student.hcmus.edu.vn', '0800-561-166', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Scarlett', '1513446@student.hcmus.edu.vn', '1-877-128-31', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Olivia', '1512955@student.hcmus.edu.vn', '0800-187-956', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Fernando', '1314975@student.hcmus.edu.vn', '1-888-623-75', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Marion', '1315318@student.hcmus.edu.vn', '1-866-483-47', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Allan', '1312197@student.hcmus.edu.vn', '1-855-001-09', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Marion', '1415651@student.hcmus.edu.vn', '1-866-708-79', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Ellie', '1612858@student.hcmus.edu.vn', '0800-621-542', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Grace', '1311411@student.hcmus.edu.vn', '0800-335-187', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Marc', '1312485@student.hcmus.edu.vn', '0800-886-316', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Terry', '1614338@student.hcmus.edu.vn', '0800-332-624', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Natalie', '1314774@student.hcmus.edu.vn', '0800-811-724', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Dan', '1312839@student.hcmus.edu.vn', '0800-554-125', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Gianna', '1615732@student.hcmus.edu.vn', '0800-301-667', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Keith', '1512338@student.hcmus.edu.vn', '0800-281-892', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Wade', '1513143@student.hcmus.edu.vn', '0800-455-722', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Joel', '1514378@student.hcmus.edu.vn', '1-877-558-53', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Darryl', '1315858@student.hcmus.edu.vn', '0800-011-471', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Jason', '1311614@student.hcmus.edu.vn', '1-866-239-92', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Julia', '1315732@student.hcmus.edu.vn', '1-844-124-21', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Everett', '1311109@student.hcmus.edu.vn', '1-866-451-05', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Henry', '1612651@student.hcmus.edu.vn', '0800-779-548', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Stanley', '1414468@student.hcmus.edu.vn', '0800-273-982', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Rodney', '1413839@student.hcmus.edu.vn', '1-844-153-87', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Ramon', '1414485@student.hcmus.edu.vn', '0800-556-614', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Maya', '1415955@student.hcmus.edu.vn', '0800-543-616', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Henry', '1311035@student.hcmus.edu.vn', '1-888-299-76', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Jorge', '1411741@student.hcmus.edu.vn', '1-866-634-41', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Lillian', '1514467@student.hcmus.edu.vn', '0800-357-655', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Marvin', '1315617@student.hcmus.edu.vn', '1-877-865-81', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Julia', '1414988@student.hcmus.edu.vn', '0800-187-822', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Scarlett', '1514851@student.hcmus.edu.vn', '1-877-397-25', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Clinton', '1312651@student.hcmus.edu.vn', '1-800-287-62', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Angel', '1511774@student.hcmus.edu.vn', '0800-353-772', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Angel', '1411229@student.hcmus.edu.vn', '1-855-129-11', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Mackenzie', '1512750@student.hcmus.edu.vn', '1-844-684-74', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Perry', '1314116@student.hcmus.edu.vn', '0800-287-672', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Allan', '1414441@student.hcmus.edu.vn', '0800-877-136', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Isabelle', '1613955@student.hcmus.edu.vn', '0800-056-439', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Max', '1415820@student.hcmus.edu.vn', '1-877-654-76', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Salvador', '1311975@student.hcmus.edu.vn', '1-800-427-74', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Brooklyn', '1311042@student.hcmus.edu.vn', '0800-524-361', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Natalie', '1514774@student.hcmus.edu.vn', '1-844-342-71', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Alexander', '1613822@student.hcmus.edu.vn', '0800-155-331', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Paisley', '1612646@student.hcmus.edu.vn', '1-866-044-48', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Dwayne', '1412719@student.hcmus.edu.vn', '1-855-655-36', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Javier', '1412467@student.hcmus.edu.vn', '1-866-665-74', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Adalyn', '1611556@student.hcmus.edu.vn', '1-877-222-69', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Ryan', '1511441@student.hcmus.edu.vn', '1-877-729-76', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Lauren', '1415318@student.hcmus.edu.vn', '1-855-164-85', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Dustin', '1315143@student.hcmus.edu.vn', '1-844-570-16', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Lauren', '1415441@student.hcmus.edu.vn', '1-877-476-33', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Andy', '1311402@student.hcmus.edu.vn', '1-800-615-86', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Gianna', '1513843@student.hcmus.edu.vn', '1-866-277-76', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Stanley', '1614879@student.hcmus.edu.vn', '0800-577-861', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Clara', '1315140@student.hcmus.edu.vn', '1-866-664-55', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Makayla', '1614253@student.hcmus.edu.vn', '1-888-368-43', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Camilla', '1311186@student.hcmus.edu.vn', '0800-571-826', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Stella', '1513253@student.hcmus.edu.vn', '0800-426-855', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Keith', '1611197@student.hcmus.edu.vn', '1-844-403-40', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Maya', '1512614@student.hcmus.edu.vn', '1-877-422-46', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Jeffery', '1613118@student.hcmus.edu.vn', '1-855-618-44', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Perry', '1615161@student.hcmus.edu.vn', '1-866-125-21', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Gianna', '1314587@student.hcmus.edu.vn', '1-844-308-54', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Fernando', '1511450@student.hcmus.edu.vn', '1-877-229-55', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Ramon', '1412806@student.hcmus.edu.vn', '0800-525-747', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Casey', '1413338@student.hcmus.edu.vn', '0800-827-671', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Brett', '1615855@student.hcmus.edu.vn', '0800-361-333', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Arianna', '1312140@student.hcmus.edu.vn', '1-855-880-34', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Jacob', '1411378@student.hcmus.edu.vn', '1-855-215-48', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Julia', '1514651@student.hcmus.edu.vn', '0800-319-838', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Ella', '1611229@student.hcmus.edu.vn', '1-800-556-95', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Jerry', '1512318@student.hcmus.edu.vn', '1-866-350-21', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Lawrence', '1515112@student.hcmus.edu.vn', '0800-396-646', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Salvador', '1414229@student.hcmus.edu.vn', '0800-427-710', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Perry', '1412741@student.hcmus.edu.vn', '0800-184-541', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Manuel', '1414281@student.hcmus.edu.vn', '1-866-017-16', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Olivia', '1511468@student.hcmus.edu.vn', '0800-172-580', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Angel', '1411112@student.hcmus.edu.vn', '0800-426-433', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Ava', '1312733@student.hcmus.edu.vn', '1-855-822-88', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Raul', '1414751@student.hcmus.edu.vn', '0800-326-687', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Isabelle', '1514822@student.hcmus.edu.vn', '1-888-305-12', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Kenneth', '1511843@student.hcmus.edu.vn', '0800-365-378', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Stella', '1515778@student.hcmus.edu.vn', '1-877-749-83', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Stanley', '1314654@student.hcmus.edu.vn', '0800-212-887', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Alex', '1412778@student.hcmus.edu.vn', '1-855-246-67', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Donald', '1412338@student.hcmus.edu.vn', '0800-862-515', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Bradley', '1314450@student.hcmus.edu.vn', '0800-055-949', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Scarlett', '1412855@student.hcmus.edu.vn', '0800-876-684', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Herman', '1513535@student.hcmus.edu.vn', '1-866-311-92', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Claude', '1313751@student.hcmus.edu.vn', '0800-536-827', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Victoria', '1414668@student.hcmus.edu.vn', '0800-446-023', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Mackenzie', '1411411@student.hcmus.edu.vn', '1-877-739-66', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Fernando', '1315450@student.hcmus.edu.vn', '1-877-320-28', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Fernando', '1413273@student.hcmus.edu.vn', '0800-728-435', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Isabelle', '1615682@student.hcmus.edu.vn', '1-844-486-83', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Darrell', '1511446@student.hcmus.edu.vn', '0800-616-011', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Eric', '1414861@student.hcmus.edu.vn', '0800-224-987', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Gordon', '1514109@student.hcmus.edu.vn', '1-844-732-84', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Ben', '1415224@student.hcmus.edu.vn', '1-844-843-68', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Nelson', '1611116@student.hcmus.edu.vn', '1-855-569-57', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Paisley', '1513221@student.hcmus.edu.vn', '1-866-049-83', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Ronnie', '1411485@student.hcmus.edu.vn', '0800-689-378', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Edward', '1515617@student.hcmus.edu.vn', '0800-824-784', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Makayla', '1413879@student.hcmus.edu.vn', '1-855-460-85', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Gianna', '1512722@student.hcmus.edu.vn', '0800-167-679', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Victor', '1315186@student.hcmus.edu.vn', '0800-583-955', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Alexander', '1413221@student.hcmus.edu.vn', '1-877-432-51', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Makayla', '1611253@student.hcmus.edu.vn', '0800-745-712', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Stella', '1315879@student.hcmus.edu.vn', '0800-386-441', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Aaron', '1313140@student.hcmus.edu.vn', '0800-134-131', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Barry', '1515614@student.hcmus.edu.vn', '1-888-426-31', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Jesus', '1314229@student.hcmus.edu.vn', '0800-630-253', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Ella', '1413955@student.hcmus.edu.vn', '1-888-592-25', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Kenneth', '1414587@student.hcmus.edu.vn', '0800-752-698', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Todd', '1315161@student.hcmus.edu.vn', '0800-711-904', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Mario', '1511750@student.hcmus.edu.vn', '1-855-415-63', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Paisley', '1511243@student.hcmus.edu.vn', '1-855-982-92', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Stanley', '1614778@student.hcmus.edu.vn', '0800-567-226', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Avery', '1513108@student.hcmus.edu.vn', '1-877-640-37', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Sam', '1313726@student.hcmus.edu.vn', '1-844-753-02', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Keith', '1613839@student.hcmus.edu.vn', '1-855-534-37', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Jaime', '1513441@student.hcmus.edu.vn', '0800-679-253', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Francisco', '1415026@student.hcmus.edu.vn', '1-888-319-89', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Jose', '1413726@student.hcmus.edu.vn', '1-866-622-06', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Bobby', '1314615@student.hcmus.edu.vn', '0800-742-101', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Clinton', '1614343@student.hcmus.edu.vn', '0800-870-713', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Roland', '1511485@student.hcmus.edu.vn', '1-844-472-67', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Franklin', '1411227@student.hcmus.edu.vn', '1-866-414-09', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Jesus', '1315367@student.hcmus.edu.vn', '0800-556-449', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Philip', '1513975@student.hcmus.edu.vn', '1-866-585-80', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Joseph', '1615157@student.hcmus.edu.vn', '0800-104-863', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Arthur', '1415756@student.hcmus.edu.vn', '0800-866-738', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Kevin', '1513281@student.hcmus.edu.vn', '1-888-112-31', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Allison', '1613468@student.hcmus.edu.vn', '1-844-461-75', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Leon', '1512267@student.hcmus.edu.vn', '0800-660-213', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Nelson', '1311879@student.hcmus.edu.vn', '0800-422-635', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Perry', '1513750@student.hcmus.edu.vn', '0800-321-471', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Stanley', '1613717@student.hcmus.edu.vn', '1-866-545-33', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Zoe', '1411273@student.hcmus.edu.vn', '1-844-241-20', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Jerry', '1512879@student.hcmus.edu.vn', '0800-170-114', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Manuel', '1312852@student.hcmus.edu.vn', '1-877-136-70', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Jesus', '1513668@student.hcmus.edu.vn', '0800-471-988', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Kylie', '1411143@student.hcmus.edu.vn', '0800-559-383', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Dustin', '1411556@student.hcmus.edu.vn', '0800-025-013', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Joel', '1312452@student.hcmus.edu.vn', '0800-134-038', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Ellie', '1315822@student.hcmus.edu.vn', '0800-491-172', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Perry', '1312855@student.hcmus.edu.vn', '0800-597-223', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Roland', '1513847@student.hcmus.edu.vn', '1-877-616-21', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Lawrence', '1611822@student.hcmus.edu.vn', '0800-659-102', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Terrence', '1314754@student.hcmus.edu.vn', '1-844-475-04', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Michael', '1514026@student.hcmus.edu.vn', '1-844-052-62', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Nicholas', '1412411@student.hcmus.edu.vn', '1-800-395-72', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Wade', '1412042@student.hcmus.edu.vn', '0800-772-398', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Travis', '1311118@student.hcmus.edu.vn', '1-844-573-60', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Wade', '1514587@student.hcmus.edu.vn', '0800-571-105', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Terry', '1613601@student.hcmus.edu.vn', '0800-444-443', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Adalyn', '1413161@student.hcmus.edu.vn', '0800-116-946', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Douglas', '1613636@student.hcmus.edu.vn', '0800-072-135', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Gilbert', '1514879@student.hcmus.edu.vn', '0800-089-619', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Bob', '1313116@student.hcmus.edu.vn', '1-844-218-35', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Phillip', '1513042@student.hcmus.edu.vn', '1-800-495-81', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Roland', '1415143@student.hcmus.edu.vn', '1-866-470-99', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Lonnie', '1314630@student.hcmus.edu.vn', '1-866-478-87', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Marc', '1314682@student.hcmus.edu.vn', '1-888-348-78', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Leo', '1414617@student.hcmus.edu.vn', '1-844-472-33', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Marvin', '1413112@student.hcmus.edu.vn', '0800-851-118', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Douglas', '1415267@student.hcmus.edu.vn', '0800-121-774', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Jorge', '1313143@student.hcmus.edu.vn', '0800-921-939', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Cory', '1414116@student.hcmus.edu.vn', '1-844-865-58', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Avery', '1411143@student.hcmus.edu.vn', '1-877-368-73', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Henry', '1514861@student.hcmus.edu.vn', '0800-598-278', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jason', '1511726@student.hcmus.edu.vn', '0800-408-821', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Maya', '1615108@student.hcmus.edu.vn', '1-855-177-52', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Kenneth', '1311778@student.hcmus.edu.vn', '1-877-428-78', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Aaron', '1412267@student.hcmus.edu.vn', '0800-251-475', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Gene', '1414318@student.hcmus.edu.vn', '1-844-256-57', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Benjamin', '1412224@student.hcmus.edu.vn', '1-855-876-62', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Charlie', '1513435@student.hcmus.edu.vn', '1-866-552-32', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Rodney', '1415186@student.hcmus.edu.vn', '1-855-350-52', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Terrence', '1315556@student.hcmus.edu.vn', '0800-489-552', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Donald', '1311227@student.hcmus.edu.vn', '0800-483-322', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Kaitlyn', '1514754@student.hcmus.edu.vn', '1-844-733-80', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Marc', '1515402@student.hcmus.edu.vn', '0800-587-870', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Peter', '1411861@student.hcmus.edu.vn', '1-866-138-91', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Max', '1311273@student.hcmus.edu.vn', '0800-527-372', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Rodney', '1315719@student.hcmus.edu.vn', '0800-513-483', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Victor', '1415733@student.hcmus.edu.vn', '1-866-105-47', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Lance', '1612988@student.hcmus.edu.vn', '1-800-774-68', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Bobby', '1412587@student.hcmus.edu.vn', '0800-107-142', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Brooklyn', '1312224@student.hcmus.edu.vn', '0800-183-536', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Lance', '1611243@student.hcmus.edu.vn', '0800-194-431', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Javier', '1613843@student.hcmus.edu.vn', '1-877-488-63', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Bradley', '1514617@student.hcmus.edu.vn', '0800-913-459', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Tim', '1412617@student.hcmus.edu.vn', '1-844-571-57', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Travis', '1513654@student.hcmus.edu.vn', '0800-154-812', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Ian', '1415243@student.hcmus.edu.vn', '0800-463-258', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Barry', '1515888@student.hcmus.edu.vn', '1-844-878-76', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Ella', '1613754@student.hcmus.edu.vn', '1-877-625-75', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Eric', '1511879@student.hcmus.edu.vn', '1-800-235-27', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Ray', '1414614@student.hcmus.edu.vn', '0800-764-434', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Aaliyah', '1514227@student.hcmus.edu.vn', '1-866-066-36', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Keira', '1513229@student.hcmus.edu.vn', '0800-258-886', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Antonio', '1412614@student.hcmus.edu.vn', '1-877-634-84', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Kevin', '1515289@student.hcmus.edu.vn', '1-877-918-54', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Wayne', '1412839@student.hcmus.edu.vn', '1-855-576-61', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Victoria', '1315774@student.hcmus.edu.vn', '0800-306-343', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Ellie', '1411435@student.hcmus.edu.vn', '0800-127-291', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Kaitlyn', '1311535@student.hcmus.edu.vn', '1-800-421-05', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Donald', '1311556@student.hcmus.edu.vn', '0800-803-571', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Gilbert', '1313587@student.hcmus.edu.vn', '0800-611-031', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Julian', '1611042@student.hcmus.edu.vn', '0800-378-541', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Ben', '1312026@student.hcmus.edu.vn', '1-877-532-77', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Barry', '1511778@student.hcmus.edu.vn', '0800-265-268', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Clara', '1313378@student.hcmus.edu.vn', '0800-027-982', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Avery', '1612378@student.hcmus.edu.vn', '0800-242-387', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Joel', '1315630@student.hcmus.edu.vn', '0800-933-417', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Jeffery', '1311587@student.hcmus.edu.vn', '1-855-714-13', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Terry', '1612485@student.hcmus.edu.vn', '0800-451-067', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Aaliyah', '1612253@student.hcmus.edu.vn', '0800-572-726', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Jeffery', '1511467@student.hcmus.edu.vn', '1-855-470-61', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Nelson', '1512811@student.hcmus.edu.vn', '0800-535-600', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Arianna', '1512253@student.hcmus.edu.vn', '0800-112-782', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Lawrence', '1515446@student.hcmus.edu.vn', '0800-684-436', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Andy', '1512756@student.hcmus.edu.vn', '0800-735-487', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Olivia', '1311888@student.hcmus.edu.vn', '1-855-658-10', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Nora', '1515411@student.hcmus.edu.vn', '0800-738-007', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Sydney', '1611822@student.hcmus.edu.vn', '0800-069-707', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Dwayne', '1511158@student.hcmus.edu.vn', '1-866-947-32', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Julia', '1415843@student.hcmus.edu.vn', '0800-855-565', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Aaron', '1515843@student.hcmus.edu.vn', '0800-015-091', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Douglas', '1414227@student.hcmus.edu.vn', '1-877-626-46', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Ramon', '1615717@student.hcmus.edu.vn', '1-877-075-04', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Ray', '1511197@student.hcmus.edu.vn', '0800-466-362', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Perry', '1614654@student.hcmus.edu.vn', '1-888-029-32', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Ava', '1411186@student.hcmus.edu.vn', '1-855-531-10', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Curtis', '1511140@student.hcmus.edu.vn', '1-855-888-35', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Ben', '1513186@student.hcmus.edu.vn', '0800-736-628', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Dwayne', '1613086@student.hcmus.edu.vn', '1-844-758-36', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Claire', '1512161@student.hcmus.edu.vn', '0800-251-585', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Clinton', '1611756@student.hcmus.edu.vn', '1-844-597-63', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Alexander', '1311751@student.hcmus.edu.vn', '0800-048-759', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Savannah', '1315289@student.hcmus.edu.vn', '1-866-158-88', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Ken', '1512617@student.hcmus.edu.vn', '0800-021-258', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Bobby', '1512630@student.hcmus.edu.vn', '1-855-170-81', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Ryan', '1313754@student.hcmus.edu.vn', '0800-526-335', bcrypt.hashSync('1512517', 10), 1],
    ['Lopez', 'Sydney', '1315565@student.hcmus.edu.vn', '0800-634-746', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Olivia', '1611617@student.hcmus.edu.vn', '0800-483-859', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Tim', '1314651@student.hcmus.edu.vn', '0800-314-232', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Grace', '1412435@student.hcmus.edu.vn', '1-844-353-63', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Aria', '1315955@student.hcmus.edu.vn', '0800-278-638', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Charlotte', '1314086@student.hcmus.edu.vn', '0800-116-266', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Christopher', '1414646@student.hcmus.edu.vn', '1-844-523-74', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Allan', '1312861@student.hcmus.edu.vn', '1-800-766-55', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Nicholas', '1411263@student.hcmus.edu.vn', '0800-333-718', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Olivia', '1412861@student.hcmus.edu.vn', '1-866-198-26', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Ryan', '1515221@student.hcmus.edu.vn', '1-877-672-54', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Terry', '1512116@student.hcmus.edu.vn', '0800-583-925', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Rodney', '1312441@student.hcmus.edu.vn', '0800-378-121', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Lance', '1314988@student.hcmus.edu.vn', '0800-004-837', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Darrell', '1511636@student.hcmus.edu.vn', '0800-418-515', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Dustin', '1414221@student.hcmus.edu.vn', '0800-275-972', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Larry', '1612147@student.hcmus.edu.vn', '0800-655-152', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Javier', '1312158@student.hcmus.edu.vn', '0800-615-603', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Aaliyah', '1315601@student.hcmus.edu.vn', '1-866-715-47', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Marion', '1514446@student.hcmus.edu.vn', '0800-990-735', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Lauren', '1513806@student.hcmus.edu.vn', '0800-966-173', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Olivia', '1613556@student.hcmus.edu.vn', '1-877-265-53', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Lonnie', '1612535@student.hcmus.edu.vn', '1-888-296-69', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Douglas', '1412446@student.hcmus.edu.vn', '0800-520-056', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Max', '1615879@student.hcmus.edu.vn', '0800-827-787', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Claire', '1415338@student.hcmus.edu.vn', '0800-186-025', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Grace', '1611485@student.hcmus.edu.vn', '1-866-238-04', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Mario', '1614822@student.hcmus.edu.vn', '1-855-491-71', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Kirk', '1413402@student.hcmus.edu.vn', '0800-697-241', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Gilbert', '1615615@student.hcmus.edu.vn', '1-855-863-58', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Ella', '1615617@student.hcmus.edu.vn', '1-800-383-13', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Grace', '1611778@student.hcmus.edu.vn', '1-866-719-23', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Lonnie', '1312263@student.hcmus.edu.vn', '1-844-025-18', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Juan', '1612343@student.hcmus.edu.vn', '1-877-182-51', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Isabelle', '1611035@student.hcmus.edu.vn', '0800-696-794', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Stanley', '1313727@student.hcmus.edu.vn', '1-800-685-70', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Wayne', '1512140@student.hcmus.edu.vn', '0800-977-646', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Arthur', '1513851@student.hcmus.edu.vn', '0800-110-292', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Aaron', '1411158@student.hcmus.edu.vn', '0800-385-682', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Clara', '1414879@student.hcmus.edu.vn', '0800-231-468', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Dan', '1313654@student.hcmus.edu.vn', '0800-097-584', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Emily', '1614955@student.hcmus.edu.vn', '1-844-694-36', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Donald', '1612238@student.hcmus.edu.vn', '1-877-869-34', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Allison', '1415402@student.hcmus.edu.vn', '1-800-235-97', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Dustin', '1614140@student.hcmus.edu.vn', '0800-387-243', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Camilla', '1313853@student.hcmus.edu.vn', '0800-774-514', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Philip', '1314318@student.hcmus.edu.vn', '0800-849-182', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Casey', '1515243@student.hcmus.edu.vn', '0800-064-441', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Jaime', '1515441@student.hcmus.edu.vn', '1-888-851-12', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Gianna', '1611587@student.hcmus.edu.vn', '1-877-465-73', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Natalie', '1314732@student.hcmus.edu.vn', '1-844-321-23', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Henry', '1613158@student.hcmus.edu.vn', '0800-506-462', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Curtis', '1413847@student.hcmus.edu.vn', '0800-784-321', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Jesse', '1611806@student.hcmus.edu.vn', '1-844-085-26', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Matthew', '1314811@student.hcmus.edu.vn', '1-866-367-66', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Jaime', '1514853@student.hcmus.edu.vn', '1-844-948-04', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Javier', '1315026@student.hcmus.edu.vn', '0800-591-336', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Aria', '1313774@student.hcmus.edu.vn', '0800-523-236', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Wayne', '1415822@student.hcmus.edu.vn', '1-800-812-92', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Sam', '1611636@student.hcmus.edu.vn', '1-800-807-67', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Gilbert', '1511587@student.hcmus.edu.vn', '0800-633-657', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jorge', '1412668@student.hcmus.edu.vn', '0800-611-138', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Tim', '1314186@student.hcmus.edu.vn', '1-866-655-95', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Julian', '1312556@student.hcmus.edu.vn', '1-844-502-88', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Ramon', '1513158@student.hcmus.edu.vn', '0800-632-862', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Mario', '1412587@student.hcmus.edu.vn', '0800-796-461', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Matthew', '1414630@student.hcmus.edu.vn', '1-866-017-73', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Bob', '1614843@student.hcmus.edu.vn', '0800-014-817', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Bradley', '1515847@student.hcmus.edu.vn', '0800-571-455', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Nora', '1615221@student.hcmus.edu.vn', '0800-516-215', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Savannah', '1515822@student.hcmus.edu.vn', '1-866-039-69', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Travis', '1514888@student.hcmus.edu.vn', '1-888-367-13', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Sarah', '1312778@student.hcmus.edu.vn', '1-888-544-14', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Mitchell', '1614227@student.hcmus.edu.vn', '1-877-523-86', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Emily', '1315852@student.hcmus.edu.vn', '0800-443-719', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Antonio', '1514157@student.hcmus.edu.vn', '1-877-107-72', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Edward', '1414112@student.hcmus.edu.vn', '0800-340-818', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Barry', '1513778@student.hcmus.edu.vn', '0800-612-261', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Perry', '1312858@student.hcmus.edu.vn', '1-888-481-70', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Claire', '1315143@student.hcmus.edu.vn', '1-844-656-54', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Aria', '1414224@student.hcmus.edu.vn', '1-800-226-72', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Lila', '1612158@student.hcmus.edu.vn', '0800-966-218', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Douglas', '1613682@student.hcmus.edu.vn', '0800-780-807', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Larry', '1514630@student.hcmus.edu.vn', '1-844-678-85', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Ray', '1612565@student.hcmus.edu.vn', '0800-558-810', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Everett', '1412367@student.hcmus.edu.vn', '0800-865-242', bcrypt.hashSync('1512517', 10), 1],
    ['Barnes', 'Allan', '1413197@student.hcmus.edu.vn', '0800-179-513', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Edward', '1313243@student.hcmus.edu.vn', '1-800-551-27', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Todd', '1415617@student.hcmus.edu.vn', '1-877-313-58', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Marvin', '1515294@student.hcmus.edu.vn', '0800-827-943', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Rodney', '1415750@student.hcmus.edu.vn', '0800-858-315', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Isabelle', '1315042@student.hcmus.edu.vn', '0800-575-295', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Eric', '1313267@student.hcmus.edu.vn', '1-877-339-85', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Jose', '1314238@student.hcmus.edu.vn', '1-844-562-54', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Dan', '1315441@student.hcmus.edu.vn', '1-877-347-44', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Bruce', '1412116@student.hcmus.edu.vn', '1-888-557-21', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Terrance', '1612161@student.hcmus.edu.vn', '0800-650-834', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Isabelle', '1512147@student.hcmus.edu.vn', '0800-501-527', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Javier', '1314565@student.hcmus.edu.vn', '0800-397-682', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Allison', '1411617@student.hcmus.edu.vn', '1-888-044-58', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Raul', '1314617@student.hcmus.edu.vn', '1-800-132-68', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Joel', '1515035@student.hcmus.edu.vn', '0800-214-782', bcrypt.hashSync('1512517', 10), 1],
    ['Cruz', 'Clifton', '1315587@student.hcmus.edu.vn', '0800-178-691', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Travis', '1514452@student.hcmus.edu.vn', '1-866-733-68', bcrypt.hashSync('1512517', 10), 1],
    ['Green', 'Ruben', '1415726@student.hcmus.edu.vn', '1-844-741-58', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Lawrence', '1611853@student.hcmus.edu.vn', '0800-581-356', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Camilla', '1514042@student.hcmus.edu.vn', '1-844-221-79', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Erik', '1613450@student.hcmus.edu.vn', '1-866-314-11', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Donald', '1415719@student.hcmus.edu.vn', '0800-509-628', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Michael', '1311750@student.hcmus.edu.vn', '1-877-526-64', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Gene', '1313147@student.hcmus.edu.vn', '1-877-970-63', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Phillip', '1613811@student.hcmus.edu.vn', '1-877-518-89', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Ava', '1415157@student.hcmus.edu.vn', '0800-279-478', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Bruce', '1614452@student.hcmus.edu.vn', '0800-839-338', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Aaliyah', '1412086@student.hcmus.edu.vn', '0800-385-999', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Clara', '1512601@student.hcmus.edu.vn', '1-855-141-15', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Grace', '1315485@student.hcmus.edu.vn', '0800-173-379', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Vivian', '1412227@student.hcmus.edu.vn', '1-866-084-31', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Natalie', '1311955@student.hcmus.edu.vn', '1-877-814-55', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Joseph', '1612587@student.hcmus.edu.vn', '1-855-368-08', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Gilbert', '1311754@student.hcmus.edu.vn', '0800-125-228', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Victoria', '1613727@student.hcmus.edu.vn', '1-800-836-29', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Claude', '1412143@student.hcmus.edu.vn', '1-855-142-71', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Peter', '1312879@student.hcmus.edu.vn', '0800-448-418', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Wayne', '1614186@student.hcmus.edu.vn', '0800-317-733', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Roland', '1411441@student.hcmus.edu.vn', '1-800-777-04', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Brett', '1514535@student.hcmus.edu.vn', '0800-105-873', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Mario', '1313847@student.hcmus.edu.vn', '0800-836-901', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Marc', '1311852@student.hcmus.edu.vn', '0800-148-583', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Lance', '1314722@student.hcmus.edu.vn', '0800-747-474', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Hannah', '1511452@student.hcmus.edu.vn', '1-844-120-86', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Larry', '1612615@student.hcmus.edu.vn', '0800-254-511', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Lauren', '1414143@student.hcmus.edu.vn', '0800-735-045', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Jaime', '1512450@student.hcmus.edu.vn', '1-800-620-57', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Tim', '1314751@student.hcmus.edu.vn', '0800-025-828', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Bradley', '1315636@student.hcmus.edu.vn', '0800-726-381', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Makayla', '1415367@student.hcmus.edu.vn', '1-888-277-38', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Philip', '1411822@student.hcmus.edu.vn', '0800-433-755', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Jacob', '1611221@student.hcmus.edu.vn', '0800-976-629', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Joseph', '1415778@student.hcmus.edu.vn', '1-855-863-31', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Fernando', '1612851@student.hcmus.edu.vn', '0800-577-838', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Charlotte', '1612861@student.hcmus.edu.vn', '0800-131-112', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Gabriel', '1314490@student.hcmus.edu.vn', '0800-466-144', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Joseph', '1513651@student.hcmus.edu.vn', '0800-228-820', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Mark', '1315338@student.hcmus.edu.vn', '1-877-152-37', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Ryan', '1514988@student.hcmus.edu.vn', '1-844-414-25', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Barry', '1414778@student.hcmus.edu.vn', '1-866-577-84', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Roberto', '1515435@student.hcmus.edu.vn', '1-844-319-26', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Brooklyn', '1311294@student.hcmus.edu.vn', '0800-051-631', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Henry', '1611468@student.hcmus.edu.vn', '0800-777-187', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Donald', '1614811@student.hcmus.edu.vn', '0800-252-565', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Dwayne', '1515717@student.hcmus.edu.vn', '1-866-790-71', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Brooklyn', '1414490@student.hcmus.edu.vn', '1-888-395-43', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Lawrence', '1411615@student.hcmus.edu.vn', '0800-831-651', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Ken', '1615839@student.hcmus.edu.vn', '0800-483-317', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Allison', '1613108@student.hcmus.edu.vn', '0800-157-597', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Franklin', '1613615@student.hcmus.edu.vn', '0800-464-651', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Ronnie', '1311855@student.hcmus.edu.vn', '1-800-863-21', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Roberto', '1612267@student.hcmus.edu.vn', '1-800-848-57', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Brooklyn', '1512435@student.hcmus.edu.vn', '0800-263-204', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Antonio', '1615733@student.hcmus.edu.vn', '1-888-538-64', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Marion', '1613751@student.hcmus.edu.vn', '1-888-218-62', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Bob', '1411147@student.hcmus.edu.vn', '1-888-432-39', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Terry', '1415727@student.hcmus.edu.vn', '0800-521-789', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Aria', '1415668@student.hcmus.edu.vn', '1-866-725-24', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Julia', '1513112@student.hcmus.edu.vn', '0800-727-234', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Gene', '1613378@student.hcmus.edu.vn', '1-844-116-12', bcrypt.hashSync('1512517', 10), 1],
    ['Martinez', 'Ruben', '1311161@student.hcmus.edu.vn', '0800-347-493', bcrypt.hashSync('1512517', 10), 1],
    ['Miller', 'Jerome', '1412109@student.hcmus.edu.vn', '1-866-622-81', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Lila', '1313617@student.hcmus.edu.vn', '1-866-931-31', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Michael', '1515852@student.hcmus.edu.vn', '0800-864-208', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Lillian', '1615614@student.hcmus.edu.vn', '1-866-432-64', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Matthew', '1615811@student.hcmus.edu.vn', '0800-519-323', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Violet', '1615727@student.hcmus.edu.vn', '0800-398-649', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Hailey', '1413490@student.hcmus.edu.vn', '0800-654-312', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Lauren', '1414727@student.hcmus.edu.vn', '1-855-716-96', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Julia', '1511617@student.hcmus.edu.vn', '0800-056-736', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Henry', '1315614@student.hcmus.edu.vn', '0800-120-237', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Sydney', '1611614@student.hcmus.edu.vn', '1-877-637-35', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Gordon', '1414367@student.hcmus.edu.vn', '0800-572-856', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Brett', '1314843@student.hcmus.edu.vn', '0800-522-844', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Alexander', '1412253@student.hcmus.edu.vn', '0800-333-311', bcrypt.hashSync('1512517', 10), 1],
    ['Evans', 'Jerry', '1613411@student.hcmus.edu.vn', '1-855-470-67', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Gilbert', '1615318@student.hcmus.edu.vn', '1-844-986-57', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Max', '1515975@student.hcmus.edu.vn', '1-866-211-85', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Ella', '1314617@student.hcmus.edu.vn', '0800-112-855', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Gene', '1411042@student.hcmus.edu.vn', '0800-118-537', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Franklin', '1313490@student.hcmus.edu.vn', '1-888-614-16', bcrypt.hashSync('1512517', 10), 1],
    ['Bailey', 'Lance', '1313108@student.hcmus.edu.vn', '1-800-671-50', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Kaitlyn', '1612630@student.hcmus.edu.vn', '1-877-663-02', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Stanley', '1411843@student.hcmus.edu.vn', '0800-876-211', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Emily', '1311774@student.hcmus.edu.vn', '1-855-145-85', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Armando', '1313732@student.hcmus.edu.vn', '0800-310-347', bcrypt.hashSync('1512517', 10), 1],
    ['Ramirez', 'Mitchell', '1415852@student.hcmus.edu.vn', '0800-137-873', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Nicholas', '1512806@student.hcmus.edu.vn', '0800-198-251', bcrypt.hashSync('1512517', 10), 1],
    ['Morris', 'Grace', '1514587@student.hcmus.edu.vn', '1-844-633-16', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Terrence', '1413778@student.hcmus.edu.vn', '0800-244-592', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Tim', '1513485@student.hcmus.edu.vn', '0800-314-313', bcrypt.hashSync('1512517', 10), 1],
    ['White', 'Johnnie', '1414822@student.hcmus.edu.vn', '1-800-076-31', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Terrence', '1515086@student.hcmus.edu.vn', '1-800-451-28', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Hannah', '1513988@student.hcmus.edu.vn', '0800-175-968', bcrypt.hashSync('1512517', 10), 1],
    ['Moore', 'Douglas', '1315651@student.hcmus.edu.vn', '0800-946-431', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Ellie', '1615847@student.hcmus.edu.vn', '1-888-625-82', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Clifton', '1615112@student.hcmus.edu.vn', '0800-509-346', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Terrance', '1611955@student.hcmus.edu.vn', '0800-691-369', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Nelson', '1313026@student.hcmus.edu.vn', '0800-185-317', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Cory', '1411267@student.hcmus.edu.vn', '1-888-304-73', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Wayne', '1613750@student.hcmus.edu.vn', '0800-824-628', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Ruben', '1313843@student.hcmus.edu.vn', '0800-214-906', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Jesus', '1314367@student.hcmus.edu.vn', '0800-141-337', bcrypt.hashSync('1512517', 10), 1],
    ['Davis', 'Keira', '1414294@student.hcmus.edu.vn', '0800-391-844', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Marc', '1613858@student.hcmus.edu.vn', '1-877-304-18', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Johnnie', '1314750@student.hcmus.edu.vn', '1-866-442-29', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Nicholas', '1415273@student.hcmus.edu.vn', '0800-494-259', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Alex', '1612224@student.hcmus.edu.vn', '0800-817-601', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Sydney', '1412318@student.hcmus.edu.vn', '0800-756-516', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Allison', '1515719@student.hcmus.edu.vn', '0800-745-322', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Kirk', '1412888@student.hcmus.edu.vn', '0800-679-555', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Terrence', '1515118@student.hcmus.edu.vn', '1-866-546-22', bcrypt.hashSync('1512517', 10), 1],
    ['Allen', 'Gilbert', '1311450@student.hcmus.edu.vn', '0800-185-138', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Fernando', '1411343@student.hcmus.edu.vn', '0800-038-041', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Jerome', '1314614@student.hcmus.edu.vn', '0800-714-222', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Emily', '1512617@student.hcmus.edu.vn', '0800-134-577', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Antonio', '1412988@student.hcmus.edu.vn', '0800-785-542', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Larry', '1514289@student.hcmus.edu.vn', '0800-063-990', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Robert', '1615485@student.hcmus.edu.vn', '1-866-653-44', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Ryan', '1413467@student.hcmus.edu.vn', '1-800-617-15', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Stella', '1513289@student.hcmus.edu.vn', '1-844-993-57', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Gianna', '1514682@student.hcmus.edu.vn', '0800-181-203', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Julia', '1315751@student.hcmus.edu.vn', '0800-885-447', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Joseph', '1412343@student.hcmus.edu.vn', '1-866-316-68', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Aria', '1411367@student.hcmus.edu.vn', '0800-965-744', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Gabriel', '1311157@student.hcmus.edu.vn', '0800-227-608', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Javier', '1612719@student.hcmus.edu.vn', '0800-745-323', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Max', '1611238@student.hcmus.edu.vn', '0800-548-185', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Benjamin', '1512378@student.hcmus.edu.vn', '1-844-122-87', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Victor', '1614636@student.hcmus.edu.vn', '0800-722-748', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Andy', '1315855@student.hcmus.edu.vn', '1-888-814-23', bcrypt.hashSync('1512517', 10), 1],
    ['Sanders', 'Erik', '1512888@student.hcmus.edu.vn', '1-855-485-48', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Fernando', '1615822@student.hcmus.edu.vn', '1-877-265-92', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Terry', '1412853@student.hcmus.edu.vn', '0800-582-677', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Todd', '1615820@student.hcmus.edu.vn', '0800-861-351', bcrypt.hashSync('1512517', 10), 1],
    ['Foster', 'Stella', '1414839@student.hcmus.edu.vn', '1-855-637-53', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Max', '1312109@student.hcmus.edu.vn', '0800-751-804', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Victoria', '1515367@student.hcmus.edu.vn', '0800-683-163', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Gordon', '1612197@student.hcmus.edu.vn', '0800-515-131', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Alex', '1413227@student.hcmus.edu.vn', '0800-953-436', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Matthew', '1312116@student.hcmus.edu.vn', '1-844-554-79', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Franklin', '1613343@student.hcmus.edu.vn', '0800-428-762', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Matthew', '1513822@student.hcmus.edu.vn', '0800-438-808', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Stella', '1612852@student.hcmus.edu.vn', '0800-243-470', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Donald', '1414109@student.hcmus.edu.vn', '0800-481-141', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Kenneth', '1413318@student.hcmus.edu.vn', '0800-500-883', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Gabriel', '1611108@student.hcmus.edu.vn', '1-866-186-09', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Ian', '1411822@student.hcmus.edu.vn', '1-877-785-40', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Claude', '1412112@student.hcmus.edu.vn', '0800-282-581', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Juan', '1413343@student.hcmus.edu.vn', '0800-325-255', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Violet', '1514158@student.hcmus.edu.vn', '1-844-662-81', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Sam', '1513754@student.hcmus.edu.vn', '0800-629-828', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Charlie', '1312535@student.hcmus.edu.vn', '1-866-410-07', bcrypt.hashSync('1512517', 10), 1],
    ['Butler', 'Robert', '1611852@student.hcmus.edu.vn', '0800-932-408', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Max', '1514450@student.hcmus.edu.vn', '0800-301-378', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Nicholas', '1612717@student.hcmus.edu.vn', '0800-631-003', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Vivian', '1515732@student.hcmus.edu.vn', '0800-252-425', bcrypt.hashSync('1512517', 10), 1],
    ['Clark', 'Gordon', '1512186@student.hcmus.edu.vn', '0800-240-610', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Paisley', '1513197@student.hcmus.edu.vn', '1-866-260-33', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Johnnie', '1415490@student.hcmus.edu.vn', '0800-513-023', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Kenneth', '1611565@student.hcmus.edu.vn', '1-877-202-73', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Francisco', '1314468@student.hcmus.edu.vn', '0800-512-081', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Ava', '1312446@student.hcmus.edu.vn', '0800-882-133', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Jerome', '1514318@student.hcmus.edu.vn', '1-888-012-36', bcrypt.hashSync('1512517', 10), 1],
    ['Nelson', 'Ryan', '1411452@student.hcmus.edu.vn', '1-844-775-08', bcrypt.hashSync('1512517', 10), 1],
    ['Fisher', 'Armando', '1615035@student.hcmus.edu.vn', '0800-660-523', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Barry', '1315535@student.hcmus.edu.vn', '0800-541-134', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Darryl', '1413733@student.hcmus.edu.vn', '0800-522-366', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Larry', '1313402@student.hcmus.edu.vn', '0800-299-868', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Arthur', '1614273@student.hcmus.edu.vn', '1-844-987-75', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Joseph', '1511157@student.hcmus.edu.vn', '1-844-634-04', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Ray', '1515468@student.hcmus.edu.vn', '0800-742-577', bcrypt.hashSync('1512517', 10), 1],
    ['Richardson', 'Everett', '1315717@student.hcmus.edu.vn', '1-844-710-71', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Paisley', '1613851@student.hcmus.edu.vn', '0800-948-556', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Larry', '1312955@student.hcmus.edu.vn', '1-866-373-96', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Travis', '1612853@student.hcmus.edu.vn', '0800-616-388', bcrypt.hashSync('1512517', 10), 1],
    ['Russell', 'Curtis', '1513086@student.hcmus.edu.vn', '0800-037-634', bcrypt.hashSync('1512517', 10), 1],
    ['Morales', 'Jacob', '1611367@student.hcmus.edu.vn', '0800-223-435', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Andy', '1313722@student.hcmus.edu.vn', '0800-584-741', bcrypt.hashSync('1512517', 10), 1],
    ['Anderson', 'Keith', '1412858@student.hcmus.edu.vn', '0800-848-526', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Sarah', '1414118@student.hcmus.edu.vn', '1-877-869-59', bcrypt.hashSync('1512517', 10), 1],
    ['Phillips', 'Victoria', '1314112@student.hcmus.edu.vn', '1-844-816-93', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Kylie', '1515108@student.hcmus.edu.vn', '0800-158-496', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Benjamin', '1613112@student.hcmus.edu.vn', '0800-714-588', bcrypt.hashSync('1512517', 10), 1],
    ['Turner', 'Julian', '1411751@student.hcmus.edu.vn', '1-844-331-27', bcrypt.hashSync('1512517', 10), 1],
    ['Brown', 'Bob', '1414556@student.hcmus.edu.vn', '1-800-637-69', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Ellie', '1511614@student.hcmus.edu.vn', '0800-878-373', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Bobby', '1511112@student.hcmus.edu.vn', '1-800-664-18', bcrypt.hashSync('1512517', 10), 1],
    ['Murphy', 'Aaliyah', '1514733@student.hcmus.edu.vn', '1-855-945-35', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Larry', '1412651@student.hcmus.edu.vn', '0800-231-824', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Bob', '1613485@student.hcmus.edu.vn', '1-855-026-16', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Ray', '1612722@student.hcmus.edu.vn', '0800-544-076', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Salvador', '1613820@student.hcmus.edu.vn', '1-844-388-33', bcrypt.hashSync('1512517', 10), 1],
    ['Gomez', 'Bob', '1611446@student.hcmus.edu.vn', '1-844-816-63', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Jerome', '1515042@student.hcmus.edu.vn', '1-844-881-71', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Clara', '1413485@student.hcmus.edu.vn', '1-855-232-81', bcrypt.hashSync('1512517', 10), 1],
    ['Collins', 'Alexander', '1515143@student.hcmus.edu.vn', '1-877-664-30', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Nicholas', '1512343@student.hcmus.edu.vn', '1-877-617-35', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Armando', '1415587@student.hcmus.edu.vn', '1-888-434-32', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Cory', '1513733@student.hcmus.edu.vn', '1-877-251-25', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Leon', '1414411@student.hcmus.edu.vn', '1-877-307-83', bcrypt.hashSync('1512517', 10), 1],
    ['Cook', 'Travis', '1511646@student.hcmus.edu.vn', '1-844-870-36', bcrypt.hashSync('1512517', 10), 1],
    ['Perry', 'Ramon', '1514411@student.hcmus.edu.vn', '1-866-185-73', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Keith', '1613485@student.hcmus.edu.vn', '1-877-645-14', bcrypt.hashSync('1512517', 10), 1],
    ['Roberts', 'Franklin', '1314108@student.hcmus.edu.vn', '0800-686-533', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Joseph', '1415861@student.hcmus.edu.vn', '0800-781-116', bcrypt.hashSync('1512517', 10), 1],
    ['Wood', 'Sam', '1314822@student.hcmus.edu.vn', '1-888-424-28', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Jorge', '1412221@student.hcmus.edu.vn', '1-877-755-06', bcrypt.hashSync('1512517', 10), 1],
    ['Hughes', 'Casey', '1411450@student.hcmus.edu.vn', '1-855-570-72', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Brett', '1413682@student.hcmus.edu.vn', '1-855-884-59', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Bruce', '1313820@student.hcmus.edu.vn', '1-888-302-61', bcrypt.hashSync('1512517', 10), 1],
    ['Howard', 'Brett', '1414186@student.hcmus.edu.vn', '0800-799-465', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Wade', '1414843@student.hcmus.edu.vn', '1-855-933-45', bcrypt.hashSync('1512517', 10), 1],
    ['Sullivan', 'Savannah', '1614143@student.hcmus.edu.vn', '1-877-416-14', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Darrell', '1613822@student.hcmus.edu.vn', '0800-069-179', bcrypt.hashSync('1512517', 10), 1],
    ['Harris', 'Sarah', '1411238@student.hcmus.edu.vn', '0800-297-176', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Lila', '1314157@student.hcmus.edu.vn', '1-855-663-49', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Julia', '1314822@student.hcmus.edu.vn', '1-855-986-75', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Lonnie', '1612289@student.hcmus.edu.vn', '0800-314-452', bcrypt.hashSync('1512517', 10), 1],
    ['Wilson', 'Jerome', '1611843@student.hcmus.edu.vn', '0800-099-720', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Bobby', '1514556@student.hcmus.edu.vn', '0800-649-487', bcrypt.hashSync('1512517', 10), 1],
    ['Rodriguez', 'Ernest', '1515722@student.hcmus.edu.vn', '0800-647-148', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Mitchell', '1511732@student.hcmus.edu.vn', '0800-050-930', bcrypt.hashSync('1512517', 10), 1],
    ['Myers', 'Marvin', '1612756@student.hcmus.edu.vn', '0800-113-674', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Ronnie', '1311726@student.hcmus.edu.vn', '1-888-176-18', bcrypt.hashSync('1512517', 10), 1],
    ['Bennett', 'Marvin', '1315861@student.hcmus.edu.vn', '1-855-919-20', bcrypt.hashSync('1512517', 10), 1],
    ['Flores', 'Franklin', '1413806@student.hcmus.edu.vn', '0800-907-825', bcrypt.hashSync('1512517', 10), 1],
    ['Diaz', 'Clifton', '1314227@student.hcmus.edu.vn', '0800-281-233', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Joel', '1611157@student.hcmus.edu.vn', '1-800-784-72', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Lillian', '1611861@student.hcmus.edu.vn', '0800-844-188', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Natalie', '1413888@student.hcmus.edu.vn', '1-800-807-49', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Lauren', '1513267@student.hcmus.edu.vn', '1-888-647-57', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Leon', '1412601@student.hcmus.edu.vn', '1-877-351-54', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Kevin', '1514273@student.hcmus.edu.vn', '1-888-264-78', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Ken', '1611273@student.hcmus.edu.vn', '0800-114-832', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Avery', '1415601@student.hcmus.edu.vn', '0800-151-384', bcrypt.hashSync('1512517', 10), 1],
    ['Brooks', 'Roland', '1614852@student.hcmus.edu.vn', '1-877-577-18', bcrypt.hashSync('1512517', 10), 1],
    ['Gray', 'Eric', '1512273@student.hcmus.edu.vn', '1-800-707-56', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Terry', '1511143@student.hcmus.edu.vn', '0800-742-676', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Philip', '1615238@student.hcmus.edu.vn', '0800-576-857', bcrypt.hashSync('1512517', 10), 1],
    ['Cox', 'Rodney', '1413186@student.hcmus.edu.vn', '1-855-675-30', bcrypt.hashSync('1512517', 10), 1],
    ['Jackson', 'Claude', '1515988@student.hcmus.edu.vn', '0800-697-145', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Keira', '1615534@student.hcmus.edu.vn', '0800-763-212', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Allison', '1512197@student.hcmus.edu.vn', '1-866-925-81', bcrypt.hashSync('1512517', 10), 1],
    ['Jones', 'Adalyn', '1611112@student.hcmus.edu.vn', '1-844-923-73', bcrypt.hashSync('1512517', 10), 1],
    ['Powell', 'Dustin', '1413452@student.hcmus.edu.vn', '1-844-153-12', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Gilbert', '1314851@student.hcmus.edu.vn', '0800-185-251', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Antonio', '1514858@student.hcmus.edu.vn', '1-877-095-96', bcrypt.hashSync('1512517', 10), 1],
    ['Reyes', 'Dustin', '1414147@student.hcmus.edu.vn', '1-877-780-61', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Juan', '1515338@student.hcmus.edu.vn', '1-855-250-13', bcrypt.hashSync('1512517', 10), 1],
    ['Smith', 'Darryl', '1613435@student.hcmus.edu.vn', '0800-727-086', bcrypt.hashSync('1512517', 10), 1],
    ['Ortiz', 'Kirk', '1413630@student.hcmus.edu.vn', '1-877-330-17', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Wade', '1614733@student.hcmus.edu.vn', '1-844-960-97', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Emily', '1314861@student.hcmus.edu.vn', '0800-628-533', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Dwayne', '1615778@student.hcmus.edu.vn', '1-866-152-67', bcrypt.hashSync('1512517', 10), 1],
    ['Rivera', 'Terrence', '1511273@student.hcmus.edu.vn', '0800-737-181', bcrypt.hashSync('1512517', 10), 1],
    ['Price', 'Wayne', '1515273@student.hcmus.edu.vn', '1-855-697-23', bcrypt.hashSync('1512517', 10), 1],
    ['Parker', 'Claire', '1611617@student.hcmus.edu.vn', '1-844-439-46', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Cory', '1611450@student.hcmus.edu.vn', '0800-120-254', bcrypt.hashSync('1512517', 10), 1],
    ['Wright', 'Terrance', '1512751@student.hcmus.edu.vn', '0800-427-979', bcrypt.hashSync('1512517', 10), 1],
    ['Nguyen', 'Roberto', '1413614@student.hcmus.edu.vn', '1-844-676-15', bcrypt.hashSync('1512517', 10), 1],
    ['Scott', 'Nora', '1613587@student.hcmus.edu.vn', '0800-564-345', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Bradley', '1414450@student.hcmus.edu.vn', '0800-220-154', bcrypt.hashSync('1512517', 10), 1],
    ['Cooper', 'Armando', '1312112@student.hcmus.edu.vn', '1-800-488-45', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Olivia', '1515822@student.hcmus.edu.vn', '1-877-271-79', bcrypt.hashSync('1512517', 10), 1],
    ['Campbell', 'Zoe', '1412378@student.hcmus.edu.vn', '1-855-368-22', bcrypt.hashSync('1512517', 10), 1],
    ['Bell', 'Ronnie', '1614756@student.hcmus.edu.vn', '0800-320-720', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Gilbert', '1311468@student.hcmus.edu.vn', '1-866-798-94', bcrypt.hashSync('1512517', 10), 1],
    ['Morgan', 'Ken', '1612654@student.hcmus.edu.vn', '1-877-124-23', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Clinton', '1612143@student.hcmus.edu.vn', '0800-674-797', bcrypt.hashSync('1512517', 10), 1],
    ['Robinson', 'Ellie', '1611411@student.hcmus.edu.vn', '0800-752-237', bcrypt.hashSync('1512517', 10), 1],
    ['Kelly', 'Everett', '1514654@student.hcmus.edu.vn', '0800-673-225', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Alex', '1411109@student.hcmus.edu.vn', '1-844-236-14', bcrypt.hashSync('1512517', 10), 1],
    ['Lewis', 'Dan', '1311026@student.hcmus.edu.vn', '0800-400-748', bcrypt.hashSync('1512517', 10), 1],
    ['Young', 'Jaime', '1415468@student.hcmus.edu.vn', '1-844-724-62', bcrypt.hashSync('1512517', 10), 1],
    ['Carter', 'Camilla', '1313186@student.hcmus.edu.vn', '1-866-403-22', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Camilla', '1413157@student.hcmus.edu.vn', '0800-727-571', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Gordon', '1513751@student.hcmus.edu.vn', '1-855-865-74', bcrypt.hashSync('1512517', 10), 1],
    ['Thomas', 'Herman', '1614042@student.hcmus.edu.vn', '1-855-973-88', bcrypt.hashSync('1512517', 10), 1],
    ['Gonzalez', 'Jason', '1415197@student.hcmus.edu.vn', '1-866-152-15', bcrypt.hashSync('1512517', 10), 1],
    ['Martin', 'Grace', '1515851@student.hcmus.edu.vn', '1-855-242-08', bcrypt.hashSync('1512517', 10), 1],
    ['Thompson', 'Kirk', '1311988@student.hcmus.edu.vn', '0800-419-845', bcrypt.hashSync('1512517', 10), 1],
    ['Ross', 'Aaliyah', '1613861@student.hcmus.edu.vn', '1-800-751-06', bcrypt.hashSync('1512517', 10), 1],
    ['Ward', 'Victoria', '1512719@student.hcmus.edu.vn', '1-888-786-31', bcrypt.hashSync('1512517', 10), 1],
    ['Hill', 'Johnnie', '1614975@student.hcmus.edu.vn', '1-855-451-70', bcrypt.hashSync('1512517', 10), 1],
    ['Sanchez', 'Jesse', '1512858@student.hcmus.edu.vn', '1-844-856-79', bcrypt.hashSync('1512517', 10), 1],
    ['Mitchell', 'Olivia', '1312161@student.hcmus.edu.vn', '0800-423-516', bcrypt.hashSync('1512517', 10), 1],
    ['Reed', 'Darryl', '1312467@student.hcmus.edu.vn', '0800-925-168', bcrypt.hashSync('1512517', 10), 1],
    ['Williams', 'Alex', '1614806@student.hcmus.edu.vn', '1-877-119-22', bcrypt.hashSync('1512517', 10), 1],
    ['Garcia', 'Antonio', '1415587@student.hcmus.edu.vn', '0800-534-354', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Marvin', '1511147@student.hcmus.edu.vn', '0800-956-423', bcrypt.hashSync('1512517', 10), 1],
    ['Torres', 'Robert', '1313646@student.hcmus.edu.vn', '1-855-115-21', bcrypt.hashSync('1512517', 10), 1],
    ['Gutierrez', 'Bob', '1615143@student.hcmus.edu.vn', '0800-141-141', bcrypt.hashSync('1512517', 10), 1],
    ['Stewart', 'Ava', '1312822@student.hcmus.edu.vn', '0800-443-313', bcrypt.hashSync('1512517', 10), 1],
    ['Lee', 'Manuel', '1512682@student.hcmus.edu.vn', '0800-424-400', bcrypt.hashSync('1512517', 10), 1],
    ['Peterson', 'Ramon', '1615229@student.hcmus.edu.vn', '0800-425-352', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Claire', '1515879@student.hcmus.edu.vn', '0800-730-711', bcrypt.hashSync('1512517', 10), 1],
    ['Hall', 'Curtis', '1611343@student.hcmus.edu.vn', '0800-114-764', bcrypt.hashSync('1512517', 10), 1],
    ['Watson', 'Leon', '1615853@student.hcmus.edu.vn', '1-877-116-21', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Ian', '1513839@student.hcmus.edu.vn', '0800-201-735', bcrypt.hashSync('1512517', 10), 1],
    ['Edwards', 'Mitchell', '1515955@student.hcmus.edu.vn', '1-800-881-54', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Franklin', '1511435@student.hcmus.edu.vn', '1-877-466-14', bcrypt.hashSync('1512517', 10), 1],
    ['Taylor', 'Javier', '1613732@student.hcmus.edu.vn', '1-844-823-25', bcrypt.hashSync('1512517', 10), 1],
    ['Hernandez', 'Jerry', '1315750@student.hcmus.edu.vn', '1-877-857-97', bcrypt.hashSync('1512517', 10), 1],
    ['Adams', 'Nelson', '1311617@student.hcmus.edu.vn', '1-877-454-74', bcrypt.hashSync('1512517', 10), 1],
    ['King', 'Salvador', '1514338@student.hcmus.edu.vn', '1-855-666-24', bcrypt.hashSync('1512517', 10), 1],
    ['Baker', 'Ian', '1312732@student.hcmus.edu.vn', '1-877-513-98', bcrypt.hashSync('1512517', 10), 1],
    ['James', 'Aaron', '1312888@student.hcmus.edu.vn', '0800-814-821', bcrypt.hashSync('1512517', 10), 1],
    ['Jenkins', 'Lauren', '1613109@student.hcmus.edu.vn', '0800-473-153', bcrypt.hashSync('1512517', 10), 1],
    ['Johnson', 'Clinton', '1311727@student.hcmus.edu.vn', '1-866-042-38', bcrypt.hashSync('1512517', 10), 1],
    ['Walker', 'Nora', '1613267@student.hcmus.edu.vn', '1-800-418-19', bcrypt.hashSync('1512517', 10), 1],
    ['Perez', 'Raul', '1313587@student.hcmus.edu.vn', '1-888-804-47', bcrypt.hashSync('1512517', 10), 1],
    ['Rogers', 'Benjamin', '1314224@student.hcmus.edu.vn', '0800-289-234', bcrypt.hashSync('1512517', 10), 1],
    ['Long', 'Ernest', '1515229@student.hcmus.edu.vn', '1-877-355-62', bcrypt.hashSync('1512517', 10), 1],
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
    [null, null, 'Phòng học kém chất lượng', 'Máy lạnh nóng quớ',                         2, 3, false, false],//1
    [171,     1, 'Thầy dạy quá nhanh',       'Thầy có thể dạy chậm lại cho em dễ hiểu ?', 1,1, false, false],//2
    [171,  null, 'Ổ điện hỏng',              'Ổ điện dãy giữa phòng I44 bị hỏng',         2,1, true, true],//3
    [171,  null, 'Lớp 13CLC hư',             'Lớp 13CLC nói chuyện quá nhiều trong giờ',  1,1, true, true],//4
    [null, null, 'Phòng học chất lượng thấp','Khong co may lanh',                         2,3, false, false],//5
    [171,     1, 'Thầy dạy quá khó hiểu',    'Thầy có thể dạy chậm lại cho em dễ hiểu ?',  1,1, false, false],//6
    [171,     2, 'Cô hay đến lớp trễ',       'Tóc mới của cô làm em khó tập trung quá!',  1,1, false, false],//7
    [1,    null, 'Ổ điện không mở được',     'Cô hãy fix giúp tụi em',                    2,1, true, true],//8
    [1,    null, 'Lớp 13CLC cúp học cả lớp', 'Lớp 13CLC nói chuyện quá ',                 1,1, true, true]//9
];
//[title, class_has_course_id, created_by,is_template]
var insert_quiz = [
    ['KTLT tuần 1', 20, 1, 1], //1
];
//[quiz_id, text, option_a, option_b, option_c, option_d, correct_option, timer]
var insert_quiz_question = [
    [1, `Kiểu nào có kích thước lớn nhất`,'int','char','long','double','double',10], //1
    [1, `Dạng hậu tố của biểu thức 9 - (5 + 2) là ?`,'95-+2','95-2+','952+-','95+2-','952+-',10], //2
    [1, `Giả sử a và b là hai số thực. Biểu thức nào dưới đây là không được phép theo cú pháp của ngôn ngữ lập trình C?`,'ab','a-=b','a>>=b','a*=b','a>>=b',10],//3
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
    [null,1, `Đinh Bá Tiến sent you a feedback`,5,_global.notification_type.sent_feedback], //1
];

var seeding_postgres = function(res) {
    pool_postgres.connect(function(error, connection, done) {
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO roles (name) VALUES %L', insert_roles), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO semesters (name,start_date,end_date,vacation_time) VALUES %L', insert_semesters), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO programs (name,code) VALUES %L', insert_programs), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO classes (name,email,program_id) VALUES %L', insert_classes), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO courses (code,name,semester_id,program_id,office_hour,note) VALUES %L', insert_courses), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO class_has_course (class_id,course_id,schedules) VALUES %L', insert_class_has_course), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_users), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO teacher_teach_course (teacher_id,course_id,teacher_role) VALUES %L', insert_teacher_teach_course), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', insert_students), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO student_enroll_course (class_has_course_id,student_id) VALUES %L', insert_student_enroll_course), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO absence_requests (student_id, reason, start_date, end_date) VALUES %L', insert_absence_requests), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO attendance (course_id,class_id,closed) VALUES %L', insert_attendance), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO attendance_detail (attendance_id, student_id, attendance_type) VALUES %L', insert_attendance_detail), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO feedbacks (from_id, to_id, title, content, category, type, read, replied) VALUES %L', insert_feeback), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO quiz (title, class_has_course_id, created_by, is_template) VALUES %L', insert_quiz), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO quiz_questions (quiz_id, text, option_a, option_b, option_c, option_d, correct_option, timer) VALUES %L', insert_quiz_question), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO quiz_answers (quiz_question_id, selected_option ,answered_by) VALUES %L', insert_quiz_answer), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO notifications (to_id,from_id, message ,object_id, type) VALUES %L', insert_notifications), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
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
var seeding_admin = function(res) {
    pool_postgres.connect(function(error, connection, done) {
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO roles (name) VALUES %L', insert_roles), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L', insert_admin), function(error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
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
router.get('/', function(req, res, next) {
    //seeding_mysql(res);
    seeding_postgres(res);
});
router.get('/admin', function(req, res, next) {
    //seeding_mysql(res);
    seeding_admin(res);
});
module.exports = router;
