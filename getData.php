<?php
$dbhost = 'localhost';
$dbuser = 'test';
$dbpass = 'test';
$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');
$dbname = 'test_database';
mysql_select_db($dbname);

$photogroup=mysql_query('SELECT DISTINCT email, tt.id, city, country, tt2.*
                         FROM test_table tt
                         JOIN test_table2 tt2 ON tt.id = tt2.id') or die(mysql_error());
$response = array();
while($row = mysql_fetch_array($photogroup)){
    $response[$row["id"]] = array ("id"=>$row["id"],
                                "email"=>$row["email"],
                                "city"=>$row["city"]);
}
print(json_encode($response)); 
?>