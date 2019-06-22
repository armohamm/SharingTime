<?php

require './function.php';

$code = $_GET['code'];

if($code == 0){
    $tripId = $_GET['tripId'];
    $openid = $_GET['openid'];

    isJoin($tripId, $openid);
}

function isJoin($tripId, $openid) {
    $tripUserId = getTripUserId($openid, $tripId);
    $result = getData($tripUserId);

    if(count($result) == 0)
        return json_encode(array('code' => 1));

    $tripData = getTrip($tripId);

    $currentCount = getCurrentCount($tripId);

    $result = getResult($tripId);

    echo json_encode(array('code' => 0, 'name' => $tripData['name'], 'count' => $tripData['count'], 'currentCount' => $currentCount, 'result' => $result));

}

?>