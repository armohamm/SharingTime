<?php

require './function.php';

$openid = $_GET['openid'];

// 获取用户行程
$result0 = getTrips($openid, $name = 1, $count = 1, $date = 0, $description = 0, $data = 1);  // 用户创建的行程
$result1 = getTrips($openid, $name = 1, $count = 1, $date = 0, $description = 0, $data = 0);  // 用户参与的行程

$data0 = array();
foreach ($result0 as &$value) {
    $data0[] = array('tripId' => $value['tripId'], 'name' => $value['name'], 'currentCount' => getCurrentCount($value['tripId']), 'count' => $value['count']);
}

$data1 = array();
foreach ($result1 as &$value) {
    $data1[] = array('tripId' => $value['tripId'], 'name' => $value['name'], 'currentCount' => getCurrentCount($value['tripId']), 'count' => $value['count']);
}

$dataALL = array($data0, $data1);

echo json_encode($dataALL);

?>