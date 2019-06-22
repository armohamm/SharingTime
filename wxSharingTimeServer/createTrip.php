<?php

require './function.php';

$openid = $_GET['openid'];
$name = $_GET['name'];
$count = $_GET['count'];
$date = $_GET['tripDate'];
$description = $_GET['description'];

/**
 * 创建行程
 * 返回 成功状态码和行程id的 json对象
 */
function createTrip($openid, $name, $count, $date, $description) {
    // 插入数据，获取tripId
    $tripId = insertTrip($name, $count, $date, $description);

    // 给创建者匹配行程
    $tripUserId = insertTripuser($tripId, $openid, 1);

    return json_encode(array('code' => '0', 'tripId' => $tripId));
}

echo createTrip($openid, $name, $count, $date, $description);

?>