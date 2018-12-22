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
var students9=[
    [1263, '1311587', 8],
    [1264, '1612485', 1],
    [1265, '1612253', 1],
    [1266, '1511467', 6],
    [1267, '1512811', 2],
    [1268, '1512253', 2],
    [1269, '1515446', 18],
    [1270, '1512756', 2],
    [1271, '1311888', 8],
    [1272, '1515411', 18],
    [1273, '1611822', 5],
    [1274, '1511158', 6],
    [1275, '1415843', 19],
    [1276, '1515843', 18],
    [1277, '1414227', 15],
    [1278, '1615717', 17],
    [1279, '1511197', 6],
    [1280, '1614654', 13],
    [1281, '1411186', 7],
    [1282, '1511140', 6],
    [1283, '1513186', 10],
    [1284, '1613086', 9],
    [1285, '1512161', 2],
    [1286, '1611756', 5],
    [1287, '1311751', 8],
    [1288, '1315289', 20],
    [1289, '1512617', 2],
    [1290, '1512630', 2],
    [1291, '1313754', 12],
    [1292, '1315565', 20],
    [1293, '1611617', 5],
    [1294, '1314651', 16],
    [1295, '1412435', 3],
    [1296, '1315955', 20],
    [1297, '1314086', 16],
    [1298, '1414646', 15],
    [1299, '1312861', 4],
    [1300, '1411263', 7],
    [1301, '1412861', 3],
    [1302, '1515221', 18],
    [1303, '1512116', 2],
    [1304, '1312441', 4],
    [1305, '1314988', 16],
    [1306, '1511636', 6],
    [1307, '1414221', 15],
    [1308, '1612147', 1],
    [1309, '1312158', 4],
    [1310, '1315601', 20],
    [1311, '1514446', 14],
    [1312, '1513806', 10],
    [1313, '1613556', 9],
    [1314, '1612535', 1],
    [1315, '1412446', 3],
    [1316, '1615879', 17],
    [1317, '1415338', 19],
    [1318, '1611485', 5],
    [1319, '1614822', 13],
    [1320, '1413402', 11],
    [1321, '1615615', 17],
    [1322, '1615617', 17],
    [1323, '1611778', 5],
    [1324, '1312263', 4],
    [1325, '1612343', 1],
    [1326, '1611035', 5],
    [1327, '1313727', 12],
    [1328, '1512140', 2],
    [1329, '1513851', 10],
    [1330, '1411158', 7],
    [1331, '1414879', 15],
    [1332, '1313654', 12],
    [1333, '1614955', 13],
    [1334, '1612238', 1],
    [1335, '1415402', 19],
    [1336, '1614140', 13],
    [1337, '1313853', 12],
    [1338, '1314318', 16],
    [1339, '1515243', 18],
    [1340, '1515441', 18],
    [1341, '1611587', 5],
    [1342, '1314732', 16],
    [1343, '1613158', 9],
    [1344, '1413847', 11],
    [1345, '1611806', 5],
    [1346, '1314811', 16],
    [1347, '1514853', 14],
    [1348, '1315026', 20],
    [1349, '1313774', 12],
    [1350, '1415822', 19],
    [1351, '1611636', 5],
    [1352, '1511587', 6],
    [1353, '1412668', 3],
    [1354, '1314186', 16],
    [1355, '1312556', 4],
    [1356, '1513158', 10],
    [1357, '1412587', 3],
    [1358, '1414630', 15],
    [1359, '1614843', 13],
    [1360, '1515847', 18],
    [1361, '1615221', 17],
    [1362, '1515822', 18],
    [1363, '1514888', 14],
    [1364, '1312778', 4],
    [1365, '1614227', 13],
    [1366, '1315852', 20],
    [1367, '1514157', 14],
    [1368, '1414112', 15],
    [1369, '1513778', 10],
    [1370, '1312858', 4],
    [1371, '1315143', 20],
    [1372, '1414224', 15],
    [1373, '1612158', 1],
    [1374, '1613682', 9],
    [1375, '1514630', 14],
    [1376, '1612565', 1],
    [1377, '1412367', 3],
    [1378, '1413197', 11],
    [1379, '1313243', 12],
    [1380, '1415617', 19],
    [1381, '1515294', 18],
    [1382, '1415750', 19],
    [1383, '1315042', 20],
    [1384, '1313267', 12],
    [1385, '1314238', 16],
    [1386, '1315441', 20],
    [1387, '1412116', 3],
    [1388, '1612161', 1],
    [1389, '1512147', 2],
    [1390, '1314565', 16],
    [1391, '1411617', 7],
    [1392, '1314617', 16],
    [1393, '1515035', 18],
    [1394, '1315587', 20],
    [1395, '1514452', 14],
    [1396, '1415726', 19],
    [1397, '1611853', 5],
    [1398, '1514042', 14],
    [1399, '1613450', 9],
    [1400, '1415719', 19],
    [1401, '1311750', 8],
    [1402, '1313147', 12],
    [1403, '1613811', 9],
    [1404, '1415157', 19],
    [1405, '1614452', 13],
    [1406, '1412086', 3],
    [1407, '1512601', 2],
    [1408, '1315485', 20],
    [1409, '1412227', 3],
    [1410, '1311955', 8],
    [1411, '1612587', 1],
    [1412, '1311754', 8],
];
var students10=[
    [1413, '1613727', 9],
    [1414, '1412143', 3],
    [1415, '1312879', 4],
    [1416, '1614186', 13],
    [1417, '1411441', 7],
    [1418, '1514535', 14],
    [1419, '1313847', 12],
    [1420, '1311852', 8],
    [1421, '1314722', 16],
    [1422, '1511452', 6],
    [1423, '1612615', 1],
    [1424, '1414143', 15],
    [1425, '1512450', 2],
    [1426, '1314751', 16],
    [1427, '1315636', 20],
    [1428, '1415367', 19],
    [1429, '1411822', 7],
    [1430, '1611221', 5],
    [1431, '1415778', 19],
    [1432, '1612851', 1],
    [1433, '1612861', 1],
    [1434, '1314490', 16],
    [1435, '1513651', 10],
    [1436, '1315338', 20],
    [1437, '1514988', 14],
    [1438, '1414778', 15],
    [1439, '1515435', 18],
    [1440, '1311294', 8],
    [1441, '1611468', 5],
    [1442, '1614811', 13],
    [1443, '1515717', 18],
    [1444, '1414490', 15],
    [1445, '1411615', 7],
    [1446, '1615839', 17],
    [1447, '1613108', 9],
    [1448, '1613615', 9],
    [1449, '1311855', 8],
    [1450, '1612267', 1],
    [1451, '1512435', 2],
    [1452, '1615733', 17],
    [1453, '1613751', 9],
    [1454, '1411147', 7],
    [1455, '1415727', 19],
    [1456, '1415668', 19],
    [1457, '1513112', 10],
    [1458, '1613378', 9],
    [1459, '1311161', 8],
    [1460, '1412109', 3],
    [1461, '1313617', 12],
    [1462, '1515852', 18],
    [1463, '1615614', 17],
    [1464, '1615811', 17],
    [1465, '1615727', 17],
    [1466, '1413490', 11],
    [1467, '1414727', 15],
    [1468, '1511617', 6],
    [1469, '1315614', 20],
    [1470, '1611614', 5],
    [1471, '1414367', 15],
    [1472, '1314843', 16],
    [1473, '1412253', 3],
    [1474, '1613411', 9],
    [1475, '1615318', 17],
    [1476, '1515975', 18],
    [1477, '1314617', 16],
    [1478, '1411042', 7],
    [1479, '1313490', 12],
    [1480, '1313108', 12],
    [1481, '1612630', 1],
    [1482, '1411843', 7],
    [1483, '1311774', 8],
    [1484, '1313732', 12],
    [1485, '1415852', 19],
    [1486, '1512806', 2],
    [1487, '1514587', 14],
    [1488, '1413778', 11],
    [1489, '1513485', 10],
    [1490, '1414822', 15],
    [1491, '1515086', 18],
    [1492, '1513988', 10],
    [1493, '1315651', 20],
    [1494, '1615847', 17],
    [1495, '1615112', 17],
    [1496, '1611955', 5],
    [1497, '1313026', 12],
    [1498, '1411267', 7],
    [1499, '1613750', 9],
    [1500, '1313843', 12],
    [1501, '1314367', 16],
    [1502, '1414294', 15],
    [1503, '1613858', 9],
    [1504, '1314750', 16],
    [1505, '1415273', 19],
    [1506, '1612224', 1],
    [1507, '1412318', 3],
    [1508, '1515719', 18],
    [1509, '1412888', 3],
    [1510, '1515118', 18],
    [1511, '1311450', 8],
    [1512, '1411343', 7],
    [1513, '1314614', 16],
    [1514, '1512617', 2],
    [1515, '1412988', 3],
    [1516, '1514289', 14],
    [1517, '1615485', 17],
    [1518, '1413467', 11],
    [1519, '1513289', 10],
    [1520, '1514682', 14],
    [1521, '1315751', 20],
    [1522, '1412343', 3],
    [1523, '1411367', 7],
    [1524, '1311157', 8],
    [1525, '1612719', 1],
    [1526, '1611238', 5],
    [1527, '1512378', 2],
    [1528, '1614636', 13],
    [1529, '1315855', 20],
    [1530, '1512888', 2],
    [1531, '1615822', 17],
    [1532, '1412853', 3],
    [1533, '1615820', 17],
    [1534, '1414839', 15],
    [1535, '1312109', 4],
    [1536, '1515367', 18],
    [1537, '1612197', 1],
    [1538, '1413227', 11],
    [1539, '1312116', 4],
    [1540, '1613343', 9],
    [1541, '1513822', 10],
    [1542, '1612852', 1],
    [1543, '1414109', 15],
    [1544, '1413318', 11],
    [1545, '1611108', 5],
    [1546, '1411822', 7],
    [1547, '1412112', 3],
    [1548, '1413343', 11],
    [1549, '1514158', 14],
    [1550, '1513754', 10],
    [1551, '1312535', 4],
    [1552, '1611852', 5],
    [1553, '1514450', 14],
    [1554, '1612717', 1],
    [1555, '1515732', 18],
    [1556, '1512186', 2],
    [1557, '1513197', 10],
    [1558, '1415490', 19],
    [1559, '1611565', 5],
    [1560, '1314468', 16],
    [1561, '1312446', 4],
    [1562, '1514318', 14],
];
var students11=[
    [1563, '1411452', 7],
    [1564, '1615035', 17],
    [1565, '1315535', 20],
    [1566, '1413733', 11],
    [1567, '1313402', 12],
    [1568, '1614273', 13],
    [1569, '1511157', 6],
    [1570, '1515468', 18],
    [1571, '1315717', 20],
    [1572, '1613851', 9],
    [1573, '1312955', 4],
    [1574, '1612853', 1],
    [1575, '1513086', 10],
    [1576, '1611367', 5],
    [1577, '1313722', 12],
    [1578, '1412858', 3],
    [1579, '1414118', 15],
    [1580, '1314112', 16],
    [1581, '1515108', 18],
    [1582, '1613112', 9],
    [1583, '1411751', 7],
    [1584, '1414556', 15],
    [1585, '1511614', 6],
    [1586, '1511112', 6],
    [1587, '1514733', 14],
    [1588, '1412651', 3],
    [1589, '1613485', 9],
    [1590, '1612722', 1],
    [1591, '1613820', 9],
    [1592, '1611446', 5],
    [1593, '1515042', 18],
    [1594, '1413485', 11],
    [1595, '1515143', 18],
    [1596, '1512343', 2],
    [1597, '1415587', 19],
    [1598, '1513733', 10],
    [1599, '1414411', 15],
    [1600, '1511646', 6],
    [1601, '1514411', 14],
    [1602, '1613485', 9],
    [1603, '1314108', 16],
    [1604, '1415861', 19],
    [1605, '1314822', 16],
    [1606, '1412221', 3],
    [1607, '1411450', 7],
    [1608, '1413682', 11],
    [1609, '1313820', 12],
    [1610, '1414186', 15],
    [1611, '1414843', 15],
    [1612, '1614143', 13],
    [1613, '1613822', 9],
    [1614, '1411238', 7],
    [1615, '1314157', 16],
    [1616, '1314822', 16],
    [1617, '1612289', 1],
    [1618, '1611843', 5],
    [1619, '1514556', 14],
    [1620, '1515722', 18],
    [1621, '1511732', 6],
    [1622, '1612756', 1],
    [1623, '1311726', 8],
    [1624, '1315861', 20],
    [1625, '1413806', 11],
    [1626, '1314227', 16],
    [1627, '1611157', 5],
    [1628, '1611861', 5],
    [1629, '1413888', 11],
    [1630, '1513267', 10],
    [1631, '1412601', 3],
    [1632, '1514273', 14],
    [1633, '1611273', 5],
    [1634, '1415601', 19],
    [1635, '1614852', 13],
    [1636, '1512273', 2],
    [1637, '1511143', 6],
    [1638, '1615238', 17],
    [1639, '1413186', 11],
    [1640, '1515988', 18],
    [1641, '1615534', 17],
    [1642, '1512197', 2],
    [1643, '1611112', 5],
    [1644, '1413452', 11],
    [1645, '1314851', 16],
    [1646, '1514858', 14],
    [1647, '1414147', 15],
    [1648, '1515338', 18],
    [1649, '1613435', 9],
    [1650, '1413630', 11],
    [1651, '1614733', 13],
    [1652, '1314861', 16],
    [1653, '1615778', 17],
    [1654, '1511273', 6],
    [1655, '1515273', 18],
    [1656, '1611617', 5],
    [1657, '1611450', 5],
    [1658, '1512751', 2],
    [1659, '1413614', 11],
    [1660, '1613587', 9],
    [1661, '1414450', 15],
    [1662, '1312112', 4],
    [1663, '1515822', 18],
    [1664, '1412378', 3],
    [1665, '1614756', 13],
    [1666, '1311468', 8],
    [1667, '1612654', 1],
    [1668, '1612143', 1],
    [1669, '1611411', 5],
    [1670, '1514654', 14],
    [1671, '1411109', 7],
    [1672, '1311026', 8],
    [1673, '1415468', 19],
    [1674, '1313186', 12],
    [1675, '1413157', 11],
    [1676, '1513751', 10],
    [1677, '1614042', 13],
    [1678, '1415197', 19],
    [1679, '1515851', 18],
    [1680, '1311988', 8],
    [1681, '1613861', 9],
    [1682, '1512719', 2],
    [1683, '1614975', 13],
    [1684, '1512858', 2],
    [1685, '1312161', 4],
    [1686, '1312467', 4],
    [1687, '1614806', 13],
    [1688, '1415587', 19],
    [1689, '1511147', 6],
    [1690, '1313646', 12],
    [1691, '1615143', 17],
    [1692, '1312822', 4],
    [1693, '1512682', 2],
    [1694, '1615229', 17],
    [1695, '1515879', 18],
    [1696, '1611343', 5],
    [1697, '1615853', 17],
    [1698, '1513839', 10],
    [1699, '1515955', 18],
    [1700, '1511435', 6],
    [1701, '1613732', 9],
    [1702, '1315750', 20],
    [1703, '1311617', 8],
    [1704, '1514338', 14],
    [1705, '1312732', 4],
    [1706, '1312888', 4],
    [1707, '1613109', 9],
    [1708, '1311727', 8],
    [1709, '1613267', 9],
    [1710, '1313587', 12],
    [1711, '1314224', 16],
    [1712, '1515229', 18],
];
var students12=[
    [1713, '1614112', 13],
    [1714, '1613338', 9],
    [1715, '1312108', 4],
    [1716, '1311861', 8],
    [1717, '1413886', 11],
    [1718, '1613042', 9],
    [1719, '1513468', 10],
    [1720, '1515534', 18],
    [1721, '1313273', 12],
    [1722, '1414452', 15],
    [1723, '1512108', 2],
    [1724, '1512587', 2],
    [1725, '1512468', 2],
    [1726, '1611402', 5],
    [1727, '1614556', 13],
    [1728, '1614294', 13],
    [1729, '1413143', 11],
    [1730, '1411294', 7],
    [1731, '1412811', 3],
    [1732, '1314143', 16],
    [1733, '1611646', 5],
    [1734, '1611774', 5],
    [1735, '1515556', 18],
    [1736, '1313343', 12],
    [1737, '1314587', 16],
    [1738, '1611485', 5],
    [1739, '1512289', 2],
    [1740, '1411847', 7],
    [1741, '1311668', 8],
    [1742, '1612855', 1],
    [1743, '1613778', 9],
    [1744, '1413617', 11],
    [1745, '1314719', 16],
    [1746, '1511727', 6],
    [1747, '1513343', 10],
    [1748, '1614587', 13],
    [1749, '1311651', 8],
    [1750, '1612109', 1],
    [1751, '1313289', 12],
    [1752, '1614026', 13],
    [1753, '1511267', 6],
    [1754, '1513601', 10],
    [1755, '1411565', 7],
    [1756, '1515855', 18],
    [1757, '1412186', 3],
    [1758, '1511109', 6],
    [1759, '1411717', 7],
    [1760, '1314281', 16],
    [1761, '1413861', 11],
    [1762, '1615719', 17],
    [1763, '1515733', 18],
    [1764, '1512452', 2],
    [1765, '1615243', 17],
    [1766, '1615411', 17],
    [1767, '1412289', 3],
    [1768, '1414855', 15],
    [1769, '1515806', 18],
    [1770, '1311243', 8],
    [1771, '1513955', 10],
    [1772, '1413651', 11],
    [1773, '1515161', 18],
    [1774, '1514485', 14],
    [1775, '1513732', 10],
    [1776, '1314411', 16],
    [1777, '1515490', 18],
    [1778, '1613446', 9],
    [1779, '1314847', 16],
    [1780, '1313888', 12],
    [1781, '1413042', 11],
    [1782, '1515636', 18],
    [1783, '1613186', 9],
    [1784, '1413668', 11],
    [1785, '1615158', 17],
    [1786, '1612318', 1],
    [1787, '1415485', 19],
    [1788, '1514806', 14],
    [1789, '1314485', 16],
    [1790, '1612806', 1],
    [1791, '1513338', 10],
    [1792, '1613143', 9],
    [1793, '1412955', 3],
    [1794, '1414732', 15],
    [1795, '1612733', 1],
    [1796, '1511161', 6],
    [1797, '1414042', 15],
    [1798, '1414435', 15],
    [1799, '1313238', 12],
    [1800, '1512467', 2],
    [1801, '1311140', 8],
    [1802, '1514741', 14],
    [1803, '1513861', 10],
    [1804, '1313446', 12],
    [1805, '1411318', 7],
    [1806, '1611338', 5],
    [1807, '1613147', 9],
    [1808, '1613741', 9],
    [1809, '1312367', 4],
    [1810, '1512158', 2],
    [1811, '1613886', 9],
    [1812, '1514617', 14],
    [1813, '1414858', 15],
    [1814, '1614847', 13],
    [1815, '1514646', 14],
    [1816, '1315112', 20],
    [1817, '1512717', 2],
    [1818, '1515811', 18],
    [1819, '1312751', 4],
    [1820, '1414975', 15],
    [1821, '1613879', 9],
    [1822, '1312229', 4],
    [1823, '1413267', 11],
    [1824, '1315617', 20],
    [1825, '1614988', 13],
    [1826, '1611601', 5],
    [1827, '1415221', 19],
    [1828, '1311446', 8],
    [1829, '1514886', 14],
    [1830, '1613227', 9],
    [1831, '1513587', 10],
    [1832, '1313988', 12],
    [1833, '1312343', 4],
    [1834, '1512651', 2],
    [1835, '1513294', 10],
    [1836, '1513490', 10],
    [1837, '1611630', 5],
    [1838, '1612587', 1],
    [1839, '1612112', 1],
    [1840, '1614402', 13],
    [1841, '1414719', 15],
    [1842, '1314402', 16],
    [1843, '1515727', 18],
    [1844, '1413229', 11],
    [1845, '1415682', 19],
    [1846, '1511847', 6],
    [1847, '1413654', 11],
    [1848, '1511535', 6],
    [1849, '1311811', 8],
    [1850, '1312719', 4],
    [1851, '1511343', 6],
    [1852, '1615294', 17],
    [1853, '1514140', 14],
    [1854, '1614116', 13],
    [1855, '1612467', 1],
    [1856, '1615227', 17],
    [1857, '1614108', 13],
    [1858, '1414289', 15],
    [1859, '1512042', 2],
    [1860, '1513485', 10],
    [1861, '1412157', 3],
    [1862, '1313035', 12],
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
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', students9), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', students10), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', students11), function (error, results, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            function (callback) {
                connection.query(format('INSERT INTO students (id,stud_id,class_id) VALUES %L', students12), function (error, results, fields) {
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
