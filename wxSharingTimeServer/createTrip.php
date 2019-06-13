<?php

require './function.php';

$openid = $_GET['openid'];
$name = $_GET['name'];
$count = $_GET['count'];
$date = $_GET['tripDate'];
$description = $_GET['description'];

echo createTrip($openid, $name, $count, $date, $description);

?>