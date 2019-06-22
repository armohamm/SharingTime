<?php

require './function.php';

$code = $_GET['code'];

/**
 * 获取用户是否为行程的拥有者
 * @param int $tripId 行程id
 * @param string $openid 用户id
 */
function isOwner($tripId, $openid) {
    return json_encode(array('code' => '0', 'isOwner' => getIsOwner($tripId, $openid)));
}

function getTripUserData($tripId, $openid) {
    $trip = getTrip($tripId);

    if(getIsOwner($tripId, $openid) == 1) {
        $currentCount = getCurrentCount($tripId);

        return json_encode(array('code' => 0, 'name' => $trip['name'], 'count' => $trip['count'], 'tripDate' => $trip['date'], 'description' => $trip['description'], 'currentCount' => $currentCount));
    }

    return json_encode(array('code' => 0, 'name' => $trip['name'], 'count' => $trip['count'], 'tripDate' => $trip['date'], 'description' => $trip['description']));

}

if($code == 0) {
    $tripId = $_GET['tripId'];
    $openid = $_GET['openid'];

    echo isOwner($tripId, $openid);
} else if($code == 1){
    $tripId = $_GET['tripId'];
    $openid = $_GET['openid'];

    echo getTripUserData($tripId, $openid);
}

?>