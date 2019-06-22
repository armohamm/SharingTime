<?php

require './function.php';

$code = $_GET['code'];


/**
 * 参与行程
 */
function joinTrip($openid, $tripId, $timeData) {
    // 得到tripUserId
    $tripUserId = getTripUserId($openid, $tripId);

    // 删除行程用户所对应的数据
    deleteData($tripUserId);

    // 插入data
    $count = insertData($tripUserId, $timeData);

    echo json_encode(array('code' => '0', 'count' => $count));

    // 计算行程结果
    doTripResult($tripId);
}

/**
 * 
 */
function getTripUserData($openid, $tripId) {
    $tripUserId = getTripUserId($openid, $tripId);

    $result = getData($tripUserId);

    if(count($result) == 0)
        return json_encode(array('code' => 1));

    $startTime = array();
    $endTime = array();
    $arr = array();
    $num = 0;
    foreach ($result as &$value) {
        $startTime[] = $value['startTime'];
        $endTime[] = $value['endTime'];
        $arr[] = $num;
        $num ++;
    }

    return json_encode(array('code' => 0, 'startTime' => $startTime, 'endTime' => $endTime, 'arr' => $arr));
}


if($code == 0){
    $openid = $_GET['openid'];
    $tripId = $_GET['tripId'];
    $timeData = $_GET['timeData'];

    $timeData = json_decode($timeData);

    joinTrip($openid, $tripId, $timeData);
} else if ($code == 1){
    $openid = $_GET['openid'];
    $tripId = $_GET['tripId'];

    echo getTripUserData($openid, $tripId);
}

?>