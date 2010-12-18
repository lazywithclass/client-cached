<?php
$dbhost = 'localhost';
$dbuser = 'test';
$dbpass = 'test';
$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');
$dbname = 'test_database';
mysql_select_db($dbname);

$photogroup=mysql_query('SELECT count(DISTINCT email) as count
		FROM test_table tt
		JOIN test_table2 tt2 ON tt.id = tt2.id') or die(mysql_error());
$response = array();
while($row = mysql_fetch_array($photogroup)){
    $response["count"] = $row["count"];
}
print(json_encode($response)); 
?>